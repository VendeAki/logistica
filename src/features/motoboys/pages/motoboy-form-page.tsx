import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { MotoboyForm } from '@/features/motoboys/components/motoboy-form';
import { useMotoboy, useSaveMotoboy } from '@/features/motoboys/hooks/use-motoboys';

export function MotoboyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const detailQuery = useMotoboy(id);
  const saveMutation = useSaveMotoboy(id);

  return (
    <div>
      <PageHeader title={id ? 'Editar motoboy' : 'Cadastrar motoboy'} />
      <div className="card max-w-2xl">
        <MotoboyForm
          initialValues={detailQuery.data}
          loading={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutate(values, { onSuccess: () => navigate('/motoboys') })}
        />
      </div>
    </div>
  );
}
