export type Role = 'admin' | 'operador' | 'supervisor';
export type EntityStatus = 'ativo' | 'inativo';
export type ServiceType = 'ligacao' | 'religacao' | 'corte' | 'cobranca' | 'outro';
export type ServiceOrderStatus =
  | 'pendente'
  | 'atribuida'
  | 'em_rota'
  | 'em_execucao'
  | 'concluida'
  | 'nao_concluida'
  | 'cancelada';
export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Motoboy {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  plate?: string;
  bike_model?: string;
  status: EntityStatus;
  region?: string;
  notes?: string;
  created_at: string;
}

export interface ServiceOrder {
  id: string;
  os_number: string;
  service_type: ServiceType;
  customer_name: string;
  customer_document?: string;
  customer_phone?: string;
  address_line: string;
  address_number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  reference?: string;
  notes?: string;
  priority: Priority;
  status: ServiceOrderStatus;
  motoboy_id?: string;
  scheduled_date?: string;
  due_date?: string;
  created_at: string;
  assigned_at?: string;
  started_at?: string;
  finished_at?: string;
  cancellation_reason?: string;
  created_by?: string;
}
