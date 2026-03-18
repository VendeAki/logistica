import { supabase } from '@/lib/supabase/client';

export interface CurrentUserContext {
  userId: string;
  companyId: string;
  role: 'admin' | 'operador' | 'supervisor';
}

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Usuário não autenticado.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, company_id')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;

  return {
    userId: profile.id,
    role: profile.role,
    companyId: profile.company_id,
  };
}
