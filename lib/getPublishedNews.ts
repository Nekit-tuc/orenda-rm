import { createClient } from "@supabase/supabase-js";
import type { RealEstateNews } from "@/types/news";

const newsSelect =
  "id, slug, title, excerpt, content, category, image_url, published, featured, sort_order, published_at, created_at, updated_at";

function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          next: { revalidate: 0 },
        }),
    },
  });
}

export async function getPublishedNews(limit?: number): Promise<RealEstateNews[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("real_estate_news")
    .select(newsSelect)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("PUBLISHED NEWS FETCH ERROR:", error);
    return [];
  }

  return (data || []) as RealEstateNews[];
}

export async function getPublishedNewsBySlug(
  slug: string
): Promise<RealEstateNews | null> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("real_estate_news")
    .select(newsSelect)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("PUBLISHED NEWS BY SLUG FETCH ERROR:", error);
    return null;
  }

  return (data as RealEstateNews | null) ?? null;
}
