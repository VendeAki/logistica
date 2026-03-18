import { supabase } from '@/lib/supabase/client';

export interface CurrentUserContext {
  userId: string;
  companyId: string;
  role: 'admin' | 'operador' | 'supervisor';
}

const DEFAULT_COMPANY_ID = '11111111-1111-1111-1111-111111111111';

function normalizeRole(role: unknown): CurrentUserContext['role'] {
  if (role === 'admin' || role === 'supervisor' || role === 'operador') return role;
  return 'operador';
}

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('Usuário não autenticado.');

  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  const companyId = metadata.company_id ?? appMetadata.company_id ?? DEFAULT_COMPANY_ID;
  const role = normalizeRole(metadata.role ?? appMetadata.role);

  return {
    userId: user.id,
    companyId,
    role,
  };
}
