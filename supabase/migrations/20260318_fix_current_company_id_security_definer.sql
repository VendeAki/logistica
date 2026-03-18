-- Avoid RLS recursion when resolving company_id from profiles
create or replace function public.current_company_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claim_company_id uuid;
  profile_company_id uuid;
begin
  claim_company_id := coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'company_id', '')::uuid,
    nullif(auth.jwt() -> 'user_metadata' ->> 'company_id', '')::uuid
  );

  if claim_company_id is not null then
    return claim_company_id;
  end if;

  select p.company_id
    into profile_company_id
  from public.profiles p
  where p.id = auth.uid();

  return profile_company_id;
end;
$$;

grant execute on function public.current_company_id() to authenticated;
