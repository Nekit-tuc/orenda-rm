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
    title: "Попит на комерційні приміщення зростає",
    text: "Огляд актуального попиту на офіси, склади та комерційні простори.",
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
    title: "Склади та виробничі приміщення для бізнесу",
    text: "Короткий зріз пропозицій для бізнесу та виробництва.",
    date: "25 червня 2026",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    href: "/#objects",
  },
];

export const defaultHomepageSettings: HomepageSettings = {
  heroTitle: "Інвестиційна нерухомість по всій Україні",
  heroSubtitle:
    "Комерційні приміщення, земельні ділянки, будинки, квартири та інвестиційні об'єкти в одному сучасному каталозі.",
  heroButtonText: "Дивитись об'єкти",
  heroButtonUrl: "#objects",
  sectionTitle: "Преміальні об'єкти",
  sectionSubtitle: "Каталог Investal Estate",
  telegramTitle: "Зв'язатися в Telegram",
  telegramText:
    "Напишіть нам у Telegram, щоб уточнити деталі, домовитися про перегляд або запропонувати свій об'єкт.",
  telegramButtonText: "Зв'язатися",
  telegramUrl: "https://t.me/orenda_rm",
  realEstateBlocks: defaultRealEstateBlocks,
};

function normalizeRealEstateBlocks(
  blocks: RealEstateBlockSettings[] | null | undefined
): RealEstateBlockSettings[] {
  if (blocks === null || blocks === undefined) {
    return defaultRealEstateBlocks;
  }

  if (!Array.isArray(blocks)) {
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
      title: normalizeBrandText(block.title || null, fallback.title),
      text: normalizeBrandText(block.text || null, fallback.text),
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

function normalizeBrandText(value: string | null, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  const legacyHeroLocal = "\u041d\u0435\u0440\u0443\u0445\u043e\u043c\u0456\u0441\u0442\u044c \u0432 \u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0456 \u0442\u0430 \u043e\u0431\u043b\u0430\u0441\u0442\u0456";
  const legacyHeroRegional = "\u041d\u0435\u0440\u0443\u0445\u043e\u043c\u0456\u0441\u0442\u044c \u0443 \u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0456 \u0442\u0430 \u043e\u0431\u043b\u0430\u0441\u0442\u0456";

  if (trimmed === legacyHeroLocal || trimmed === legacyHeroRegional) {
    return fallback;
  }

  const legacyLatinCompact = "\u004f\u0072\u0065\u006e\u0064\u0061\u0052\u004d";
  const legacyLatinSpaced = "\u004f\u0072\u0065\u006e\u0064\u0061\\s?\u0052\u004d";
  const legacyCyrillic = "\u041e\u0440\u0435\u043d\u0434\u0430\\s?\u0052\u004d";

  return trimmed
    .replace(
      new RegExp(
        "\u041f\u043e\u043f\u0438\u0442 \u043d\u0430 \u043e\u0440\u0435\u043d\u0434\u0443 \u043a\u043e\u043c\u0435\u0440\u0446\u0456\u0439\u043d\u0438\u0445 \u043f\u0440\u0438\u043c\u0456\u0449\u0435\u043d\u044c \u0443 \u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0456 \u0437\u0440\u043e\u0441\u0442\u0430\u0454",
        "g"
      ),
      "Попит на комерційні приміщення зростає"
    )
    .replace(
      new RegExp(
        "\u041e\u0433\u043b\u044f\u0434 \u043f\u043e\u043f\u0438\u0442\u0443 \u043d\u0430 \u043e\u0444\u0456\u0441\u0438, \u0441\u043a\u043b\u0430\u0434\u0438 \u0442\u0430 \u043a\u043e\u043c\u0435\u0440\u0446\u0456\u0439\u043d\u0456 \u043f\u0440\u0438\u043c\u0456\u0449\u0435\u043d\u043d\u044f \u0443 \u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0456\\.",
        "g"
      ),
      "Огляд актуального попиту на офіси, склади та комерційні простори."
    )
    .replace(
      new RegExp(
        "\u0421\u043a\u043b\u0430\u0434\u0438 \u0442\u0430 \u0432\u0438\u0440\u043e\u0431\u043d\u0438\u0447\u0456 \u043f\u0440\u0438\u043c\u0456\u0449\u0435\u043d\u043d\u044f \u0432 \u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0441\u044c\u043a\u0456\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0456",
        "g"
      ),
      "Склади та виробничі приміщення для бізнесу"
    )
    .replace(new RegExp(legacyLatinCompact, "gi"), "Investal Estate")
    .replace(new RegExp(legacyLatinSpaced, "gi"), "Investal Estate")
    .replace(new RegExp(legacyCyrillic, "gi"), "Investal Estate");
}

export function rowToSettings(row: HomepageSettingsRow | null): HomepageSettings {
  if (!row) {
    return defaultHomepageSettings;
  }

  return {
    heroTitle: normalizeBrandText(row.hero_title, defaultHomepageSettings.heroTitle),
    heroSubtitle: normalizeBrandText(row.hero_subtitle, defaultHomepageSettings.heroSubtitle),
    heroButtonText: normalizeBrandText(row.hero_button_text, defaultHomepageSettings.heroButtonText),
    heroButtonUrl: row.hero_button_url || defaultHomepageSettings.heroButtonUrl,
    sectionTitle: normalizeBrandText(row.section_title, defaultHomepageSettings.sectionTitle),
    sectionSubtitle: normalizeBrandText(row.section_subtitle, defaultHomepageSettings.sectionSubtitle),
    telegramTitle: normalizeBrandText(row.telegram_title, defaultHomepageSettings.telegramTitle),
    telegramText: normalizeBrandText(row.telegram_text, defaultHomepageSettings.telegramText),
    telegramButtonText:
      normalizeBrandText(row.telegram_button_text, defaultHomepageSettings.telegramButtonText),
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
