import { z } from 'zod';

export const motoboySchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  plate: z.string().optional(),
  bike_model: z.string().optional(),
  status: z.enum(['ativo', 'inativo']),
  region: z.string().optional(),
  notes: z.string().optional(),
});

export type MotoboyInput = z.infer<typeof motoboySchema>;
