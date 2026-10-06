import { useEffect, useState } from "react";
import { LOCALE_STORAGE_KEY, readSavedLocale } from "@/lib/locale";

// The five languages the redesigned pages support.
export const ALL_LOCALES = ["en", "zh-hk", "zh-cn", "ja", "es"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  "zh-hk": "繁",
  "zh-cn": "简",
  ja: "日",
  es: "ES",
};

// Full names, for screen readers and button titles.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  "zh-hk": "繁體中文",
  "zh-cn": "简体中文",
  ja: "日本語",
  es: "Español",
};

export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  "zh-hk": "zh-Hant-HK",
  "zh-cn": "zh-Hans-CN",
  ja: "ja",
  es: "es",
};

export function useLocale(): [Locale, (next: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(() => readSavedLocale(ALL_LOCALES) as Locale);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Storage unavailable; the choice just won't persist.
    }
  }, [locale]);

  return [locale, setLocale];
}
