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

function getStoragePathFromPublicUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  const marker = "/storage/v1/object/public/partner-logos/";
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

function validateLogo(file: FormDataEntryValue | null): File | null {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (!allowedTypes.has(file.type)) {
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const supabase = createSupabaseAdminClient();
    const { data: current, error: loadError } = await supabase
      .from("partners")
      .select(partnerSelect)
      .eq("id", id)
      .maybeSingle();

    if (loadError || !current) {
      throw loadError || new Error("Партнера не знайдено.");
    }

    const name = String(formData.get("name") || "").trim();
    if (!name) {
      throw new Error("Вкажіть назву компанії.");
    }

    const update: Record<string, unknown> = {
      name,
      is_active: String(formData.get("is_active")) === "true",
      sort_order: Number(formData.get("sort_order") || 0),
    };
    const file = validateLogo(formData.get("logo"));
    let oldStoragePath: string | null = null;

    if (file) {
      update.logo_url = await uploadPartnerLogo(id, file);
      oldStoragePath = getStoragePathFromPublicUrl(current.logo_url);
    }

    const { data, error } = await supabase
      .from("partners")
      .update(update)
      .eq("id", id)
      .select(partnerSelect)
      .single();

    if (error) {
      throw error;
    }

    if (oldStoragePath) {
      const { error: storageError } = await supabase.storage
        .from("partner-logos")
        .remove([oldStoragePath]);

      if (storageError) {
        console.error("ADMIN PARTNER OLD LOGO DELETE ERROR:", storageError);
      }
    }

    revalidatePath("/");

    return Response.json({ ok: true, partner: data as Partner });
  } catch (error) {
    console.error("ADMIN PARTNER UPDATE ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося оновити партнера.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createSupabaseAdminClient();
  const { data: current, error: loadError } = await supabase
    .from("partners")
    .select(partnerSelect)
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    console.error("ADMIN PARTNER DELETE LOAD ERROR:", loadError);

    return Response.json({ ok: false, message: loadError.message }, { status: 500 });
  }

  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    console.error("ADMIN PARTNER DELETE ERROR:", error);

    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  const storagePath = getStoragePathFromPublicUrl(current?.logo_url);
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("partner-logos")
      .remove([storagePath]);

    if (storageError) {
      console.error("ADMIN PARTNER LOGO DELETE ERROR:", storageError);
    }
  }

  revalidatePath("/");

  return Response.json({ ok: true });
}
