import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { ServiceOrderForm } from '@/features/service-orders/components/service-order-form';
import { useSaveServiceOrder, useServiceOrder } from '@/features/service-orders/hooks/use-service-orders';

export function ServiceOrderFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const detailQuery = useServiceOrder(id);
  const saveMutation = useSaveServiceOrder(id);

  return (
    <div>
      <PageHeader title={id ? 'Editar OS' : 'Criar OS'} />
      <div className="card">
        <ServiceOrderForm
          initialValues={detailQuery.data}
          loading={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutate(values, { onSuccess: () => navigate('/service-orders') })}
        />
      </div>
    </div>
  );
}
