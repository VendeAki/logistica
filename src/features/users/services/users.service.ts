import { supabase } from '@/lib/supabase/client';

export const usersService = {
  async listProfiles() {
    const { data, error } = await supabase.from('profiles').select('id, full_name, role, is_active, created_at').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
