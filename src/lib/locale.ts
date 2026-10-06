// Shared handling for the visitor's saved language.
//
// Every page used to read localStorage directly and index its translation
// object with whatever it found. A value the page doesn't have (e.g. "ja",
// saved on a page that offers Japanese) made that lookup undefined and crashed
// the page for that visitor on every later visit. Pages now read through
// readSavedLocale(), which only returns a language the calling page supports.

export const LOCALE_STORAGE_KEY = "ttb-locale";
// Older key used by a couple of pages; read once as a fallback.
const LEGACY_STORAGE_KEY = "tt-locale";

// The languages every page on the site has.
export const BASE_LOCALES = ["en", "zh-hk", "zh-cn", "es"] as const;

export function readSavedLocale(supported: readonly string[] = BASE_LOCALES): string {
  if (typeof window === "undefined") return "en";
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(LOCALE_STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage can throw (privacy modes, blocked site data); fall back to English.
  }
  return saved && supported.includes(saved) ? saved : "en";
}
