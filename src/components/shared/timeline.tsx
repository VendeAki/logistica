interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  at: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="relative border-l border-slate-200 pl-4">
          <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand-600" />
          <p className="text-sm font-semibold text-slate-900">{event.title}</p>
          <p className="text-xs text-slate-500">{event.description}</p>
          <p className="text-xs text-slate-400">{new Date(event.at).toLocaleString('pt-BR')}</p>
        </li>
      ))}
    </ol>
  );
}
