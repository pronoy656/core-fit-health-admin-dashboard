import type { MetadataRoute } from "next";

import { env } from "@/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [{ url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 }];
}
