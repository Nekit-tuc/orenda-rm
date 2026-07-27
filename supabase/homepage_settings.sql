create table if not exists public.homepage_settings (
  id integer primary key default 1,
  hero_title text not null,
  hero_subtitle text not null,
  hero_button_text text not null,
  hero_button_url text not null,
  section_title text not null,
  section_subtitle text not null,
  telegram_title text not null,
  telegram_text text not null,
  telegram_button_text text not null,
  telegram_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_settings_single_row check (id = 1)
);

alter table public.homepage_settings
  drop column if exists show_quick_search;

alter table public.homepage_settings
  drop column if exists real_estate_blocks;

alter table public.homepage_settings enable row level security;

drop policy if exists "Allow public homepage settings select" on public.homepage_settings;
drop policy if exists "Allow public homepage settings update" on public.homepage_settings;
drop policy if exists "Allow public homepage settings insert" on public.homepage_settings;
drop policy if exists "Allow homepage settings updates" on public.homepage_settings;
drop policy if exists "Allow homepage settings inserts" on public.homepage_settings;

create policy "Allow public homepage settings select"
  on public.homepage_settings
  for select
  to anon, authenticated
  using (true);

grant select on public.homepage_settings to anon, authenticated;
revoke insert, update, delete on public.homepage_settings from anon, authenticated;

insert into public.homepage_settings (
  id,
  hero_title,
  hero_subtitle,
  hero_button_text,
  hero_button_url,
  section_title,
  section_subtitle,
  telegram_title,
  telegram_text,
  telegram_button_text,
  telegram_url
) values (
  1,
  'Інвестиційна нерухомість по всій Україні',
  'Комерційні приміщення, земельні ділянки, будинки, квартири та інвестиційні об''єкти в одному сучасному каталозі.',
  'Дивитись об''єкти',
  '#objects',
  'Преміальні об''єкти',
  'Каталог Investal Estate',
  'Зв''язатися в Telegram',
  'Напишіть нам у Telegram, щоб уточнити деталі, домовитися про перегляд або запропонувати свій об''єкт.',
  'Зв''язатися',
  'https://t.me/orenda_rm'
) on conflict (id) do nothing;
