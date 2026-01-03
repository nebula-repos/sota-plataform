-- 1. Create Invitations Table
create table if not exists public.user_invitations (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null,
  organization_id uuid references public.organizations(id) not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table public.user_invitations enable row level security;

-- 3. Policies for user_invitations
create policy "Admins can view invitations"
  on public.user_invitations
  for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'super_admin')
      and users.organization_id = user_invitations.organization_id
    )
  );

create policy "Admins can insert invitations"
  on public.user_invitations
  for insert
  with check (
    exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.role in ('admin', 'super_admin')
        and users.organization_id = user_invitations.organization_id
    )
  );

create policy "Admins can delete invitations"
  on public.user_invitations
  for delete
  using (
    exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.role in ('admin', 'super_admin')
        and users.organization_id = user_invitations.organization_id
    )
  );

-- 4. Policies for users table (Managing team members)
-- Allow users to see their colleagues
create policy "Team members can view each other"
  on public.users
  for select
  using (
    auth.uid() = id -- Self
    or
    organization_id = (select organization_id from public.users where id = auth.uid()) -- Same Org
  );

-- Allow admins to update colleagues (roles)
create policy "Admins can update team members"
  on public.users
  for update
  using (
    exists (
      select 1 from public.users as requestor
      where requestor.id = auth.uid()
      and requestor.role in ('admin', 'super_admin')
      and requestor.organization_id = users.organization_id
    )
  );

-- 5. Update handle_new_user to respect invitations
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  assigned_role text;
  invitation_record record;
begin
  -- Check for pending invitation
  select * into invitation_record
  from public.user_invitations
  where email = new.email
  and status = 'pending'
  limit 1;

  if invitation_record is not null then
    -- Join existing organization
    new_org_id := invitation_record.organization_id;
    assigned_role := invitation_record.role;
    
    -- Mark invitation as accepted
    update public.user_invitations
    set status = 'accepted', updated_at = now()
    where id = invitation_record.id;
  else
    -- Create new Organization
    insert into public.organizations (name)
    values (coalesce(new.raw_user_meta_data->>'org_name', new.raw_user_meta_data->>'full_name', new.email, 'My Organization'))
    returning id into new_org_id;
    
    assigned_role := 'admin'; -- Creator is admin
  end if;

  -- Create User
  insert into public.users (id, email, full_name, role, organization_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    assigned_role,
    new_org_id
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;
