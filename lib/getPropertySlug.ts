import { createSlug } from "@/lib/createSlug";

type PropertySlugInput = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
};

export function getPropertySlug(property: PropertySlugInput) {
  const existingSlug = property.slug?.trim();

  if (existingSlug) {
    return existingSlug;
  }

  return createSlug(property.title || "object", property.id ?? undefined);
}
