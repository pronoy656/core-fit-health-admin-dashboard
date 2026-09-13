import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { seoConfig } from "@/config/seo";

import { Providers } from "@/providers";
import { Toaster } from "@/ui";

import "@/styles/globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = seoConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${inter.variable} font-sans flex min-h-screen w-full flex-col antialiased bg-background text-foreground`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
