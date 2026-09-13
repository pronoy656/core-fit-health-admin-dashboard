import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_API_URL: z.string().default("http://10.10.7.11:5004/api/v1"),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD: z.string().optional()
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.11:5004/api/v1",
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL,
    NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD
  }
});
