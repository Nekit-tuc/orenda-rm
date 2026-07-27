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
};

const homepageSettingsSelect =
  "id, hero_title, hero_subtitle, hero_button_text, hero_button_url, section_title, section_subtitle, telegram_title, telegram_text, telegram_button_text, telegram_url";

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

export function rowToSettings(
  row: HomepageSettingsRow | null | undefined
): HomepageSettings {
  if (!row) {
    return defaultHomepageSettings;
  }

  return {
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
  };
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
