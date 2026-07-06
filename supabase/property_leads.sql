create extension if not exists pgcrypto;

create table if not exists public.property_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  property_id bigint,
  property_title text,
  property_slug text,
  source text default 'property_card',
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists property_leads_created_at_idx
  on public.property_leads (created_at desc);

create index if not exists property_leads_property_id_idx
  on public.property_leads (property_id);

alter table public.property_leads enable row level security;

drop policy if exists "Allow public lead inserts" on public.property_leads;

create policy "Allow public lead inserts"
  on public.property_leads
  for insert
  to anon, authenticated
  with check (true);

grant insert on public.property_leads to anon, authenticated;
grant select on public.property_leads to service_role;
