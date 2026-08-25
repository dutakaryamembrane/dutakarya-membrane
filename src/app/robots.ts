import type { MetadataRoute } from "next";

const siteUrl = "https://dutakarya-membrane.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/login",
      ],
    },

    sitemap: `${siteUrl}/sitemap.xml`,
  };
}