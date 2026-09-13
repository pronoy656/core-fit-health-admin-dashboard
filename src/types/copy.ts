import type { ReactNode } from "react";

export interface CopyContextValue {
  t: (key: string) => string;
  rich: (key: string, map: Record<string, (chunks: string) => ReactNode>) => ReactNode;
}
