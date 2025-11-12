import type { AutomationSnapshot } from '@/lib/types';

type Props = {
  snapshot: AutomationSnapshot;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(1)} %`;
const formatTime = (seconds: number) => `${Math.round(seconds)} s`;

export function StatusOverview({ snapshot }: Props) {
  const { metrics } = snapshot;

  const cards = [
    {
      label: 'Résolus (24h)',
      value: metrics.resolvedToday,
      highlight: `${metrics.throughputPerHour} / h`,
    },
    {
      label: 'Précision Agent',
      value: formatPercent(metrics.accuracyScore),
      highlight: metrics.slaBreaches > 0 ? `${metrics.slaBreaches} SLA` : '0 incident',
    },
    {
      label: 'Temps moyen',
      value: formatTime(metrics.avgHandleTimeSeconds),
      highlight: metrics.enabled ? 'Auto ON' : 'Auto OFF',
    },
    {
      label: 'Dernier run',
      value: metrics.lastRunAt
        ? new Date(metrics.lastRunAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '—',
      highlight: `${metrics.queueSize} en file`,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 ring-1 ring-slate-800"
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
          <p className="mt-1 text-sm font-medium text-slate-300">{card.highlight}</p>
        </article>
      ))}
    </section>
  );
}
