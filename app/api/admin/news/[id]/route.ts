import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { NewsFormPayload, RealEstateNews } from "@/types/news";

export const dynamic = "force-dynamic";

const newsSelect =
  "id, slug, title, excerpt, content, category, image_url, published, featured, sort_order, published_at, created_at, updated_at";

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

function buildNewsUpdate(payload: Partial<NewsFormPayload>) {
  const update: Record<string, unknown> = {};

  if (typeof payload.title === "string") {
    const title = payload.title.trim();

    if (!title) {
      throw new Error("Вкажіть заголовок новини.");
    }

    update.title = title;
  }

  if ("excerpt" in payload) {
    update.excerpt = payload.excerpt?.trim() || null;
  }

  if ("content" in payload) {
    update.content = payload.content?.trim() || null;
  }

  if ("category" in payload) {
    update.category = payload.category?.trim() || null;
  }

  if ("image_url" in payload) {
    update.image_url = payload.image_url?.trim() || null;
  }

  if (typeof payload.published === "boolean") {
    update.published = payload.published;
  }

  if (typeof payload.featured === "boolean") {
    update.featured = payload.featured;
  }

  if ("sort_order" in payload) {
    update.sort_order = Number.isFinite(Number(payload.sort_order))
      ? Number(payload.sort_order)
      : 0;
  }

  if ("published_at" in payload) {
    update.published_at = payload.published_at || new Date().toISOString();
  }

  return update;
}

function revalidateNewsPaths(news?: Pick<RealEstateNews, "slug"> | null) {
  revalidatePath("/");
  revalidatePath("/news");

  if (news?.slug) {
    revalidatePath(`/news/${news.slug}`);
  }
}

function getStoragePathFromPublicUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  const marker = "/storage/v1/object/public/news-images/";
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as
    | Partial<NewsFormPayload>
    | null;

  if (!payload) {
    return Response.json(
      { ok: false, message: "Некоректні дані новини." },
      { status: 400 }
    );
  }

  try {
    const update = buildNewsUpdate(payload);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("real_estate_news")
      .update(update)
      .eq("id", id)
      .select(newsSelect)
      .single();

    if (error) {
      console.error("ADMIN NEWS UPDATE ERROR:", error);

      return Response.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    revalidateNewsPaths(data as RealEstateNews);

    return Response.json({ ok: true, news: data });
  } catch (error) {
    console.error("ADMIN NEWS UPDATE API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося оновити новину.",
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
  const { data: existingNews, error: loadError } = await supabase
    .from("real_estate_news")
    .select(newsSelect)
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    console.error("ADMIN NEWS DELETE LOAD ERROR:", loadError);

    return Response.json(
      { ok: false, message: loadError.message },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("real_estate_news").delete().eq("id", id);

  if (error) {
    console.error("ADMIN NEWS DELETE ERROR:", error);

    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  const storagePath = getStoragePathFromPublicUrl(existingNews?.image_url);
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("news-images")
      .remove([storagePath]);

    if (storageError) {
      console.error("ADMIN NEWS IMAGE DELETE ERROR:", storageError);
    }
  }

  revalidateNewsPaths(existingNews as RealEstateNews | null);

  return Response.json({ ok: true });
}
