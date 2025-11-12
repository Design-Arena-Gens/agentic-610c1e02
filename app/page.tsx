import { AutomationConsole } from '@/components/automation-console';
import { StatusOverview } from '@/components/status-overview';
import { getPanelClient } from '@/lib/panel-client';
import { getAutomationSnapshot } from '@/lib/state';

export default async function Home() {
  const client = getPanelClient();
  const [requests, snapshot] = await Promise.all([client.fetchRequests(), getAutomationSnapshot()]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Safe Guardian Ops</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          IA Sentinel — Résolution automatique des incidents critiques
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Supervision 24/7 des demandes entrantes, génération de réponses contextualisées et plan d’action instantané pour
          le panneau d’administration Safe Guardian.
        </p>
      </header>

      <StatusOverview snapshot={snapshot} />
      <AutomationConsole initialRequests={requests} initialSnapshot={snapshot} />
    </main>
  );
}
