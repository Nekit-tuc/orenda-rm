export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://investal-est.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Investal Estate";
export const DEFAULT_OG_IMAGE = "/opengraph-image.jpg";

export function absoluteUrl(path: string = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
