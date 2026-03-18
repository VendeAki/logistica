import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/hooks/use-auth-store';
import type { Role } from '@/types/domain';

export function RoleGuard({ allow, children }: { allow: Role[]; children: JSX.Element }) {
  const role = useAuthStore((s) => s.role);
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}
