create extension if not exists pgcrypto;

create table if not exists public.property_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  telegram text,
  object_type text not null check (object_type in ('Земля', 'Комерція', 'Будинок')),
  address text not null,
  area text not null,
  price text not null,
  cadastral_number text not null,
  description text,
  photos text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'contacted', 'rejected', 'approved')),
  created_at timestamptz default now()
);

create index if not exists property_submissions_created_at_idx
  on public.property_submissions (created_at desc);

create index if not exists property_submissions_status_idx
  on public.property_submissions (status);

create index if not exists property_submissions_phone_idx
  on public.property_submissions (phone);

alter table public.property_submissions enable row level security;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-submissions',
  'property-submissions',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

grant select, insert, update on public.property_submissions to service_role;
