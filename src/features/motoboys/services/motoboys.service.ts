import { supabase } from '@/lib/supabase/client';
import type { MotoboyInput } from '@/features/motoboys/schemas/motoboy.schema';

export const motoboysService = {
  async list(search = '') {
    const query = supabase.from('motoboys').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (search) query.ilike('name', `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('motoboys').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(payload: MotoboyInput) {
    const { data, error } = await supabase.from('motoboys').insert(payload).select('*').single();
    if (error) throw error;
    return data;
  },
  async update(id: string, payload: MotoboyInput) {
    const { data, error } = await supabase.from('motoboys').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
  async inactivate(id: string) {
    const { error } = await supabase.from('motoboys').update({ status: 'inativo' }).eq('id', id);
    if (error) throw error;
  },
};
