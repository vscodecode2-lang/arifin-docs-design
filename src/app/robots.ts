import type { MetadataRoute } from "next";

const BASE_URL = "https://arifindocs.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/login",
          "/api/",
          "/invoice/",   // Invoice hanya bisa diakses via link langsung
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}