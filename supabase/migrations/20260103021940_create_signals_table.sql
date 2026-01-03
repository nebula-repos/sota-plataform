-- Create signal_types table (Lookup)
create table public.signal_types (
  id text primary key, -- Slug-based ID (e.g. 'regulatory-legal-change')
  name text not null,
  description text,
  priority int not null, -- 1 = Highest, 18 = Lowest
  created_at timestamptz not null default now()
);

-- Enable RLS for types
alter table public.signal_types enable row level security;
create policy "Allow public read access types" on public.signal_types for select to anon, authenticated using (true);

-- Create signals table (Main Entity)
create table public.signals (
  id uuid primary key default extensions.gen_random_uuid(),
  type_id text not null references public.signal_types(id) on delete restrict,
  title text not null,
  content text,
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for signals
alter table public.signals enable row level security;
create policy "Allow public read access signals" on public.signals for select to anon, authenticated using (true);

-- Indexes
create index idx_signals_type on public.signals(type_id);
create index idx_signals_published on public.signals(published_at) where is_active = true;

-- Seed Data: Signal Types (Ordered by Relevance 1-18)
insert into public.signal_types (id, priority, name, description) values
('regulatory-legal-change', 1, 'Regulatory / Legal Change', 'Changes in regulation, official guidelines, or legal criteria affecting obligations or compliance.'),
('incident-outage', 2, 'Incident / Outage / Service Degradation', 'Verified adverse events (outages, degradation) with operational impact.'),
('security-vulnerability', 3, 'Security / Vulnerability / Hazard Advisory', 'Advisories regarding digital or physical vulnerabilities requiring mitigation.'),
('pricing-packaging-change', 4, 'Pricing / Packaging Change', 'Changes in pricing models, plans, limits, or bundling affecting costs.'),
('operational-interface-change', 5, 'Operational Interface / Market Mechanism Change', 'Changes in procedures, protocols, or formats modifying how operations are conducted.'),
('availability-supply-shock', 6, 'Availability / Supply Shock', 'Significant changes in availability or lead times of critical inputs or infrastructure.'),
('demand-market-signal', 7, 'Demand / Market Adoption Signal', 'Verifiable evidence of changes in demand, adoption, backlog, or guidance.'),
('financial-performance-guidance', 8, 'Financial / Performance Guidance', 'Public updates on results or metrics indicating material changes in health or strategy.'),
('deprecation-eol', 9, 'Deprecation / End-of-Life', 'Retirement of support or availability for a service/version with a deadline.'),
('contractual-policy-change', 10, 'Contractual / Policy Framework Change', 'Changes in terms, SLAs, or policies governing the relationship.'),
('enforcement-sanctions', 11, 'Enforcement / Sanctions / Litigation Event', 'Concrete application of rules: fines, sanctions, or rulings creating precedents.'),
('competitive-move', 12, 'Competitive Move (Go-to-Market)', 'Verifiable competitive moves: launches, pricing offensives, or repositioning.'),
('product-release', 13, 'Product Release / Feature Launch', 'New capabilities (GA/beta) enabling or changing processes.'),
('standards-protocol-update', 14, 'Standards / Protocol / Interoperability Update', 'Adoption or update of standards/protocols imposing new requirements.'),
('ma-funding-restructure', 15, 'M&A / Funding / Corporate Restructure', 'Acquisitions, funding, or restructuring changing strategy or capacity.'),
('partnership-integration', 16, 'Partnership / Ecosystem Integration', 'Alliances or integrations enabling new capabilities or channels.'),
('talent-org-signal', 17, 'Talent / Org Signal', 'Material signals of organizational change: leadership shifts, mass hiring, or layoffs.'),
('ip-patent-move', 18, 'IP / Patent / Proprietary Move', 'Intellectual property events like patents or litigation with competitive implications.');
