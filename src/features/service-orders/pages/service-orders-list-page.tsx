import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { FormDrawer } from '@/components/shared/form-drawer';
import { ServiceOrderForm } from '@/features/service-orders/components/service-order-form';
import { useSaveServiceOrder, useServiceOrders } from '@/features/service-orders/hooks/use-service-orders';
import { StatusBadge } from '@/components/shared/status-badge';

export function ServiceOrdersListPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useServiceOrders({ status, query });
  const saveMutation = useSaveServiceOrder();

  return (
    <div>
      <PageHeader title="Ordens de Serviço" description="Cadastro, filtros e acompanhamento da operação." actions={<Button onClick={() => setOpen(true)}>Nova OS</Button>} />
      <FilterBar>
        <input className="rounded border p-2" placeholder="Buscar por OS/cliente/endereço" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="atribuida">Atribuída</option>
          <option value="em_execucao">Em execução</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </FilterBar>
      {isLoading ? <p>Carregando...</p> : data?.length ? (
        <DataTable
          data={data}
          columns={[
            { key: 'numero', header: 'OS', render: (o) => <Link className="text-brand-700" to={`/service-orders/${o.id}`}>{o.os_number}</Link> },
            { key: 'cliente', header: 'Cliente', render: (o) => o.customer_name },
            { key: 'tipo', header: 'Serviço', render: (o) => o.service_type },
            { key: 'motoboy', header: 'Motoboy', render: (o) => (o.motoboys as { name: string } | null)?.name ?? 'Não atribuído' },
            { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
          ]}
        />
      ) : <EmptyState message="Sem ordens para os filtros informados." />}
      <FormDrawer open={open} title="Criar ordem de serviço" onClose={() => setOpen(false)}>
        <ServiceOrderForm onSubmit={(v) => saveMutation.mutate(v, { onSuccess: () => setOpen(false) })} loading={saveMutation.isPending} />
      </FormDrawer>
    </div>
  );
}
