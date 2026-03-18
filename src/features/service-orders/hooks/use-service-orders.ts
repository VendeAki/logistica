import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceOrdersService } from '@/features/service-orders/services/service-orders.service';
import type { ServiceOrderInput } from '@/features/service-orders/schemas/service-order.schema';

export function useServiceOrders(filters: { status?: string; service_type?: string; query?: string }) {
  return useQuery({ queryKey: ['service-orders', filters], queryFn: () => serviceOrdersService.list(filters) });
}

export function useServiceOrder(id?: string) {
  return useQuery({ queryKey: ['service-orders', id], queryFn: () => serviceOrdersService.getById(id!), enabled: Boolean(id) });
}

export function useSaveServiceOrder(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceOrderInput) => (id ? serviceOrdersService.update(id, payload) : serviceOrdersService.create(payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-orders'] }),
  });
}

export function useAssignOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderIds, motoboyId }: { orderIds: string[]; motoboyId?: string }) => serviceOrdersService.assignBatch(orderIds, motoboyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-orders'] }),
  });
}
