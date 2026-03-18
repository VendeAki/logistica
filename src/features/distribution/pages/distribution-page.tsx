import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useMotoboys } from '@/features/motoboys/hooks/use-motoboys';
import { useAssignOrders, useServiceOrders } from '@/features/service-orders/hooks/use-service-orders';

export function DistributionPage() {
  const ordersQuery = useServiceOrders({ status: 'pendente' });
  const motoboysQuery = useMotoboys('');
  const assignMutation = useAssignOrders();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState('');

  const pendingOrders = ordersQuery.data ?? [];
  const motoboys = useMemo(() => (motoboysQuery.data ?? []).filter((m) => m.status === 'ativo'), [motoboysQuery.data]);

  return (
    <div>
      <PageHeader title="Distribuição de OS" description="Atribuição individual ou em lote por motoboy." />
      <section className="card mb-4 grid gap-2 md:grid-cols-3">
        <p><strong>OS pendentes:</strong> {pendingOrders.length}</p>
        <p><strong>Motoboys ativos:</strong> {motoboys.length}</p>
        <select className="rounded border p-2" value={selectedMotoboy} onChange={(e) => setSelectedMotoboy(e.target.value)}>
          <option value="">Selecione o motoboy</option>
          {motoboys.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </section>
      <div className="space-y-2">
        {pendingOrders.map((order) => (
          <label key={order.id} className="flex items-center gap-2 rounded border bg-white p-3">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order.id)}
              onChange={(e) => setSelectedOrders((prev) => e.target.checked ? [...prev, order.id] : prev.filter((x) => x !== order.id))}
            />
            <span className="text-sm">{order.os_number} • {order.customer_name} • {order.district ?? 'Sem bairro'}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => assignMutation.mutate({ orderIds: selectedOrders, motoboyId: selectedMotoboy })}
          disabled={!selectedOrders.length || !selectedMotoboy || assignMutation.isPending}
        >
          Atribuir em lote
        </Button>
        <Button variant="secondary" onClick={() => assignMutation.mutate({ orderIds: selectedOrders })} disabled={!selectedOrders.length}>Desatribuir</Button>
      </div>
    </div>
  );
}
