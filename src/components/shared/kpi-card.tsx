interface Props {
  label: string;
  value: string | number;
  helper?: string;
}

export function KpiCard({ label, value, helper }: Props) {
  return (
    <article className="card">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </article>
  );
}
