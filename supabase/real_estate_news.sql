create table if not exists public.real_estate_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  category text,
  image_url text,
  published boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists real_estate_news_published_idx
  on public.real_estate_news (published);

create index if not exists real_estate_news_featured_idx
  on public.real_estate_news (featured);

create index if not exists real_estate_news_sort_order_idx
  on public.real_estate_news (sort_order);

create index if not exists real_estate_news_published_at_idx
  on public.real_estate_news (published_at desc);

create index if not exists real_estate_news_slug_idx
  on public.real_estate_news (slug);

create or replace function public.set_real_estate_news_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_real_estate_news_updated_at
  on public.real_estate_news;

create trigger set_real_estate_news_updated_at
  before update on public.real_estate_news
  for each row
  execute function public.set_real_estate_news_updated_at();

alter table public.real_estate_news enable row level security;

drop policy if exists "Allow public read published real estate news"
  on public.real_estate_news;

create policy "Allow public read published real estate news"
  on public.real_estate_news
  for select
  to anon, authenticated
  using (published = true);

grant select on public.real_estate_news to anon, authenticated;
revoke insert, update, delete on public.real_estate_news from anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'news-images',
  'news-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Allow public read news images"
  on storage.objects;

create policy "Allow public read news images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'news-images');
