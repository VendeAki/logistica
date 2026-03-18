import { supabase } from '@/lib/supabase/client';
import { getCurrentUserContext } from '@/features/auth/services/current-user.service';

export const usersService = {
  async listProfiles() {
    const context = await getCurrentUserContext();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, is_active, created_at')
      .eq('company_id', context.companyId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42501' || error.status === 403) return [];
      throw error;
    }

    return data;
  },
};
