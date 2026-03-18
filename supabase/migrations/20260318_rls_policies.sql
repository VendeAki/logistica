-- Access model for authenticated users (multi-tenant by company_id)
create or replace function public.current_company_id()
returns uuid
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'company_id', '')::uuid,
    nullif(auth.jwt() -> 'user_metadata' ->> 'company_id', '')::uuid,
    (
      select company_id
      from public.profiles
      where id = auth.uid()
    )
  );
$$;

grant execute on function public.current_company_id() to authenticated;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.motoboys to authenticated;
grant select, insert, update on public.service_orders to authenticated;
grant select on public.service_order_history to authenticated;
grant select on public.service_types to authenticated;

alter table public.profiles enable row level security;
alter table public.motoboys enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_order_history enable row level security;
alter table public.service_types enable row level security;

create policy "profiles_select_same_company"
  on public.profiles
  for select
  to authenticated
  using (company_id = public.current_company_id());

create policy "profiles_update_self"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and company_id = public.current_company_id());

create policy "motoboys_select_same_company"
  on public.motoboys
  for select
  to authenticated
  using (company_id = public.current_company_id());

create policy "motoboys_insert_same_company"
  on public.motoboys
  for insert
  to authenticated
  with check (company_id = public.current_company_id() and created_by = auth.uid());

create policy "motoboys_update_same_company"
  on public.motoboys
  for update
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "service_orders_select_same_company"
  on public.service_orders
  for select
  to authenticated
  using (company_id = public.current_company_id());

create policy "service_orders_insert_same_company"
  on public.service_orders
  for insert
  to authenticated
  with check (company_id = public.current_company_id() and created_by = auth.uid());

create policy "service_orders_update_same_company"
  on public.service_orders
  for update
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "service_order_history_select_same_company"
  on public.service_order_history
  for select
  to authenticated
  using (company_id = public.current_company_id());

create policy "service_types_select_same_company"
  on public.service_types
  for select
  to authenticated
  using (company_id = public.current_company_id());
