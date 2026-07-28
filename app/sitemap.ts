import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/getProperties";
import { getPropertySlug } from "@/lib/getPropertySlug";
import { getPublishedNews } from "@/lib/getPublishedNews";
import {
  filterSeoLandingProperties,
  seoLandingPages,
  seoLandingUpdatedAt,
} from "@/lib/seoLandingPages";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, news] = await Promise.all([
    getProperties(),
    getPublishedNews(),
  ]);
  const indexableSeoLandingPages = seoLandingPages.filter(
    (page) => filterSeoLandingProperties(properties, page).length > 0,
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/objects"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...indexableSeoLandingPages.map((page) => ({
      url: absoluteUrl(`/nerukhomist/${page.slug}`),
      lastModified: new Date(seoLandingUpdatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...properties.map((property) => ({
      url: absoluteUrl(`/objects/${getPropertySlug(property)}`),
      lastModified: property.updated_at
        ? new Date(property.updated_at)
        : property.created_at
          ? new Date(property.created_at)
          : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/news"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...news.map((item) => ({
      url: absoluteUrl(`/news/${item.slug}`),
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : item.created_at
          ? new Date(item.created_at)
          : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
