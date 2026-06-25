import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/getProperties";
import { getPropertySlug } from "@/lib/getPropertySlug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://orenda-rm.vercel.app";
  const properties = await getProperties();

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
  ];
}
