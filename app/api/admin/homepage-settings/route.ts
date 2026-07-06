import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { HomepageSettings } from "@/lib/homepageSettings";

export const dynamic = "force-dynamic";

type HomepageSettingsPayload = Partial<HomepageSettings>;

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("orendarm-admin-session")?.value === "true";
}

function settingsToRow(data: HomepageSettingsPayload) {
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
    show_quick_search: data.showQuickSearch ?? true,
    real_estate_blocks: data.realEstateBlocks,
    updated_at: new Date().toISOString(),
  };
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
    const { error } = await supabase
      .from("homepage_settings")
      .upsert(settingsToRow(payload), { onConflict: "id" });

    if (error) {
      console.error("HOMEPAGE SETTINGS SAVE ERROR:", error);

      return Response.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }
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

  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  return saveHomepageSettings(request);
}

export async function POST(request: Request) {
  return saveHomepageSettings(request);
}
