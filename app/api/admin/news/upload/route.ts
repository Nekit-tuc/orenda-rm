import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const maxFileSize = 10 * 1024 * 1024;

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const newsId = String(formData?.get("newsId") || "drafts");

  if (!(file instanceof File)) {
    return Response.json(
      { ok: false, message: "Оберіть фото новини." },
      { status: 400 }
    );
  }

  const ext = allowedTypes.get(file.type);
  if (!ext) {
    return Response.json(
      { ok: false, message: "Дозволені формати: jpg, jpeg, png, webp." },
      { status: 400 }
    );
  }

  if (file.size > maxFileSize) {
    return Response.json(
      { ok: false, message: "Фото має бути до 10 MB." },
      { status: 400 }
    );
  }

  const safeFolder = newsId.replace(/[^a-zA-Z0-9-]/g, "") || "drafts";
  const filePath = `${safeFolder}/${crypto.randomUUID()}.${ext}`;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage
    .from("news-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("ADMIN NEWS IMAGE UPLOAD ERROR:", error);

    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("news-images").getPublicUrl(filePath);

  return Response.json({ ok: true, url: data.publicUrl, path: filePath });
}
