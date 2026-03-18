import { supabase } from '@/lib/supabase/client';
import type { MotoboyInput } from '@/features/motoboys/schemas/motoboy.schema';
import { getCurrentUserContext } from '@/features/auth/services/current-user.service';

export const motoboysService = {
  async list(search = '') {
    const context = await getCurrentUserContext();

    const query = supabase
      .from('motoboys')
      .select('*')
      .eq('company_id', context.companyId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (search) query.ilike('name', `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getById(id: string) {
    const context = await getCurrentUserContext();
    const { data, error } = await supabase.from('motoboys').select('*').eq('id', id).eq('company_id', context.companyId).single();
    if (error) throw error;
    return data;
  },
  async create(payload: MotoboyInput) {
    const context = await getCurrentUserContext();
    const { data, error } = await supabase
      .from('motoboys')
      .insert({ ...payload, company_id: context.companyId, created_by: context.userId })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },
  async update(id: string, payload: MotoboyInput) {
    const context = await getCurrentUserContext();
    const { data, error } = await supabase
      .from('motoboys')
      .update(payload)
      .eq('id', id)
      .eq('company_id', context.companyId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },
  async inactivate(id: string) {
    const context = await getCurrentUserContext();
    const { error } = await supabase.from('motoboys').update({ status: 'inativo' }).eq('id', id).eq('company_id', context.companyId);
    if (error) throw error;
  },
};
