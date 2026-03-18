import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/features/dashboard/services/dashboard.service';

export function useDashboard() {
  const metrics = useQuery({ queryKey: ['dashboard-metrics'], queryFn: dashboardService.getMetrics });
  const latestOrders = useQuery({ queryKey: ['dashboard-latest-orders'], queryFn: dashboardService.getLatestOrders });
  const ranking = useQuery({ queryKey: ['dashboard-ranking'], queryFn: dashboardService.getRanking });

  return { metrics, latestOrders, ranking };
}
