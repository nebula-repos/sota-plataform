-- 1. Insert Free Plan
insert into public.pricing_plans (id, name, price_monthly, implementation_fee, features, active)
values (
  'tier-free',
  'Free Tier',
  0,
  0,
  array['Account Access Only', 'No Signals'],
  true
)
on conflict (id) do nothing; -- Safe if run multiple times

-- 2. Update Organizations table

-- Set default first
alter table public.organizations alter column plan_id set default 'tier-free';

-- Backfill existing NULLs so the constraint doesn fail (even if we truncate later, this order matters for migration safety)
update public.organizations set plan_id = 'tier-free' where plan_id is null;

-- Set NOT NULL
alter table public.organizations alter column plan_id set not null;

-- 3. Update Trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- 1. Create Organization (plan_id defaults to 'tier-free')
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
