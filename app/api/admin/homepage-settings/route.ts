import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import {
  rowToSettings,
  type HomepageSettings,
  type HomepageSettingsRow,
} from "@/lib/homepageSettings";

export const dynamic = "force-dynamic";

type HomepageSettingsPayload = Partial<HomepageSettings>;

const homepageSettingsSelect =
  "id, hero_title, hero_subtitle, hero_button_text, hero_button_url, section_title, section_subtitle, telegram_title, telegram_text, telegram_button_text, telegram_url, real_estate_blocks";

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

function settingsToRow(data: HomepageSettings) {
  return {
    id: 1,
    hero_title: data.heroTitle,
    hero_subtitle: data.heroSubtitle,
    hero_button_text: data.heroButtonText,
    hero_button_url: data.heroButtonUrl,
    section_title: data.sectionTitle,
    section_subtitle: data.sectionSubtitle,
    telegram_title: data.telegramTitle,
    telegram_text: data.telegramText,
    telegram_button_text: data.telegramButtonText,
    telegram_url: data.telegramUrl,
    real_estate_blocks: data.realEstateBlocks,
    updated_at: new Date().toISOString(),
  };
}

function hasOwn<T extends object>(object: T, key: keyof HomepageSettings) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function mergeHomepageSettings(
  currentSettings: HomepageSettings,
  payload: HomepageSettingsPayload
): HomepageSettings {
  return {
    heroTitle:
      typeof payload.heroTitle === "string"
        ? payload.heroTitle
        : currentSettings.heroTitle,
    heroSubtitle:
      typeof payload.heroSubtitle === "string"
        ? payload.heroSubtitle
        : currentSettings.heroSubtitle,
    heroButtonText:
      typeof payload.heroButtonText === "string"
        ? payload.heroButtonText
        : currentSettings.heroButtonText,
    heroButtonUrl:
      typeof payload.heroButtonUrl === "string"
        ? payload.heroButtonUrl
        : currentSettings.heroButtonUrl,
    sectionTitle:
      typeof payload.sectionTitle === "string"
        ? payload.sectionTitle
        : currentSettings.sectionTitle,
    sectionSubtitle:
      typeof payload.sectionSubtitle === "string"
        ? payload.sectionSubtitle
        : currentSettings.sectionSubtitle,
    telegramTitle:
      typeof payload.telegramTitle === "string"
        ? payload.telegramTitle
        : currentSettings.telegramTitle,
    telegramText:
      typeof payload.telegramText === "string"
        ? payload.telegramText
        : currentSettings.telegramText,
    telegramButtonText:
      typeof payload.telegramButtonText === "string"
        ? payload.telegramButtonText
        : currentSettings.telegramButtonText,
    telegramUrl:
      typeof payload.telegramUrl === "string"
        ? payload.telegramUrl
        : currentSettings.telegramUrl,
    realEstateBlocks: hasOwn(payload, "realEstateBlocks")
      ? Array.isArray(payload.realEstateBlocks)
        ? payload.realEstateBlocks
        : []
      : currentSettings.realEstateBlocks,
  };
}

async function loadHomepageSettings() {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("homepage_settings")
      .select(homepageSettingsSelect)
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("HOMEPAGE SETTINGS LOAD ERROR:", error);

      return Response.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      settings: rowToSettings(data as HomepageSettingsRow | null),
    });
  } catch (error) {
    console.error("HOMEPAGE SETTINGS LOAD API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити налаштування головної сторінки.",
      },
      { status: 500 }
    );
  }
}

async function saveHomepageSettings(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | HomepageSettingsPayload
    | null;

  if (!payload) {
    return Response.json(
      { ok: false, message: "Некоректні дані налаштувань." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: currentData, error: currentError } = await supabase
      .from("homepage_settings")
      .select(homepageSettingsSelect)
      .eq("id", 1)
      .maybeSingle();

    if (currentError) {
      console.error("HOMEPAGE SETTINGS CURRENT LOAD ERROR:", currentError);

      return Response.json(
        { ok: false, message: currentError.message },
        { status: 500 }
      );
    }

    const currentSettings = rowToSettings(
      currentData as HomepageSettingsRow | null
    );
    const mergedSettings = mergeHomepageSettings(currentSettings, payload);
    const { data, error } = await supabase
      .from("homepage_settings")
      .upsert(settingsToRow(mergedSettings), { onConflict: "id" })
      .select(homepageSettingsSelect)
      .single();

    if (error) {
      console.error("HOMEPAGE SETTINGS SAVE ERROR:", error);

      return Response.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      settings: rowToSettings(data as HomepageSettingsRow | null),
    });
  } catch (error) {
    console.error("HOMEPAGE SETTINGS API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося зберегти налаштування головної сторінки.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return loadHomepageSettings();
}

export async function PATCH(request: Request) {
  return saveHomepageSettings(request);
}

export async function POST(request: Request) {
  return saveHomepageSettings(request);
}
