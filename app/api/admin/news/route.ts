import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createNewsSlug } from "@/lib/createNewsSlug";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { NewsFormPayload, RealEstateNews } from "@/types/news";

export const dynamic = "force-dynamic";

const newsSelect =
  "id, slug, title, excerpt, content, category, image_url, published, featured, sort_order, published_at, created_at, updated_at";

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

function normalizeNewsPayload(payload: NewsFormPayload) {
  const title = payload.title?.trim();

  if (!title) {
    throw new Error("Вкажіть заголовок новини.");
  }

  return {
    title,
    excerpt: payload.excerpt?.trim() || null,
    content: payload.content?.trim() || null,
    category: payload.category?.trim() || null,
    image_url: payload.image_url?.trim() || null,
    published: payload.published ?? true,
    featured: payload.featured ?? false,
    sort_order: Number.isFinite(Number(payload.sort_order))
      ? Number(payload.sort_order)
      : 0,
    published_at: payload.published_at || new Date().toISOString(),
  };
}

async function createUniqueSlug(title: string) {
  const supabase = createSupabaseAdminClient();
  const baseSlug = createNewsSlug(title);
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from("real_estate_news")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function revalidateNewsPaths(news?: Pick<RealEstateNews, "slug"> | null) {
  revalidatePath("/");
  revalidatePath("/news");

  if (news?.slug) {
    revalidatePath(`/news/${news.slug}`);
  }
}

export async function GET() {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("real_estate_news")
    .select(newsSelect)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("ADMIN NEWS LOAD ERROR:", error);

    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, news: data || [] });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | NewsFormPayload
    | null;

  if (!payload) {
    return Response.json(
      { ok: false, message: "Некоректні дані новини." },
      { status: 400 }
    );
  }

  try {
    const normalizedPayload = normalizeNewsPayload(payload);
    const slug = await createUniqueSlug(normalizedPayload.title);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("real_estate_news")
      .insert({ ...normalizedPayload, slug })
      .select(newsSelect)
      .single();

    if (error) {
      console.error("ADMIN NEWS CREATE ERROR:", error);

      return Response.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    revalidateNewsPaths(data as RealEstateNews);

    return Response.json({ ok: true, news: data });
  } catch (error) {
    console.error("ADMIN NEWS CREATE API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося створити новину.",
      },
      { status: 500 }
    );
  }
}
