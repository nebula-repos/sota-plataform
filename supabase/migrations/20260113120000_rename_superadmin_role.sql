-- Rename 'super_admin' to 'superadmin'

-- 1. Update Constraints: Drop old constraint first to allow data change
alter table public.users drop constraint if exists users_role_check;

-- 2. Update Data: Rename existing role assignments
update public.users
set role = 'superadmin'
where role = 'super_admin';

-- 3. Update Constraints: Add new constraint
alter table public.users add constraint users_role_check check (role in ('user', 'admin', 'superadmin'));

-- 3. Update Function: is_admin() (System Admin check)
-- Previously checked for 'super_admin', now 'superadmin'
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
      where id = auth.uid() and role = 'superadmin'
    ),
    false
  );
$$;

-- 4. Update Function: is_org_admin() (Organization Admin check)
-- Checks for 'admin' (Org Admin) OR 'superadmin' (System Admin) within an org context (though superadmin usually bypasses this via other policies, this function is specific)
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
    and role in ('admin', 'superadmin')
  );
$$;

-- 5. Update Policy: "Admins can delete team members"
-- This policy had a hardcoded role check in 20260103211500_allow_delete_members.sql
drop policy if exists "Admins can delete team members" on public.users;

create policy "Admins can delete team members"
  on public.users
  for delete
  using (
    exists (
      select 1 from public.users as requestor
      where requestor.id = auth.uid()
      and requestor.role in ('admin', 'superadmin')
      and requestor.organization_id = users.organization_id
    )
  );

-- 6. Update Policy: "Admins can view invitations"
-- Note: usage of is_org_admin() in 20260103223000_fix_rls_recursion.sql handles the logic change automatically since we updated the function,
-- but we should ensure no other hardcoded policies exist.
-- Checked: "Admins can view invitations", "Admins can insert invitations", "Admins can delete invitations" use is_org_admin().
-- Checked: "Admins can update team members" uses is_org_admin().
-- Checked: "Team members can view each other" does not check role.

-- 7. Update User Invitations Check Constraint
-- The table user_invitations also has a role check?
-- From 20260103210000_user_invitations.sql: role text not null default 'user' check (role in ('user', 'admin')),
-- It seems invitations only allow inviting as 'user' or 'admin' (Org Admin). 
-- If 'super_admin' was never valid for invitations, we don't need to change it.
-- However, checking the search results, it doesn't seem 'super_admin' was added to invitations table check.
-- Wait, let me double check 20260103210000_user_invitations.sql content again in memory or previous turns.
-- It had: role text not null default 'user' check (role in ('user', 'admin')),
-- So no 'super_admin' there. Only policies had it.
-- Policies in 20260103210000_user_invitations.sql were replaced by 20260103223000_fix_rls_recursion.sql to use is_org_admin().
-- So updating is_org_admin() handles it.
