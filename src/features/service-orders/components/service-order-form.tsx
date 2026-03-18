import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceOrderSchema, type ServiceOrderInput } from '@/features/service-orders/schemas/service-order.schema';
import { Button } from '@/components/ui/button';

interface Props {
  initialValues?: Partial<ServiceOrderInput>;
  onSubmit: (values: ServiceOrderInput) => void;
  loading?: boolean;
}

export function ServiceOrderForm({ initialValues, onSubmit, loading }: Props) {
  const form = useForm<ServiceOrderInput>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: { status: 'pendente', priority: 'media', service_type: 'ligacao' },
  });

  useEffect(() => {
    if (initialValues) form.reset(initialValues as ServiceOrderInput);
  }, [form, initialValues]);

  return (
    <form className="grid gap-3 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <input className="rounded border p-2" placeholder="Número da OS" {...form.register('os_number')} />
      <select className="rounded border p-2" {...form.register('service_type')}>
        <option value="ligacao">Ligação</option><option value="religacao">Religação</option><option value="corte">Corte</option><option value="cobranca">Cobrança</option><option value="outro">Outro</option>
      </select>
      <input className="rounded border p-2" placeholder="Cliente" {...form.register('customer_name')} />
      <input className="rounded border p-2" placeholder="Telefone" {...form.register('customer_phone')} />
      <input className="rounded border p-2 md:col-span-2" placeholder="Endereço" {...form.register('address_line')} />
      <input className="rounded border p-2" placeholder="Número" {...form.register('address_number')} />
      <input className="rounded border p-2" placeholder="Bairro" {...form.register('district')} />
      <select className="rounded border p-2" {...form.register('priority')}>
        <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option><option value="urgente">Urgente</option>
      </select>
      <select className="rounded border p-2" {...form.register('status')}>
        <option value="pendente">Pendente</option><option value="atribuida">Atribuída</option><option value="em_rota">Em rota</option><option value="em_execucao">Em execução</option><option value="concluida">Concluída</option><option value="nao_concluida">Não concluída</option><option value="cancelada">Cancelada</option>
      </select>
      <textarea className="rounded border p-2 md:col-span-2" placeholder="Observações" {...form.register('notes')} />
      <Button type="submit" className="md:col-span-2" disabled={loading}>{loading ? 'Salvando...' : 'Salvar OS'}</Button>
    </form>
  );
}
