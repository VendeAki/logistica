import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { useMotoboy } from '@/features/motoboys/hooks/use-motoboys';

export function MotoboyDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useMotoboy(id);

  if (isLoading) return <p>Carregando...</p>;
  if (!data) return <p>Motoboy não encontrado.</p>;

  return (
    <div>
      <PageHeader title={data.name} description="Detalhes do motoboy" />
      <section className="card grid gap-3 md:grid-cols-2">
        <p><strong>CPF:</strong> {data.cpf}</p>
        <p><strong>Telefone:</strong> {data.phone}</p>
        <p><strong>E-mail:</strong> {data.email ?? '-'}</p>
        <p><strong>Região:</strong> {data.region ?? '-'}</p>
        <p><strong>Status:</strong> {data.status}</p>
      </section>
    </div>
  );
}
