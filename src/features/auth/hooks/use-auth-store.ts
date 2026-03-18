import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@/types/domain';

interface State {
  userId?: string;
  companyId?: string;
  role: Role;
  isAuthenticated: boolean;
  setAuth: (input: { userId: string; companyId: string; role: Role }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<State>()(
  persist(
    (set) => ({
      role: 'operador',
      isAuthenticated: false,
      setAuth: ({ userId, companyId, role }) => set({ userId, companyId, role, isAuthenticated: true }),
      clearAuth: () => set({ userId: undefined, companyId: undefined, role: 'operador', isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
    },
  ),
);
