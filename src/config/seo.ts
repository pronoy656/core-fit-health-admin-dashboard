import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

const getBaseUrl = (): URL => {
  try {
    const rawUrl = siteConfig.url || "http://localhost:3000";
    return new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    return new URL("http://localhost:3000");
  }
};

export const seoConfig: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    images: [siteConfig.ogImage]
  }
};
