create table if not exists client_leads (
  id uuid primary key default gen_random_uuid(),
  property_id bigint,
  property_slug text,
  property_title text,
  client_name text not null,
  phone text not null,
  status text not null default 'new' check (
    status in ('new', 'in_progress', 'contacted', 'closed', 'spam')
  ),
  admin_note text,
  source text not null default 'property_callback_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_leads_created_at_idx
  on client_leads (created_at desc);

create index if not exists client_leads_status_idx
  on client_leads (status);

create index if not exists client_leads_property_id_idx
  on client_leads (property_id);

alter table client_leads enable row level security;

drop policy if exists "client_leads_public_select" on client_leads;
drop policy if exists "client_leads_public_insert" on client_leads;
drop policy if exists "client_leads_public_update" on client_leads;
drop policy if exists "client_leads_public_delete" on client_leads;

create or replace function set_client_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists client_leads_set_updated_at on client_leads;

create trigger client_leads_set_updated_at
before update on client_leads
for each row
execute function set_client_leads_updated_at();
