import { env } from "@/env";
import type { SiteConfig } from "@/types/site-config";

export const siteConfig: SiteConfig = {
  name: "Admin Dashboard of CoreFit App",
  description: "This is an admin dashboard for CoreFit App",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "CoreFit",
  locale: "en",
  themeColor: "#012150",
  keywords: ["nextjs", "typescript", "tailwindcss", "boilerplate", "starter"],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/og.jpg"
} as const;
