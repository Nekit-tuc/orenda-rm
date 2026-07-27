import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { Partner } from "@/types/partner";

export const dynamic = "force-dynamic";

const partnerSelect =
  "id, name, logo_url, is_active, sort_order, created_at, updated_at";

const allowedTypes = new Map([
  ["image/svg+xml", "svg"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const maxFileSize = 5 * 1024 * 1024;

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

function parseBoolean(value: FormDataEntryValue | null, fallback = true) {
  if (value === null) {
    return fallback;
  }

  return String(value) === "true";
}

function validateLogo(file: FormDataEntryValue | null): File {
  if (!(file instanceof File)) {
    throw new Error("Оберіть логотип партнера.");
  }

  const ext = allowedTypes.get(file.type);
  if (!ext) {
    throw new Error("Дозволені формати: svg, png, webp, jpg, jpeg.");
  }

  if (file.size > maxFileSize) {
    throw new Error("Логотип має бути до 5 MB.");
  }

  return file;
}

async function uploadPartnerLogo(partnerId: string, file: File) {
  const ext = allowedTypes.get(file.type);

  if (!ext) {
    throw new Error("Дозволені формати: svg, png, webp, jpg, jpeg.");
  }

  const filePath = `${partnerId}/${crypto.randomUUID()}.${ext}`;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage
    .from("partner-logos")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("partner-logos").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function GET() {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("partners")
    .select(partnerSelect)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ADMIN PARTNERS LOAD ERROR:", error);

    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, partners: data || [] });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const file = validateLogo(formData.get("logo"));

    if (!name) {
      throw new Error("Вкажіть назву компанії.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: created, error: createError } = await supabase
      .from("partners")
      .insert({
        name,
        logo_url: "",
        is_active: parseBoolean(formData.get("is_active"), true),
        sort_order: Number(formData.get("sort_order") || 0),
      })
      .select(partnerSelect)
      .single();

    if (createError || !created) {
      throw createError || new Error("Не вдалося створити партнера.");
    }

    try {
      const logoUrl = await uploadPartnerLogo(created.id, file);
      const { data, error } = await supabase
        .from("partners")
        .update({ logo_url: logoUrl })
        .eq("id", created.id)
        .select(partnerSelect)
        .single();

      if (error) {
        throw error;
      }

      revalidatePath("/");

      return Response.json({ ok: true, partner: data as Partner });
    } catch (uploadError) {
      await supabase.from("partners").delete().eq("id", created.id);
      throw uploadError;
    }
  } catch (error) {
    console.error("ADMIN PARTNER CREATE ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося створити партнера.",
      },
      { status: 500 }
    );
  }
}
