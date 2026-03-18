import { type ReactNode } from 'react';

export function FormDrawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40">
      <aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-sm text-slate-600" onClick={onClose}>Fechar</button>
        </div>
        {children}
      </aside>
    </div>
  );
}
