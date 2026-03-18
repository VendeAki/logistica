import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Timeline } from '@/components/shared/timeline';
import { useServiceOrder } from '@/features/service-orders/hooks/use-service-orders';

export function ServiceOrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useServiceOrder(id);

  if (isLoading) return <p>Carregando...</p>;
  if (!data) return <p>OS não encontrada.</p>;

  return (
    <div className="space-y-4">
      <PageHeader title={`OS ${data.os_number}`} description="Detalhes operacionais e timeline." actions={<StatusBadge status={data.status} />} />
      <section className="card grid gap-3 md:grid-cols-2">
        <p><strong>Cliente:</strong> {data.customer_name}</p>
        <p><strong>Serviço:</strong> {data.service_type}</p>
        <p><strong>Endereço:</strong> {data.address_line}, {data.address_number ?? 's/n'}</p>
        <p><strong>Prioridade:</strong> {data.priority}</p>
        <p><strong>Motoboy:</strong> {(data.motoboys as { name: string } | null)?.name ?? 'Não atribuído'}</p>
      </section>
      <section className="card">
        <h2 className="mb-2 text-lg font-semibold">Histórico de eventos</h2>
        <Timeline events={(data.service_order_history ?? []).map((event: any) => ({ id: event.id, title: event.event_type, description: event.description, at: event.created_at }))} />
      </section>
    </div>
  );
}
