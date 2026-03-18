import type { ServiceOrderStatus } from '@/types/domain';

export const STATUS_LABEL: Record<ServiceOrderStatus, string> = {
  pendente: 'Pendente',
  atribuida: 'Atribuída',
  em_rota: 'Em rota',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
  nao_concluida: 'Não concluída',
  cancelada: 'Cancelada',
};
