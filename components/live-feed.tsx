import type { LiveEvent } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';

type Props = {
  events: LiveEvent[];
};

const levelStyles: Record<LiveEvent['level'], string> = {
  info: 'border-slate-700 bg-slate-900/70 text-slate-200',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  critical: 'border-red-500/40 bg-red-500/10 text-red-200',
};

export function LiveFeed({ events }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60">
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Flux temps réel</h2>
        <span className="text-xs text-slate-500">AgentOps</span>
      </header>
      <div className="scroll-shadow max-h-80 space-y-2 overflow-y-auto p-5 text-sm">
        {events.length === 0 && <p className="text-slate-500">Aucune activité récente.</p>}
        {events.map((event) => (
          <article
            key={event.id}
            className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${levelStyles[event.level]}`}
          >
            <div>
              <p className="font-medium">{event.message}</p>
              <p className="mt-1 text-xs text-slate-400">{formatTimestamp(event.timestamp)}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">{event.level}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
