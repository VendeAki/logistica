import { supabase } from '@/lib/supabase/client';
import { getCurrentUserContext } from '@/features/auth/services/current-user.service';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const context = await getCurrentUserContext();

    return {
      ...data,
      context,
    };
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  async getCurrentUserContext() {
    return getCurrentUserContext();
  },
};
