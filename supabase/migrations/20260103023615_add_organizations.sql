-- 1. Create organizations table
create table if not exists public.organizations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  plan_id text references public.pricing_plans(id), -- Nullable, defaults to no plan
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.organizations enable row level security;

-- 2. Add organization_id to users (nullable first for backfill)
alter table public.users add column if not exists organization_id uuid references public.organizations(id);

-- Policy: Users can view their own organization (Now safe to create as column exists)
create policy "Users can view own organization"
  on public.organizations
  for select
  using (
    id in (select organization_id from public.users where id = auth.uid())
  );

-- 3. Backfill: Create an organization for each existing user and link them
do $$
declare
  user_rec record;
  new_org_id uuid;
begin
  for user_rec in select * from public.users where organization_id is null loop
    -- Create Org
    insert into public.organizations (name)
    values (coalesce(user_rec.full_name, user_rec.email, 'My Organization'))
    returning id into new_org_id;

    -- Link User
    update public.users set organization_id = new_org_id where id = user_rec.id;
  end loop;
end $$;

-- 4. Make organization_id NOT NULL
alter table public.users alter column organization_id set not null;

-- 5. Drop legacy membership_tier column
alter table public.users drop column if exists membership_tier;

-- 6. Update Trigger Function to create Org on Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- 1. Create Organization
  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data->>'full_name', new.email, 'My Organization'))
  returning id into new_org_id;

  -- 2. Create User linked to Organization
  insert into public.users (id, email, full_name, role, organization_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'user', -- Default role
    new_org_id
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;
