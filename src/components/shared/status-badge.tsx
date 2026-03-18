import type { ServiceOrderStatus } from '@/types/domain';
import { STATUS_LABEL } from '@/lib/constants/status';
import { cn } from '@/lib/utils/cn';

const tone: Record<ServiceOrderStatus, string> = {
  pendente: 'bg-slate-100 text-slate-700',
  atribuida: 'bg-blue-100 text-blue-700',
  em_rota: 'bg-cyan-100 text-cyan-700',
  em_execucao: 'bg-amber-100 text-amber-700',
  concluida: 'bg-emerald-100 text-emerald-700',
  nao_concluida: 'bg-orange-100 text-orange-700',
  cancelada: 'bg-rose-100 text-rose-700',
};

export function StatusBadge({ status }: { status: ServiceOrderStatus }) {
  return <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', tone[status])}>{STATUS_LABEL[status]}</span>;
}
