import { useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/hooks/use-auth-store';

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const syncAuthState = async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          clearAuth();
          return;
        }

        const context = await authService.getCurrentUserContext();
        setAuth({ userId: context.userId, companyId: context.companyId, role: context.role });
      } catch {
        clearAuth();
      }
    };

    void syncAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        clearAuth();
        return;
      }

      void authService
        .getCurrentUserContext()
        .then((context) => setAuth({ userId: context.userId, companyId: context.companyId, role: context.role }))
        .catch(() => clearAuth());
    });

    return () => subscription.unsubscribe();
  }, [clearAuth, setAuth]);

  return <>{children}</>;
}
