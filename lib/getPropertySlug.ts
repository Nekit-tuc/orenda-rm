import { createSlug } from "@/lib/createSlug";

type PropertySlugInput = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
};

export function getPropertySlug(property: PropertySlugInput) {
  const id = property.id;
  const existingSlug = property.slug?.trim();

  if (existingSlug) {
    const slugWithoutId =
      id && existingSlug.endsWith(`-${id}`)
        ? existingSlug.slice(0, -String(id).length - 1)
        : existingSlug;
    const normalizedSlug = createSlug(slugWithoutId);

    if (!id) {
      return normalizedSlug;
    }

    return `${normalizedSlug}-${id}`;
  }

  return createSlug(property.title || "object", id ?? undefined);
}
