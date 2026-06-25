import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";

export async function getPropertyBySlugOrId(slugOrId: string) {
  const { data: propertyBySlug, error: slugError } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (propertyBySlug) {
    return {
      data: propertyBySlug as Property,
      error: null,
      foundBy: "slug" as const,
    };
  }

  if (slugError) {
    console.error("Property slug lookup error:", slugError);
  }

  const id = Number(slugOrId);

  if (!Number.isInteger(id)) {
    return {
      data: null,
      error: slugError,
      foundBy: null,
    };
  }

  const { data: propertyById, error: idError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return {
    data: (propertyById as Property | null) || null,
    error: idError,
    foundBy: propertyById ? ("id" as const) : null,
  };
}
