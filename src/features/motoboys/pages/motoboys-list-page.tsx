import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { FilterBar } from '@/components/shared/filter-bar';
import { FormDrawer } from '@/components/shared/form-drawer';
import { MotoboyForm } from '@/features/motoboys/components/motoboy-form';
import { useInactivateMotoboy, useMotoboys, useSaveMotoboy } from '@/features/motoboys/hooks/use-motoboys';

export function MotoboysListPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useMotoboys(search);
  const saveMutation = useSaveMotoboy();
  const inactivateMutation = useInactivateMotoboy();

  const rows = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <PageHeader title="Motoboys" description="Gestão cadastral e produtividade." actions={<Button onClick={() => setOpen(true)}>Novo motoboy</Button>} />
      <FilterBar>
        <input className="rounded border p-2" placeholder="Buscar por nome/telefone/região" value={search} onChange={(e) => setSearch(e.target.value)} />
      </FilterBar>
      {isLoading ? (
        <p>Carregando...</p>
      ) : rows.length ? (
        <DataTable
          data={rows}
          columns={[
            { key: 'nome', header: 'Nome', render: (m) => <Link className="text-brand-700" to={`/motoboys/${m.id}`}>{m.name}</Link> },
            { key: 'contato', header: 'Contato', render: (m) => m.phone },
            { key: 'regiao', header: 'Região', render: (m) => m.region ?? '-' },
            { key: 'status', header: 'Status', render: (m) => m.status },
            { key: 'acoes', header: 'Ações', render: (m) => <Button variant="ghost" onClick={() => inactivateMutation.mutate(m.id)}>Inativar</Button> },
          ]}
        />
      ) : (
        <EmptyState message="Nenhum motoboy encontrado." />
      )}
      <FormDrawer open={open} title="Cadastrar motoboy" onClose={() => setOpen(false)}>
        <MotoboyForm
          loading={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutate(values, { onSuccess: () => setOpen(false) })}
        />
      </FormDrawer>
    </div>
  );
}
