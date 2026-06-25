import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";
import { getPropertySlug } from "@/lib/getPropertySlug";

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

  if (Number.isInteger(id)) {
    const { data: propertyById, error: idError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (propertyById) {
      return {
        data: propertyById as Property,
        error: null,
        foundBy: "id" as const,
      };
    }

    if (idError) {
      console.error("Property id lookup error:", idError);
    }
  }

  const { data: properties, error: generatedSlugError } = await supabase
    .from("properties")
    .select("*");

  if (generatedSlugError) {
    console.error("Property generated slug lookup error:", generatedSlugError);

    return {
      data: null,
      error: generatedSlugError,
      foundBy: null,
    };
  }

  const propertyByGeneratedSlug = (properties as Property[] | null)?.find(
    (property) => getPropertySlug(property) === slugOrId
  );

  return {
    data: propertyByGeneratedSlug || null,
    error: slugError,
    foundBy: propertyByGeneratedSlug ? ("generated-slug" as const) : null,
  };
}
