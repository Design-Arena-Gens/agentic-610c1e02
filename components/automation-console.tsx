'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { LiveFeed } from './live-feed';
import { RequestBoard } from './request-board';
import type { AgentResolution, AutomationSnapshot, PanelRequest } from '@/lib/types';

type RequestsQueryResponse = {
  requests: PanelRequest[];
  snapshot: AutomationSnapshot;
};

type ResolutionPayload = {
  success: boolean;
  request: PanelRequest;
  resolution: AgentResolution;
  report: {
    id: string;
    requestId: string;
    generatedAt: string;
    summary: string;
    confidence: number;
    outboundMessage: string;
    actionItems: AgentResolution['actionItems'];
    auditTrail: string[];
    escalationRecommended: boolean;
  };
  delivery: {
    delivered: boolean;
    remote: unknown;
  };
};

type Props = {
  initialRequests: PanelRequest[];
  initialSnapshot: AutomationSnapshot;
};

async function fetchRequests(): Promise<RequestsQueryResponse> {
  const response = await fetch('/api/requests', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Impossible de récupérer les tickets');
  }
  return response.json();
}

async function toggleAutomation(enabled: boolean) {
  const response = await fetch('/api/automation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) {
    throw new Error('Échec changement état automation');
  }
  return response.json() as Promise<AutomationSnapshot>;
}

async function resolveRequest(requestId: string) {
  const response = await fetch('/api/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requestId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? 'Résolution impossible');
  }

  return response.json() as Promise<ResolutionPayload>;
}

export function AutomationConsole({ initialRequests, initialSnapshot }: Props) {
  const queryClient = useQueryClient();
  const [lastResolution, setLastResolution] = useState<ResolutionPayload | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRequests,
    initialData: {
      requests: initialRequests,
      snapshot: initialSnapshot,
    },
    refetchInterval: 15_000,
  });

  const resolveMutation = useMutation({
    mutationFn: (requestId: string) => resolveRequest(requestId),
    onSuccess: (payload) => {
      setLastResolution(payload);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) => toggleAutomation(enabled),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(['requests'], (current: RequestsQueryResponse | undefined) => {
        if (!current) {
          return {
            requests: initialRequests,
            snapshot,
          };
        }
        return {
          ...current,
          snapshot,
        };
      });
    },
  });

  const snapshot = data?.snapshot ?? initialSnapshot;
  const requests = data?.requests ?? initialRequests;

  const automationEnabled = snapshot.metrics.enabled;
  const isResolving = resolveMutation.isPending;

  const resolutionCard = useMemo(() => {
    if (!lastResolution) {
      return null;
    }
    const { request, resolution, delivery } = lastResolution;
    return (
      <article className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-100">
        <header className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-300">
          <span>Résolution automatique</span>
          <span>{new Date(lastResolution.report.generatedAt).toLocaleTimeString('fr-FR')}</span>
        </header>
        <h3 className="mt-2 text-lg font-semibold text-emerald-50">{request.subject}</h3>
        <p className="mt-2 whitespace-pre-line text-sm text-emerald-100">{resolution.outboundMessage}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-300">Diagnostic</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Confiance : {(resolution.inference.confidence * 100).toFixed(1)} %</li>
              <li>Risque : {resolution.inference.riskLevel}</li>
              <li>{resolution.inference.rootCause}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-300">Plan d&apos;action</p>
            <ul className="mt-2 space-y-1 text-sm">
              {resolution.actionItems.map((action) => (
                <li key={action.title}>
                  • {action.title} [{action.assignee}] ({action.etaMinutes} min)
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs uppercase tracking-wide text-emerald-300">
          Livraison : {delivery.delivered ? 'panel confirmé' : 'en attente de confirmation'}
        </p>
      </article>
    );
  }, [lastResolution]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <RequestBoard
          requests={requests}
          onResolve={(request) => resolveMutation.mutate(request.id)}
          isResolving={isResolving}
        />
        {resolutionCard}
        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error.message}</p>}
      </div>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <header className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Automation</p>
              <h2 className="text-xl font-semibold text-white">Mode {automationEnabled ? 'Actif' : 'Veille'}</h2>
            </div>
            <span
              className={`h-3 w-3 rounded-full ${
                automationEnabled ? 'bg-emerald-400 shadow shadow-emerald-400/60' : 'bg-slate-600'
              }`}
            />
          </header>
          <p className="mt-3 text-sm text-slate-300">
            {automationEnabled
              ? 'L’agent répond et résout les tickets de manière autonome.'
              : 'Les réponses automatiques sont en pause. Relancez pour reprendre la main.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toggleMutation.mutate(!automationEnabled)}
              disabled={toggleMutation.isPending}
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
            >
              {automationEnabled ? 'Mettre en pause' : 'Relancer'}
            </button>
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['requests'] })}
              disabled={isFetching}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-40"
            >
              Rafraîchir
            </button>
          </div>
        </section>
        <LiveFeed events={snapshot.liveEvents} />
      </aside>
    </div>
  );
}
