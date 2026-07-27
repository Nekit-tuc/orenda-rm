create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partners_is_active_idx on partners (is_active);
create index if not exists partners_sort_order_idx on partners (sort_order);

create or replace function set_partners_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists partners_set_updated_at on partners;
create trigger partners_set_updated_at
before update on partners
for each row
execute function set_partners_updated_at();

alter table partners enable row level security;

drop policy if exists "Public can read active partners" on partners;
create policy "Public can read active partners"
on partners
for select
using (is_active = true);
