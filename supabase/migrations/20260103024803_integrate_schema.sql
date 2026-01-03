-- 1. Create junction table for Organizations <-> Signals
create table if not exists public.organization_signals (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  signal_id uuid not null references public.signals(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (organization_id, signal_id)
);

-- Enable RLS
alter table public.organization_signals enable row level security;

-- Policy: Users can view their own organization's signal assignments
create policy "Users can view own organization signals"
  on public.organization_signals
  for select
  using (
    organization_id in (
      select organization_id from public.users where id = auth.uid()
    )
  );

-- 2. Secure the signals table
-- Drop the permissive policy created in the previous migration
drop policy if exists "Allow public read access signals" on public.signals;

-- Create strict policy: Only allow access if the signal is linked to the user's organization
create policy "Users access assigned signals only"
  on public.signals
  for select
  using (
    id in (
      select signal_id 
      from public.organization_signals os
      join public.users u on u.organization_id = os.organization_id
      where u.id = auth.uid()
    )
  );
