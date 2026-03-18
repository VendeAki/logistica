import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motoboySchema, type MotoboyInput } from '@/features/motoboys/schemas/motoboy.schema';
import { Button } from '@/components/ui/button';

interface Props {
  initialValues?: Partial<MotoboyInput>;
  onSubmit: (values: MotoboyInput) => void;
  loading?: boolean;
}

export function MotoboyForm({ initialValues, onSubmit, loading }: Props) {
  const form = useForm<MotoboyInput>({ resolver: zodResolver(motoboySchema), defaultValues: { status: 'ativo' } });

  useEffect(() => {
    if (initialValues) form.reset(initialValues as MotoboyInput);
  }, [form, initialValues]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <input className="w-full rounded border p-2" placeholder="Nome completo" {...form.register('name')} />
      <input className="w-full rounded border p-2" placeholder="CPF" {...form.register('cpf')} />
      <input className="w-full rounded border p-2" placeholder="Telefone" {...form.register('phone')} />
      <input className="w-full rounded border p-2" placeholder="E-mail" {...form.register('email')} />
      <input className="w-full rounded border p-2" placeholder="Placa da moto" {...form.register('plate')} />
      <input className="w-full rounded border p-2" placeholder="Modelo da moto" {...form.register('bike_model')} />
      <input className="w-full rounded border p-2" placeholder="Região" {...form.register('region')} />
      <textarea className="w-full rounded border p-2" placeholder="Observações" {...form.register('notes')} />
      <select className="w-full rounded border p-2" {...form.register('status')}>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
      <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
    </form>
  );
}
