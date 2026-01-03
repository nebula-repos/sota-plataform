-- Fix RLS Infinite Recursion by adding a helper function

-- 1. Create a secure function to get the current user's organization_id
-- This function runs as SECURITY DEFINER, bypassing RLS on the users table
create or replace function public.get_auth_user_organization_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select organization_id from public.users where id = auth.uid() limit 1;
$$;

-- 2. Update Policies on public.users to use the new function

-- Drop existing policies to recreate them cleanly
drop policy if exists "Team members can view each other" on public.users;
drop policy if exists "Admins can update team members" on public.users;

-- Recreate "Team members can view each other"
create policy "Team members can view each other"
  on public.users
  for select
  using (
    auth.uid() = id -- Self
    or
    organization_id = public.get_auth_user_organization_id() -- Same Org
  );

-- Recreate "Admins can update team members"
create policy "Admins can update team members"
  on public.users
  for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('admin', 'super_admin')
      and organization_id = users.organization_id
    )
  ); 
  -- Note: The above policy technically still queries users (for auth.uid roles).
  -- If we select from users to check role, does that recurse?
  -- Yes, if checking role requires reading the row, which triggers SELECT policy.
  
  -- Optimization: 
  -- We should trust the function for organization match, but role check is tricky.
  -- Better approach: "Admins can update team members"
  -- Using: organization_id = public.get_auth_user_organization_id() AND (select role from public.users where id = auth.uid()) = 'admin' ... RECURSION AGAIN on role check.
  
  -- Let's define a function for checking if user is admin of the target org?
  -- Or just a generic `is_org_admin()` function.
  
create or replace function public.is_org_admin(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users 
    where id = auth.uid() 
    and organization_id = org_id 
    and role in ('admin', 'super_admin')
  );
$$;

-- Rework "Admins can update team members" using the function
drop policy if exists "Admins can update team members" on public.users;

create policy "Admins can update team members"
  on public.users
  for update
  using (
    public.is_org_admin(organization_id)
  );

-- 3. Update Policies on public.user_invitations to use the new function

drop policy if exists "Admins can view invitations" on public.user_invitations;
drop policy if exists "Admins can insert invitations" on public.user_invitations;
drop policy if exists "Admins can delete invitations" on public.user_invitations;

create policy "Admins can view invitations"
  on public.user_invitations
  for select
  using (
    public.is_org_admin(organization_id)
  );

create policy "Admins can insert invitations"
  on public.user_invitations
  for insert
  with check (
    public.is_org_admin(organization_id)
  );

create policy "Admins can delete invitations"
  on public.user_invitations
  for delete
  using (
    public.is_org_admin(organization_id)
  );
