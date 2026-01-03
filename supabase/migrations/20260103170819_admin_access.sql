-- Allow Admins to view all signals (bypassing the Organization link check)
-- This updates the policy created in "integrate_schema"
drop policy if exists "Users access assigned signals only" on public.signals;

create policy "Users access assigned signals only"
  on public.signals
  for select
  using (
    public.is_admin() -- Admin sees all
    or
    id in (
      select signal_id 
      from public.organization_signals os
      join public.users u on u.organization_id = os.organization_id
      where u.id = auth.uid()
    )
  );

-- Also allow Admins to manage (Insert/Update/Delete) signals
create policy "Admins can insert signals"
  on public.signals for insert with check (public.is_admin());

create policy "Admins can update signals"
  on public.signals for update using (public.is_admin());

create policy "Admins can delete signals"
  on public.signals for delete using (public.is_admin());
