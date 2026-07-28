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
};

export const defaultHomepageSettings: HomepageSettings = {
  heroTitle: "Оренда комерційної нерухомості Житомира та області",
  heroSubtitle:
    "Актуальні приміщення під магазини, офіси, аптеки та інші напрямків бізнесу в Житомирі.",
  heroButtonText: "Дивитись об’єкти",
  heroButtonUrl: "#objects",
  sectionTitle: "Комерційні приміщення в оренду",
  sectionSubtitle: "Оренда комерційної нерухомості",
  telegramTitle: "Зв’язатися в Telegram",
  telegramText:
    "Напишіть нам у Telegram, щоб уточнити деталі, домовитися про перегляд або залишити запит на підбір приміщення.",
  telegramButtonText: "Зв’язатися",
  telegramUrl: "https://t.me/orenda_rm",
};

const homepageSettingsSelect =
  "id, hero_title, hero_subtitle, hero_button_text, hero_button_url, section_title, section_subtitle, telegram_title, telegram_text, telegram_button_text, telegram_url";

const legacyHeroTitles = [
  "Комерційна нерухомість",
  "Комерційні приміщення в оренду у Житомирі та Житомирській області",
];

const legacyBroadSubtitleParts = [
  "земельні ділянки",
  "будинки",
  "квартири",
  "інвестиційні об'єкти",
  "інвестиційні об’єкти",
];

const legacySectionTitles = [
  "Актуальні об'єкти",
  "Актуальні об’єкти",
  "Преміальні об'єкти",
  "Преміальні об’єкти",
];

const legacySectionSubtitles = [
  "Каталог нерухомості",
  "Каталог Investal Estate",
];

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

function includesAny(value: string, parts: string[]) {
  return parts.some((part) => value.includes(part));
}

function normalizeHomepageContent(settings: HomepageSettings): HomepageSettings {
  return {
    ...settings,
    heroTitle: legacyHeroTitles.includes(settings.heroTitle)
      ? defaultHomepageSettings.heroTitle
      : settings.heroTitle,
    heroSubtitle: includesAny(settings.heroSubtitle, legacyBroadSubtitleParts)
      ? defaultHomepageSettings.heroSubtitle
      : settings.heroSubtitle,
    sectionTitle: legacySectionTitles.includes(settings.sectionTitle)
      ? defaultHomepageSettings.sectionTitle
      : settings.sectionTitle,
    sectionSubtitle: legacySectionSubtitles.includes(settings.sectionSubtitle)
      ? defaultHomepageSettings.sectionSubtitle
      : settings.sectionSubtitle,
  };
}

export function rowToSettings(
  row: HomepageSettingsRow | null | undefined
): HomepageSettings {
  if (!row) {
    return defaultHomepageSettings;
  }

  return normalizeHomepageContent({
    heroTitle: normalizeText(row.hero_title, defaultHomepageSettings.heroTitle),
    heroSubtitle: normalizeText(
      row.hero_subtitle,
      defaultHomepageSettings.heroSubtitle
    ),
    heroButtonText: normalizeText(
      row.hero_button_text,
      defaultHomepageSettings.heroButtonText
    ),
    heroButtonUrl: normalizeText(
      row.hero_button_url,
      defaultHomepageSettings.heroButtonUrl
    ),
    sectionTitle: normalizeText(
      row.section_title,
      defaultHomepageSettings.sectionTitle
    ),
    sectionSubtitle: normalizeText(
      row.section_subtitle,
      defaultHomepageSettings.sectionSubtitle
    ),
    telegramTitle: normalizeText(
      row.telegram_title,
      defaultHomepageSettings.telegramTitle
    ),
    telegramText: normalizeText(
      row.telegram_text,
      defaultHomepageSettings.telegramText
    ),
    telegramButtonText: normalizeText(
      row.telegram_button_text,
      defaultHomepageSettings.telegramButtonText
    ),
    telegramUrl: normalizeText(
      row.telegram_url,
      defaultHomepageSettings.telegramUrl
    ),
  });
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return defaultHomepageSettings;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          next: { revalidate: 0 },
        }),
    },
  });

  const { data, error } = await supabase
    .from("homepage_settings")
    .select(homepageSettingsSelect)
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("HOMEPAGE SETTINGS FETCH ERROR:", error);
    return defaultHomepageSettings;
  }

  return rowToSettings(data as HomepageSettingsRow | null);
}
