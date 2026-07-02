import type { Metadata } from "next";

const BASE_URL = "https://arifindocs.id";

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
