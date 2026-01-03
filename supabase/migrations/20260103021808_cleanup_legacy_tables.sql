-- Drop tables in reverse order of dependency to avoid foreign key violations

-- 1. release_documents (depends on releases? or exist independently? safely drop if exists)
drop table if exists public.release_documents;

-- 2. release_sections (depends on releases)
drop table if exists public.release_sections;

-- 3. releases (depends on research_lines)
drop table if exists public.releases;

-- 4. research_line_subscriptions (depends on research_lines)
drop table if exists public.research_line_subscriptions;

-- 5. research_lines (root)
drop table if exists public.research_lines;
