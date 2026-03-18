import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { useUsers } from '@/features/users/hooks/use-users';

export function UsersPage() {
  const { data, isLoading } = useUsers();

  return (
    <div>
      <PageHeader title="Usuários e permissões" description="Base inicial de perfis, papéis e status." />
      {isLoading ? <p>Carregando...</p> : data?.length ? (
        <DataTable
          data={data}
          columns={[
            { key: 'nome', header: 'Nome', render: (u) => u.full_name ?? '-' },
            { key: 'role', header: 'Perfil', render: (u) => u.role },
            { key: 'status', header: 'Status', render: (u) => (u.is_active ? 'Ativo' : 'Inativo') },
          ]}
        />
      ) : <EmptyState message="Nenhum usuário encontrado." />}
    </div>
  );
}
