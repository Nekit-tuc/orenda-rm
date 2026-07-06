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
  real_estate_blocks jsonb not null default '[
    {
      "tag": "Ринок",
      "title": "Попит на оренду комерційних приміщень у Житомирі зростає",
      "text": "Огляд попиту на офіси, склади та комерційні приміщення у Житомирі.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Поради",
      "title": "Як правильно обрати приміщення для оренди: 7 важливих порад",
      "text": "На що звернути увагу перед підписанням договору оренди.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Інвестиції",
      "title": "Інвестиційна нерухомість: актуальні тренди року",
      "text": "Які обʼєкти залишаються цікавими для інвесторів у регіоні.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Оренда",
      "title": "Склади та виробничі приміщення в Житомирській області",
      "text": "Короткий зріз пропозицій для бізнесу та виробництва.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    }
  ]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_settings_single_row check (id = 1)
);

alter table public.homepage_settings
  add column if not exists real_estate_blocks jsonb not null default '[
    {
      "tag": "Ринок",
      "title": "Попит на оренду комерційних приміщень у Житомирі зростає",
      "text": "Огляд попиту на офіси, склади та комерційні приміщення у Житомирі.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Поради",
      "title": "Як правильно обрати приміщення для оренди: 7 важливих порад",
      "text": "На що звернути увагу перед підписанням договору оренди.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Інвестиції",
      "title": "Інвестиційна нерухомість: актуальні тренди року",
      "text": "Які обʼєкти залишаються цікавими для інвесторів у регіоні.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Оренда",
      "title": "Склади та виробничі приміщення в Житомирській області",
      "text": "Короткий зріз пропозицій для бізнесу та виробництва.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    }
  ]'::jsonb;

alter table public.homepage_settings
  add column if not exists show_quick_search boolean default true;

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
  telegram_url,
  real_estate_blocks
) values (
  1,
  'Нерухомість в Житомирі та області',
  'Комерційні приміщення, офіси, склади, квартири та інвестиційні об''єкти в одному сучасному каталозі.',
  'Дивитись об''єкти',
  '#objects',
  'Актуальні об''єкти',
  'Каталог нерухомості',
  'Зв''язатися в Telegram',
  'Напишіть нам у Telegram, щоб уточнити деталі, домовитися про перегляд або запропонувати свій об''єкт.',
  'Зв''язатися',
  'https://t.me/zt_space',
  '[
    {
      "tag": "Ринок",
      "title": "Попит на оренду комерційних приміщень у Житомирі зростає",
      "text": "Огляд попиту на офіси, склади та комерційні приміщення у Житомирі.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Поради",
      "title": "Як правильно обрати приміщення для оренди: 7 важливих порад",
      "text": "На що звернути увагу перед підписанням договору оренди.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Інвестиції",
      "title": "Інвестиційна нерухомість: актуальні тренди року",
      "text": "Які обʼєкти залишаються цікавими для інвесторів у регіоні.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    },
    {
      "tag": "Оренда",
      "title": "Склади та виробничі приміщення в Житомирській області",
      "text": "Короткий зріз пропозицій для бізнесу та виробництва.",
      "date": "25 червня 2026",
      "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      "href": "/#objects"
    }
  ]'::jsonb
) on conflict (id) do nothing;
