"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui";
import { CounterProvider, QueryProvider, ThemeProvider, SocketProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <CounterProvider>
          <QueryProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </QueryProvider>
        </CounterProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
