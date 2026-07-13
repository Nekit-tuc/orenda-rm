import { createClient } from "@supabase/supabase-js";

export type RealEstateBlockSettings = {
  tag: string;
  title: string;
  text: string;
  date: string;
  image: string;
  href: string;
};

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
    text: "Які обʼєкти залишаються цікавими для інвесторів.",
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

const homepageSettingsSelect =
  "id, hero_title, hero_subtitle, hero_button_text, hero_button_url, section_title, section_subtitle, telegram_title, telegram_text, telegram_button_text, telegram_url, real_estate_blocks";

const legacyTextReplacements = new Map<string, string>([
  ["OrendaRM", "Investal Estate"],
  ["Orenda RM", "Investal Estate"],
  ["Оренда RM", "Investal Estate"],
  ["Нерухомість в Житомирі та області", defaultHomepageSettings.heroTitle],
  ["Нерухомість у Житомирі та області", defaultHomepageSettings.heroTitle],
  [
    "Комерційні приміщення, офіси, склади, квартири та інвестиційні об'єкти в одному сучасному каталозі.",
    defaultHomepageSettings.heroSubtitle,
  ],
  [
    "Попит на оренду комерційних приміщень у Житомирі зростає",
    "Попит на комерційні приміщення зростає",
  ],
  [
    "Огляд попиту на офіси, склади та комерційні приміщення у Житомирі.",
    "Огляд актуального попиту на офіси, склади та комерційні простори.",
  ],
  [
    "Склади та виробничі приміщення в Житомирській області",
    "Склади та виробничі приміщення для бізнесу",
  ],
  ["Р РёРЅРѕРє", "Ринок"],
  ["РџРѕСЂР°РґРё", "Поради"],
  ["Р†РЅРІРµСЃС‚РёС†С–С—", "Інвестиції"],
  ["РћСЂРµРЅРґР°", "Оренда"],
  ["25 С‡РµСЂРІРЅСЏ 2026", "25 червня 2026"],
  [
    "РџРѕРїРёС‚ РЅР° РєРѕРјРµСЂС†С–Р№РЅС– РїСЂРёРјС–С‰РµРЅРЅСЏ Р·СЂРѕСЃС‚Р°С”",
    "Попит на комерційні приміщення зростає",
  ],
  [
    "РћРіР»СЏРґ Р°РєС‚СѓР°Р»СЊРЅРѕРіРѕ РїРѕРїРёС‚Сѓ РЅР° РѕС„С–СЃРё, СЃРєР»Р°РґРё С‚Р° РєРѕРјРµСЂС†С–Р№РЅС– РїСЂРѕСЃС‚РѕСЂРё.",
    "Огляд актуального попиту на офіси, склади та комерційні простори.",
  ],
  [
    "РЇРє РїСЂР°РІРёР»СЊРЅРѕ РѕР±СЂР°С‚Рё РїСЂРёРјС–С‰РµРЅРЅСЏ РґР»СЏ РѕСЂРµРЅРґРё: 7 РІР°Р¶Р»РёРІРёС… РїРѕСЂР°Рґ",
    "Як правильно обрати приміщення для оренди: 7 важливих порад",
  ],
  [
    "РќР° С‰Рѕ Р·РІРµСЂРЅСѓС‚Рё СѓРІР°РіСѓ РїРµСЂРµРґ РїС–РґРїРёСЃР°РЅРЅСЏРј РґРѕРіРѕРІРѕСЂСѓ РѕСЂРµРЅРґРё.",
    "На що звернути увагу перед підписанням договору оренди.",
  ],
  [
    "Р†РЅРІРµСЃС‚РёС†С–Р№РЅР° РЅРµСЂСѓС…РѕРјС–СЃС‚СЊ: Р°РєС‚СѓР°Р»СЊРЅС– С‚СЂРµРЅРґРё СЂРѕРєСѓ",
    "Інвестиційна нерухомість: актуальні тренди року",
  ],
  [
    "РЇРєС– РѕР±КјС”РєС‚Рё Р·Р°Р»РёС€Р°СЋС‚СЊСЃСЏ С†С–РєР°РІРёРјРё РґР»СЏ С–РЅРІРµСЃС‚РѕСЂС–РІ.",
    "Які обʼєкти залишаються цікавими для інвесторів.",
  ],
  [
    "РЎРєР»Р°РґРё С‚Р° РІРёСЂРѕР±РЅРёС‡С– РїСЂРёРјС–С‰РµРЅРЅСЏ РґР»СЏ Р±С–Р·РЅРµСЃСѓ",
    "Склади та виробничі приміщення для бізнесу",
  ],
  [
    "РљРѕСЂРѕС‚РєРёР№ Р·СЂС–Р· РїСЂРѕРїРѕР·РёС†С–Р№ РґР»СЏ Р±С–Р·РЅРµСЃСѓ С‚Р° РІРёСЂРѕР±РЅРёС†С‚РІР°.",
    "Короткий зріз пропозицій для бізнесу та виробництва.",
  ],
]);

function normalizeLegacyText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  return legacyTextReplacements.get(trimmed) ?? trimmed;
}

function normalizeRealEstateBlock(
  block: unknown,
  index: number
): RealEstateBlockSettings | null {
  if (!block || typeof block !== "object") {
    return null;
  }

  const item = block as Partial<RealEstateBlockSettings>;
  const fallback =
    defaultRealEstateBlocks[index % defaultRealEstateBlocks.length] ??
    defaultRealEstateBlocks[0];

  return {
    tag: normalizeLegacyText(item.tag, fallback.tag),
    title: normalizeLegacyText(item.title, fallback.title),
    text: normalizeLegacyText(item.text, fallback.text),
    date: normalizeLegacyText(item.date, fallback.date),
    image: normalizeLegacyText(item.image, fallback.image),
    href: normalizeLegacyText(item.href, fallback.href),
  };
}

export function normalizeRealEstateBlocks(
  blocks: unknown
): RealEstateBlockSettings[] {
  if (blocks === null || blocks === undefined) {
    return defaultRealEstateBlocks;
  }

  if (!Array.isArray(blocks)) {
    return defaultRealEstateBlocks;
  }

  return blocks
    .map((block, index) => normalizeRealEstateBlock(block, index))
    .filter((block): block is RealEstateBlockSettings => Boolean(block));
}

export function rowToSettings(
  row: HomepageSettingsRow | null | undefined
): HomepageSettings {
  if (!row) {
    return defaultHomepageSettings;
  }

  return {
    heroTitle: normalizeLegacyText(row.hero_title, defaultHomepageSettings.heroTitle),
    heroSubtitle: normalizeLegacyText(
      row.hero_subtitle,
      defaultHomepageSettings.heroSubtitle
    ),
    heroButtonText: normalizeLegacyText(
      row.hero_button_text,
      defaultHomepageSettings.heroButtonText
    ),
    heroButtonUrl: normalizeLegacyText(
      row.hero_button_url,
      defaultHomepageSettings.heroButtonUrl
    ),
    sectionTitle: normalizeLegacyText(
      row.section_title,
      defaultHomepageSettings.sectionTitle
    ),
    sectionSubtitle: normalizeLegacyText(
      row.section_subtitle,
      defaultHomepageSettings.sectionSubtitle
    ),
    telegramTitle: normalizeLegacyText(
      row.telegram_title,
      defaultHomepageSettings.telegramTitle
    ),
    telegramText: normalizeLegacyText(
      row.telegram_text,
      defaultHomepageSettings.telegramText
    ),
    telegramButtonText: normalizeLegacyText(
      row.telegram_button_text,
      defaultHomepageSettings.telegramButtonText
    ),
    telegramUrl: normalizeLegacyText(
      row.telegram_url,
      defaultHomepageSettings.telegramUrl
    ),
    realEstateBlocks: normalizeRealEstateBlocks(row.real_estate_blocks),
  };
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
    image: defaultRealEstateBlocks[0].image,
    href: "/#objects",
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
