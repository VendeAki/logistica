import { supabase } from '@/lib/supabase/client';
import type { ServiceOrderInput } from '@/features/service-orders/schemas/service-order.schema';

export const serviceOrdersService = {
  async list(filters: { status?: string; service_type?: string; query?: string }) {
    let query = supabase
      .from('service_orders')
      .select('*, motoboys(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.service_type) query = query.eq('service_type', filters.service_type);
    if (filters.query) query = query.or(`os_number.ilike.%${filters.query}%,customer_name.ilike.%${filters.query}%,address_line.ilike.%${filters.query}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('service_orders').select('*, motoboys(name), service_order_history(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(payload: ServiceOrderInput) {
    const { data, error } = await supabase.from('service_orders').insert(payload).select('*').single();
    if (error) throw error;
    return data;
  },
  async update(id: string, payload: ServiceOrderInput) {
    const { data, error } = await supabase.from('service_orders').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
  async updateStatus(id: string, status: string, cancellation_reason?: string) {
    const { error } = await supabase.from('service_orders').update({ status, cancellation_reason }).eq('id', id);
    if (error) throw error;
  },
  async assignBatch(orderIds: string[], motoboyId?: string) {
    const payload = motoboyId
      ? { motoboy_id: motoboyId, status: 'atribuida', assigned_at: new Date().toISOString() }
      : { motoboy_id: null, status: 'pendente', assigned_at: null };
    const { error } = await supabase.from('service_orders').update(payload).in('id', orderIds);
    if (error) throw error;
  },
};
