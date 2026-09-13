"use client";

import { useContext } from "react";

import { CounterContext } from "@/providers/CounterProvider";

export function useCounter() {
  const context = useContext(CounterContext);

  if (!context) {
    throw new Error("useCounter must be used within CounterProvider");
  }

  return context;
}
