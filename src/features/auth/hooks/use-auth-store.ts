import { create } from 'zustand';
import type { Role } from '@/types/domain';

interface State {
  userId?: string;
  role: Role;
  isAuthenticated: boolean;
  setAuth: (input: { userId: string; role: Role }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<State>((set) => ({
  role: 'operador',
  isAuthenticated: false,
  setAuth: ({ userId, role }) => set({ userId, role, isAuthenticated: true }),
  clearAuth: () => set({ userId: undefined, isAuthenticated: false }),
}));
