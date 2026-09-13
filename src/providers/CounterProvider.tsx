"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

import type { CounterState } from "@/types/counter";

export const CounterContext = createContext<CounterState | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((value) => value + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((value) => value - 1);
  }, []);

  const value = useMemo<CounterState>(
    () => ({
      count,
      increment,
      decrement
    }),
    [count, decrement, increment]
  );

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}
