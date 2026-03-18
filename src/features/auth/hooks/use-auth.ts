import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/hooks/use-auth-store';

export function useAuth() {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => authService.signIn(input.email, input.password),
    onSuccess: (data) => {
      auth.setAuth({ userId: data.context.userId, companyId: data.context.companyId, role: data.context.role });
      navigate('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      auth.clearAuth();
      navigate('/login');
    },
  });

  return { ...auth, loginMutation, logoutMutation };
}
