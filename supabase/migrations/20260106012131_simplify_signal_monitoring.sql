-- 1. Cleanup
drop table if exists public.signal_monitored_pages;
drop table if exists public.monitored_pages;
drop table if exists public.organization_subscriptions;

-- 2. Subscription: Declares interest in a Type
create table public.organization_subscriptions (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  signal_type_id text not null references public.signal_types(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (organization_id, signal_type_id)
);

-- 3. Ingestion/Sources: Provided BY the organization for a Type
create table public.monitored_pages (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  signal_type_id text not null references public.signal_types(id) on delete cascade,
  url text not null,
  title text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Evidence/Traceability: Links specific analysis back to its sources
create table public.signal_monitored_pages (
  signal_id uuid not null references public.signals(id) on delete cascade,
  monitored_page_id uuid not null references public.monitored_pages(id) on delete cascade,
  discovered_at timestamptz not null default now(),
  primary key (signal_id, monitored_page_id)
);

-- Enable RLS
alter table public.organization_subscriptions enable row level security;
alter table public.monitored_pages enable row level security;
alter table public.signal_monitored_pages enable row level security;

-- Policies (Strict isolation: only see what belongs to your Org)
create policy "Users can view own organization subscriptions"
  on public.organization_subscriptions for select
  using (organization_id in (select organization_id from public.users where id = auth.uid()));

create policy "Users can view own organization monitored pages"
  on public.monitored_pages for select
  using (organization_id in (select organization_id from public.users where id = auth.uid()));

create policy "Users can view sources of assigned signals"
  on public.signal_monitored_pages for select
  using (
    signal_id in (
      select signal_id from public.organization_signals os
      join public.users u on u.organization_id = os.organization_id
      where u.id = auth.uid()
    )
  );

-- Admin Access
create policy "Admins can manage organization_subscriptions" on public.organization_subscriptions for all using (public.is_admin());
create policy "Admins can manage monitored_pages" on public.monitored_pages for all using (public.is_admin());
create policy "Admins can manage signal_monitored_pages" on public.signal_monitored_pages for all using (public.is_admin());

-- Seeding: Real Example for Acme Corp
do $$
declare
  acme_id uuid := '5343b1fa-be12-49a9-b4fb-17cca5dbd1c6';
  sig_id uuid;
  page1_id uuid;
  page2_id uuid;
  page3_id uuid;
begin
  -- 1. Ensure Acme Corp exists
  insert into public.organizations (id, name, plan_id)
  values (acme_id, 'Acme Corp', 'tier-free')
  on conflict (id) do nothing;

  -- 2. Subscribe Acme Corp to pricing signals
  insert into public.organization_subscriptions (organization_id, signal_type_id)
  values (acme_id, 'pricing-packaging-change')
  on conflict do nothing;

  -- 3. Ingest Sources for Acme
  insert into public.monitored_pages (organization_id, signal_type_id, url, title, category)
  values (acme_id, 'pricing-packaging-change', 'https://claude.com/pricing', 'Claude Pricing', 'AI')
  returning id into page1_id;

  insert into public.monitored_pages (organization_id, signal_type_id, url, title, category)
  values (acme_id, 'pricing-packaging-change', 'https://chatgpt.com/es-419/pricing/', 'ChatGPT Pricing', 'AI')
  returning id into page2_id;

  insert into public.monitored_pages (organization_id, signal_type_id, url, title, category)
  values (acme_id, 'pricing-packaging-change', 'https://openai.com/es-419/api/pricing/', 'OpenAI API Pricing', 'AI')
  returning id into page3_id;

  -- 4. Create an example Signal
  insert into public.signals (type_id, title, content, published_at)
  values (
    'pricing-packaging-change',
    'AI Industry Pricing Shift Q1 2026',
    'Analysis of major AI providers shows a trend towards consumption-based pricing and simplified tier structures.',
    now()
  )
  returning id into sig_id;

  -- 5. Deliver the Signal to Acme
  insert into public.organization_signals (organization_id, signal_id)
  values (acme_id, sig_id)
  on conflict do nothing;

  -- 6. Link Signal to its Sources
  insert into public.signal_monitored_pages (signal_id, monitored_page_id)
  values 
    (sig_id, page1_id),
    (sig_id, page2_id),
    (sig_id, page3_id)
  on conflict do nothing;

end $$;
