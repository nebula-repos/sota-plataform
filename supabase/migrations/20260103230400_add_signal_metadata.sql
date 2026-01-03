-- Add metadata column to signals table for rich UI data
-- Supports storing metrics, chart configs, source lists, etc.

alter table public.signals 
add column if not exists metadata jsonb default '{}'::jsonb;

-- Add index for efficient querying of metadata fields if needed later
create index if not exists idx_signals_metadata on public.signals using gin (metadata);
