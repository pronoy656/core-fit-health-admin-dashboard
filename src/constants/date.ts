import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale";

export const DEFAULT_LOCALE = "en";

export const normalizeLocale = (loc?: string): string => {
  return (loc ?? DEFAULT_LOCALE).split("-")[0];
};

export const DATEFNS_LOCALES: Partial<Record<string, Locale>> = {
  en: enUS
};

export const getDateFnsLocale = (code?: string): Locale => {
  const normalized = normalizeLocale(code);
  return DATEFNS_LOCALES[normalized] ?? enUS;
};

export const DATE_PATTERN = {
  DATE: "PPP",
  DATE_TIME: "PPpp",
  TIME: "p"
} as const;
