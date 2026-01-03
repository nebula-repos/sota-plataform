create policy "Admins can delete team members"
  on public.users
  for delete
  using (
    exists (
      select 1 from public.users as requestor
      where requestor.id = auth.uid()
      and requestor.role in ('admin', 'super_admin')
      and requestor.organization_id = users.organization_id
    )
  );
