import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/motoboys', label: 'Motoboys' },
  { to: '/service-orders', label: 'Ordens de Serviço' },
  { to: '/distribution', label: 'Distribuição' },
  { to: '/users', label: 'Usuários' },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4">
        <Link to="/dashboard" className="mb-6 block text-lg font-bold">Logística SaaS</Link>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="p-4 md:p-6">
        <header className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
          <div>
            <p className="text-xs text-slate-500">Você está em</p>
            <p className="font-semibold">{pathname}</p>
          </div>
          <Button variant="secondary" onClick={() => logoutMutation.mutate()}>Sair</Button>
        </header>
        <Outlet />
      </section>
    </div>
  );
}
