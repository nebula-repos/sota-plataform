-- Drop table if exists to ensure clean slate for this migration
drop table if exists public.pricing_plans;

create table public.pricing_plans (
  id text primary key,
  name text not null,
  price_monthly numeric,
  implementation_fee numeric,
  features text[],
  currency text default 'USD',
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.pricing_plans enable row level security;

-- Create policy for reading (public access)
create policy "Allow public read access"
  on public.pricing_plans
  for select
  to anon, authenticated
  using (true);

-- Insert data (excluding Custom tier)
insert into public.pricing_plans (id, name, price_monthly, implementation_fee, features) values
(
  'tier-1',
  '1 Signal',
  200,
  400,
  array['1 Standard Signal', '2 User Seats', 'Bi-weekly Briefings']
),
(
  'tier-1.5',
  '3 Signals',
  500,
  400,
  array['3 Standard Signals', '3 User Seats', 'Bi-weekly Briefings']
),
(
  'tier-2',
  '3+1 Signals',
  800,
  400,
  array['3 Standard Signals', '1 Custom Signal', '4 User Seats', 'Weekly Briefings']
),
(
  'tier-3',
  '5+1 Signals',
  1200,
  400,
  array['5 Standard Signals', '1 Custom Signal', '7 User Seats', 'Weekly Briefings']
);
