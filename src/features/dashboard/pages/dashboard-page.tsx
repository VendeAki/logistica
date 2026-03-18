import { KpiCard } from '@/components/shared/kpi-card';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';

export function DashboardPage() {
  const { metrics, latestOrders, ranking } = useDashboard();

  const m = metrics.data;
  return (
    <div>
      <PageHeader title="Dashboard operacional" description="Indicadores do dia, produtividade e últimas movimentações." />
      {m && (
        <section className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="OS no dia" value={m.totalToday} />
          <KpiCard label="Pendentes" value={m.pending} />
          <KpiCard label="Em andamento" value={m.inProgress} />
          <KpiCard label="Concluídas" value={m.completed} />
          <KpiCard label="Taxa conclusão" value={`${m.completionRate}%`} />
        </section>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Últimas OS</h2>
          {latestOrders.data?.length ? (
            <DataTable
              data={latestOrders.data}
              columns={[
                { key: 'os', header: 'OS', render: (o) => o.os_number },
                { key: 'cliente', header: 'Cliente', render: (o) => o.customer_name },
                { key: 'prioridade', header: 'Prioridade', render: (o) => o.priority },
                { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
              ]}
            />
          ) : (
            <EmptyState message="Sem ordens recentes." />
          )}
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Ranking de produtividade</h2>
          <div className="card space-y-2">
            {ranking.data?.length ? ranking.data.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded border border-slate-200 p-2">
                <p>{row.name}</p>
                <strong>{row.total}</strong>
              </div>
            )) : <p className="text-sm text-slate-500">Sem dados.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
