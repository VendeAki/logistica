-- Enable extensions
create extension if not exists "pgcrypto";

-- Enums
create type public.user_role as enum ('admin', 'operador', 'supervisor');
create type public.entity_status as enum ('ativo', 'inativo');
create type public.service_type_enum as enum ('ligacao', 'religacao', 'corte', 'cobranca', 'outro');
create type public.os_priority as enum ('baixa', 'media', 'alta', 'urgente');
create type public.os_status as enum ('pendente', 'atribuida', 'em_rota', 'em_execucao', 'concluida', 'nao_concluida', 'cancelada');
create type public.audit_event_type as enum ('os_criada', 'os_editada', 'os_atribuida', 'responsavel_alterado', 'status_alterado', 'observacao_adicionada', 'os_cancelada', 'os_concluida', 'os_reaberta');

-- Shared timestamp trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.profiles (
  id uuid primary key references auth.users (id),
  company_id uuid not null references public.companies(id),
  full_name text,
  role public.user_role not null default 'operador',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.motoboys (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  name text not null,
  cpf text not null,
  phone text not null,
  email text,
  plate text,
  bike_model text,
  status public.entity_status not null default 'ativo',
  region text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (company_id, cpf)
);

create table public.service_types (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  key public.service_type_enum not null,
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (company_id, key)
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  os_number text not null,
  service_type public.service_type_enum not null,
  customer_name text not null,
  customer_document text,
  customer_phone text,
  address_line text not null,
  address_number text,
  complement text,
  district text,
  city text,
  state text,
  zip_code text,
  reference text,
  notes text,
  priority public.os_priority not null default 'media',
  status public.os_status not null default 'pendente',
  motoboy_id uuid references public.motoboys(id),
  scheduled_date date,
  due_date date,
  assigned_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  cancellation_reason text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  reopened_at timestamptz,
  unique (company_id, os_number),
  constraint cancellation_reason_required check (
    status <> 'cancelada' or cancellation_reason is not null
  )
);

create table public.service_order_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  os_id uuid not null references public.service_orders(id),
  event_type public.audit_event_type not null,
  description text not null,
  user_id uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  os_id uuid not null references public.service_orders(id),
  file_name text not null,
  file_path text not null,
  file_type text,
  metadata jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

create index idx_motoboys_company_status on public.motoboys(company_id, status);
create index idx_orders_company_status on public.service_orders(company_id, status);
create index idx_orders_company_motoboy on public.service_orders(company_id, motoboy_id);
create index idx_orders_company_scheduled on public.service_orders(company_id, scheduled_date);
create index idx_history_os_created on public.service_order_history(os_id, created_at desc);

create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_motoboys_updated_at before update on public.motoboys for each row execute function public.set_updated_at();
create trigger trg_service_orders_updated_at before update on public.service_orders for each row execute function public.set_updated_at();
create trigger trg_companies_updated_at before update on public.companies for each row execute function public.set_updated_at();

create or replace function public.ensure_motoboy_assignment()
returns trigger language plpgsql as $$
declare
  motoboy_status public.entity_status;
begin
  if new.motoboy_id is not null then
    select status into motoboy_status from public.motoboys where id = new.motoboy_id;
    if motoboy_status <> 'ativo' then
      raise exception 'Motoboy inativo não pode receber nova OS';
    end if;
  end if;

  if old.status = 'concluida' and new.status = 'pendente' and new.reopened_at is null then
    raise exception 'OS concluída só pode voltar para pendente com reabertura explícita';
  end if;

  return new;
end;
$$;

create trigger trg_service_order_rules
before update on public.service_orders
for each row execute function public.ensure_motoboy_assignment();

create or replace function public.log_service_order_events()
returns trigger language plpgsql as $$
declare
  evt public.audit_event_type;
  desc_text text;
begin
  if tg_op = 'INSERT' then
    evt := 'os_criada';
    desc_text := 'OS criada no sistema';
  else
    if old.motoboy_id is distinct from new.motoboy_id then
      evt := case when old.motoboy_id is null then 'os_atribuida' else 'responsavel_alterado' end;
      desc_text := 'Responsável da OS atualizado';
    elsif old.status is distinct from new.status then
      evt := case new.status when 'cancelada' then 'os_cancelada' when 'concluida' then 'os_concluida' else 'status_alterado' end;
      desc_text := 'Status alterado de ' || old.status || ' para ' || new.status;
    else
      evt := 'os_editada';
      desc_text := 'Dados da OS atualizados';
    end if;
  end if;

  insert into public.service_order_history(company_id, os_id, event_type, description, user_id)
  values (new.company_id, new.id, evt, desc_text, new.created_by);

  return new;
end;
$$;

create trigger trg_log_service_order_insert
after insert on public.service_orders
for each row execute function public.log_service_order_events();

create trigger trg_log_service_order_update
after update on public.service_orders
for each row execute function public.log_service_order_events();
