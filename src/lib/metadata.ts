import type { Metadata } from "next";

// SITE_URL — satu sumber kebenaran untuk semua URL (canonical, OG, sitemap,
// robots, structured data). Default ke domain Vercel yang benar-benar live
// sekarang. Begitu domain arifindocs.id sudah dibeli, cukup set env var
// NEXT_PUBLIC_SITE_URL=https://arifindocs.id di Vercel lalu redeploy —
// tidak perlu ubah kode sama sekali.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arifindocs-id.vercel.app";

const BASE_URL = SITE_URL;

export function buildPageMetadata({
  title,
  description,
  path = "/",
  openGraph,
  twitter,
}: {
  title: string;
  description: string;
  path?: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
}): Metadata {
  const canonicalUrl = new URL(path, BASE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonicalUrl,
      title,
      description,
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...twitter,
    },
  };
}

export function buildImageMetadata(alt: string) {
  return [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt,
    },
  ];
}
