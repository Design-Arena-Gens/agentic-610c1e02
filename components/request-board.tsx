import type { PanelRequest } from '@/lib/types';
import { minutesBetween } from '@/lib/utils';

type Props = {
  requests: PanelRequest[];
  onResolve?: (request: PanelRequest) => void;
  isResolving?: boolean;
};

const priorityStyles: Record<PanelRequest['priority'], string> = {
  critical: 'border-red-400/40 bg-red-500/10 text-red-200',
  high: 'border-orange-400/40 bg-orange-500/10 text-orange-200',
  medium: 'border-blue-400/40 bg-blue-500/10 text-blue-200',
  low: 'border-slate-600/70 bg-slate-700/20 text-slate-200',
};

export function RequestBoard({ requests, onResolve, isResolving }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60">
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Tickets en cours</h2>
          <p className="text-xs text-slate-500">{requests.length} actifs en file</p>
        </div>
      </header>
      <div className="space-y-3 p-5">
        {requests.length === 0 && <p className="text-sm text-slate-400">File vide. Surveillance passive active.</p>}
        {requests.map((request) => (
          <article key={request.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{request.id}</p>
                <h3 className="text-lg font-semibold text-white">{request.subject}</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityStyles[request.priority]}`}>
                {request.priority.toUpperCase()}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">{request.description}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-slate-800/60 px-2 py-1">{request.category}</span>
              <span>
                {request.requester.name} · {request.requester.role}
              </span>
              <span>Canal: {request.requester.channel}</span>
              <span>Attente: {minutesBetween(request.createdAt)} min</span>
            </div>

            {onResolve && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onResolve(request)}
                  disabled={isResolving}
                  className="rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
                >
                  Résoudre automatiquement
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
