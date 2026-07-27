import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/getProperties";
import { getPropertySlug } from "@/lib/getPropertySlug";
import { getPublishedNews } from "@/lib/getPublishedNews";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://investal-estate.vercel.app";
  const [properties, news] = await Promise.all([
    getProperties(),
    getPublishedNews(),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...properties.map((property) => ({
      url: `${baseUrl}/objects/${getPropertySlug(property)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...news.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
