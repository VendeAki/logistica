import { z } from 'zod';

export const serviceOrderSchema = z.object({
  os_number: z.string().min(3),
  service_type: z.enum(['ligacao', 'religacao', 'corte', 'cobranca', 'outro']),
  customer_name: z.string().min(2),
  customer_document: z.string().optional(),
  customer_phone: z.string().optional(),
  address_line: z.string().min(2),
  address_number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  status: z.enum(['pendente', 'atribuida', 'em_rota', 'em_execucao', 'concluida', 'nao_concluida', 'cancelada']),
  motoboy_id: z.string().uuid().optional().or(z.literal('')),
  scheduled_date: z.string().optional(),
  due_date: z.string().optional(),
  cancellation_reason: z.string().optional(),
});

export type ServiceOrderInput = z.infer<typeof serviceOrderSchema>;
