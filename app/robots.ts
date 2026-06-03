import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://orenda-rm.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
