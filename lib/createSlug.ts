export function createSlug(title: string, id?: number) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-zа-яіїєґ0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return id ? `${slug}-${id}` : slug;
}