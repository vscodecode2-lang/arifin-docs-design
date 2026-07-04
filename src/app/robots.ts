import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const BASE_URL = SITE_URL;

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