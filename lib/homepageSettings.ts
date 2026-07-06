import { createClient } from "@supabase/supabase-js";

export type HomepageSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonUrl: string;
  sectionTitle: string;
  sectionSubtitle: string;
  telegramTitle: string;
  telegramText: string;
  telegramButtonText: string;
  telegramUrl: string;
  realEstateBlocks: RealEstateBlockSettings[];
};

export type RealEstateBlockSettings = {
  tag: string;
  title: string;
  text: string;
  date: string;
  image: string;
  href: string;
};

export type HomepageSettingsRow = {
  id: number;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_button_text: string | null;
  hero_button_url: string | null;
  section_title: string | null;
  section_subtitle: string | null;
  telegram_title: string | null;
  telegram_text: string | null;
  telegram_button_text: string | null;
  telegram_url: string | null;
  real_estate_blocks: RealEstateBlockSettings[] | null;
};

export const defaultRealEstateBlocks: RealEstateBlockSettings[] = [
  {
    tag: "Ринок",
    title: "Попит на оренду комерційних приміщень у Житомирі зростає",
    text: "Огляд попиту на офіси, склади та комерційні приміщення у Житомирі.",
    date: "25 червня 2026",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  },
  {
    tag: "Поради",
    title: "Як правильно обрати приміщення для оренди: 7 важливих порад",
    text: "На що звернути увагу перед підписанням договору оренди.",
    date: "25 червня 2026",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  },
  {
    tag: "Інвестиції",
    title: "Інвестиційна нерухомість: актуальні тренди року",
    text: "Які обʼєкти залишаються цікавими для інвесторів у регіоні.",
    date: "25 червня 2026",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  },
  {
    tag: "Оренда",
    title: "Склади та виробничі приміщення в Житомирській області",
    text: "Короткий зріз пропозицій для бізнесу та виробництва.",
    date: "25 червня 2026",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  },
];

export const defaultHomepageSettings: HomepageSettings = {
  heroTitle: "Нерухомість в Житомирі та області",
  heroSubtitle:
    "Комерційні приміщення, офіси, склади, квартири та інвестиційні об'єкти в одному сучасному каталозі.",
  heroButtonText: "Дивитись об'єкти",
  heroButtonUrl: "#objects",
  sectionTitle: "Актуальні об'єкти",
  sectionSubtitle: "Каталог нерухомості",
  telegramTitle: "Зв'язатися в Telegram",
  telegramText:
    "Напишіть нам у Telegram, щоб уточнити деталі, домовитися про перегляд або запропонувати свій об'єкт.",
  telegramButtonText: "Зв'язатися",
  telegramUrl: "https://t.me/zt_space",
  realEstateBlocks: defaultRealEstateBlocks,
};

function normalizeRealEstateBlocks(
  blocks: RealEstateBlockSettings[] | null
): RealEstateBlockSettings[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return defaultRealEstateBlocks;
  }

  return blocks
    .filter((block) => block && typeof block === "object")
    .map((block, index) => {
    const fallback =
      defaultRealEstateBlocks[index] ||
      defaultRealEstateBlocks[defaultRealEstateBlocks.length - 1];

    return {
      tag: block.tag || fallback.tag,
      title: block.title || fallback.title,
      text: block.text || fallback.text,
      date: block.date || fallback.date,
      image: block.image || fallback.image,
      href: block.href || fallback.href,
    };
  });
}

export function createEmptyRealEstateBlock(): RealEstateBlockSettings {
  return {
    tag: "Новина",
    title: "Нова новина ринку нерухомості",
    text: "Короткий опис новини для головної сторінки.",
    date: new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  };
}

export function rowToSettings(row: HomepageSettingsRow | null): HomepageSettings {
  if (!row) {
    return defaultHomepageSettings;
  }

  return {
    heroTitle: row.hero_title || defaultHomepageSettings.heroTitle,
    heroSubtitle: row.hero_subtitle || defaultHomepageSettings.heroSubtitle,
    heroButtonText: row.hero_button_text || defaultHomepageSettings.heroButtonText,
    heroButtonUrl: row.hero_button_url || defaultHomepageSettings.heroButtonUrl,
    sectionTitle: row.section_title || defaultHomepageSettings.sectionTitle,
    sectionSubtitle: row.section_subtitle || defaultHomepageSettings.sectionSubtitle,
    telegramTitle: row.telegram_title || defaultHomepageSettings.telegramTitle,
    telegramText: row.telegram_text || defaultHomepageSettings.telegramText,
    telegramButtonText:
      row.telegram_button_text || defaultHomepageSettings.telegramButtonText,
    telegramUrl: row.telegram_url || defaultHomepageSettings.telegramUrl,
    realEstateBlocks: normalizeRealEstateBlocks(row.real_estate_blocks),
  };
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const noStoreSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
          }),
      },
    }
  );

  const { data, error } = await noStoreSupabase
    .from("homepage_settings")
    .select(
      "id, hero_title, hero_subtitle, hero_button_text, hero_button_url, section_title, section_subtitle, telegram_title, telegram_text, telegram_button_text, telegram_url, real_estate_blocks"
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Homepage settings error:", error);
    return defaultHomepageSettings;
  }

  return rowToSettings(data as HomepageSettingsRow | null);
}
