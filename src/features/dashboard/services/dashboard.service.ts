import { supabase } from '@/lib/supabase/client';

export interface DashboardMetrics {
  totalToday: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  activeMotoboys: number;
  completionRate: number;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('service_orders')
      .select('status, created_at')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error) throw error;

    const total = data.length;
    const completed = data.filter((x) => x.status === 'concluida').length;
    return {
      totalToday: total,
      pending: data.filter((x) => x.status === 'pendente').length,
      inProgress: data.filter((x) => ['atribuida', 'em_rota', 'em_execucao'].includes(x.status)).length,
      completed,
      cancelled: data.filter((x) => x.status === 'cancelada').length,
      activeMotoboys: 0,
      completionRate: total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0,
    };
  },
  async getLatestOrders() {
    const { data, error } = await supabase.from('service_orders').select('id, os_number, customer_name, status, priority, created_at').order('created_at', { ascending: false }).limit(8);
    if (error) throw error;
    return data;
  },
  async getRanking() {
    const { data, error } = await supabase
      .from('service_orders')
      .select('motoboy_id, motoboys(name)')
      .eq('status', 'concluida')
      .not('motoboy_id', 'is', null);
    if (error) throw error;
    const grouped = new Map<string, { name: string; total: number }>();
    data.forEach((item) => {
      const id = item.motoboy_id as string;
      const name = (item.motoboys as { name: string } | null)?.name ?? 'Sem nome';
      const current = grouped.get(id) ?? { name, total: 0 };
      grouped.set(id, { ...current, total: current.total + 1 });
    });
    return [...grouped.values()].sort((a, b) => b.total - a.total).slice(0, 5);
  },
};
