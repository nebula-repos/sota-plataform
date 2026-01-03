-- 1. Update Role constraints to include 'super_admin'
-- We must drop the existing constraint first.
-- Note: 'admin' will now mean "Organization Admin", and 'super_admin' means "System Admin".
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check check (role in ('user', 'admin', 'super_admin'));

-- 2. Update is_admin() helper to restrict "System Admin" powers to 'super_admin' only
-- Previously, 'admin' saw everything. Now only 'super_admin' should see everything across orgs.
-- Orgs Admins ('admin') should only see their own org data (handled by standard RLS).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.users
      where id = auth.uid() and role = 'super_admin' -- ONLY Super Admins get the "god mode" bypass
    ),
    false
  );
$$;

-- 3. Update Trigger to capture Org Name and set Role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_name text;
begin
  -- Get Org Name from metadata, or fallback
  org_name := coalesce(new.raw_user_meta_data->>'org_name', new.raw_user_meta_data->>'full_name', new.email, 'My Organization');

  -- 1. Create Organization
  insert into public.organizations (name)
  values (org_name)
  returning id into new_org_id;

  -- 2. Create User linked to Organization
  -- The creator of the org gets the 'admin' role (Organization Admin)
  insert into public.users (id, email, full_name, role, organization_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'admin', -- FIRST USER is the ADMIN of their Organization
    new_org_id
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;
