import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motoboysService } from '@/features/motoboys/services/motoboys.service';
import type { MotoboyInput } from '@/features/motoboys/schemas/motoboy.schema';

export function useMotoboys(search: string) {
  return useQuery({ queryKey: ['motoboys', search], queryFn: () => motoboysService.list(search) });
}

export function useMotoboy(id?: string) {
  return useQuery({ queryKey: ['motoboys', id], queryFn: () => motoboysService.getById(id!), enabled: Boolean(id) });
}

export function useSaveMotoboy(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MotoboyInput) => (id ? motoboysService.update(id, payload) : motoboysService.create(payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['motoboys'] }),
  });
}

export function useInactivateMotoboy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => motoboysService.inactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['motoboys'] }),
  });
}
