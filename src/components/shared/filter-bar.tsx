import { type ReactNode } from 'react';

export function FilterBar({ children }: { children: ReactNode }) {
  return <section className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-4">{children}</section>;
}
