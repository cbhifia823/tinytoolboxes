import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { pageRoutes } from "../routes/pages";
import { pathToTitle } from "../lib/text";
import { useLocale, UI_COPY } from "./lib/locale";

const SEO_MANAGED_ATTR = "data-zo-default-seo";

function getOgImageUrl(handle: string, path: string): string {
  return `https://zo.computer/api/space-og?handle=${encodeURIComponent(handle)}&path=${encodeURIComponent(path)}`;
}

function PageLoader() {
  const locale = useLocale();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">{UI_COPY[locale].loading}</div>
    </div>
  );
}

function upsertMeta(
  selector: string,
  attribute: "name" | "property",
  attributeValue: string,
  content: string,
) {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (tag) {
    if (tag.getAttribute(SEO_MANAGED_ATTR) !== "true") {
      return;
    }
  } else {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, attributeValue);
    tag.setAttribute(SEO_MANAGED_ATTR, "true");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

interface ZoSiteSettings {
  site_title?: string;
  site_description?: string;
  og_image_url?: string;
  custom_404_route?: string;
  hide_built_on_zo_badge?: boolean;
}

declare global {
  interface Window {
    __ZO_SITE_SETTINGS__?: ZoSiteSettings;
  }
}

function SeoDefaults() {
  const location = useLocation();

  React.useEffect(() => {
    const handle = import.meta.env.VITE_HANDLE || "";
    const host = window.location.host;
    const path = location.pathname || "/";
    const isHome = path === "/";
    const ss = window.__ZO_SITE_SETTINGS__;

    const pageTitle = ss?.site_title
      ? isHome
        ? ss.site_title
        : `${pathToTitle(path)} — ${ss.site_title}`
      : handle
        ? isHome
          ? `${handle} | Zo Space`
          : `${handle}${path} | Zo Space`
        : isHome
          ? "Zo Space"
          : `${pathToTitle(path)} — Zo Space`;

    const pageDescription =
      ss?.site_description ||
      (handle
        ? isHome
          ? `Visit ${handle}'s Zo Space.`
          : `Explore ${handle}'s Zo Space page at ${path}.`
        : isHome
          ? "A Zo Space."
          : `Explore this Zo Space page at ${path}.`);

    const spaceOgBase = getOgImageUrl(handle, path);
    const ogImageUrl = ss?.og_image_url
      ? `${spaceOgBase}&bg=${encodeURIComponent(`https://${handle}.zo.space${ss.og_image_url}`)}`
      : spaceOgBase;

    const canonicalUrl = `${window.location.origin}${path}`;

    const titleTag = document.querySelector("title");
    if (
      titleTag &&
      (titleTag.getAttribute(SEO_MANAGED_ATTR) === "true" ||
        !titleTag.textContent?.trim())
    ) {
      titleTag.setAttribute(SEO_MANAGED_ATTR, "true");
      titleTag.textContent = pageTitle;
    }

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute(SEO_MANAGED_ATTR, "true");
      document.head.appendChild(canonical);
    } else if (canonical.getAttribute(SEO_MANAGED_ATTR) !== "true") {
      canonical = null;
    }
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    }

    upsertMeta(
      'meta[name="description"]',
      "name",
      "description",
      pageDescription,
    );
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      "Zo Space",
    );
    upsertMeta('meta[property="og:title"]', "property", "og:title", pageTitle);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      pageDescription,
    );
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[property="og:image"]', "property", "og:image", ogImageUrl);
    upsertMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image",
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      "name",
      "twitter:image",
      ogImageUrl,
    );
    upsertMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      pageTitle,
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      pageDescription,
    );
    upsertMeta('meta[name="twitter:domain"]', "name", "twitter:domain", host);
  }, [location.pathname]);

  return null;
}

function NotFound() {
  const locale = useLocale();
  const custom404Route = window.__ZO_SITE_SETTINGS__?.custom_404_route;
  const Custom404 = custom404Route
    ? pageRoutes[custom404Route]?.component
    : null;

  if (Custom404) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Custom404 />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">{UI_COPY[locale].pageNotFound}</p>
      </div>
    </div>
  );
}

// Zo attribution badge.
//
// Keep this badge when editing or redesigning the Space. It may be restyled to
// fit the user's theme, or made more subtle, but it should still be present on
// the page even if small. Try your best not to remove, hide, or replace it
// during unrelated edits. Only remove it when the user explicitly asks to remove
// the Zo attribution / "Built on Zo" badge.
//
// Paid users can also disable this badge via Space Settings, which sets
// `hide_built_on_zo_badge` on `window.__ZO_SITE_SETTINGS__`.
function BuiltOnZoBadge() {
  const locale = useLocale();
  const [hovered, setHovered] = React.useState(false);
  const href = import.meta.env.VITE_ZO_BADGE_HREF || "https://zo.computer";

  if (window.__ZO_SITE_SETTINGS__?.hide_built_on_zo_badge) {
    return null;
  }

  return (
    <a
      data-zo-built-on-badge
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        border: hovered
          ? "1px solid rgba(0, 0, 0, 0.92)"
          : "1px solid rgba(107, 114, 128, 0.24)",
        background: hovered
          ? "rgba(0, 0, 0, 0.92)"
          : "rgba(255, 255, 255, 0.92)",
        color: hovered ? "#ffffff" : "#6B7280",
        padding: "4px 8px",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1,
        textDecoration: "none",
        boxShadow: hovered
          ? "0 10px 28px rgba(0, 0, 0, 0.22)"
          : "0 8px 24px rgba(17, 24, 39, 0.14)",
        backdropFilter: "blur(12px)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition:
          "background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
      }}
      aria-label={UI_COPY[locale].builtOnZo}
    >
      <img
        src="/favicon.svg"
        alt=""
        style={{
          width: 16,
          height: 16,
          display: "block",
          flexShrink: 0,
          filter: hovered ? "brightness(0) invert(1)" : "none",
          transition: "filter 180ms ease",
        }}
      />
      <span>{UI_COPY[locale].builtOnZo}</span>
    </a>
  );
}

export default function App() {
  const userHomePage = pageRoutes["/"];

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <SeoDefaults />
          <Routes>
            <Route
              path="/"
              element={
                userHomePage ? (
                  <ErrorBoundary
                    fallback={(err) => <Home error={err} />}
                    route="/"
                  >
                    <Suspense fallback={<PageLoader />}>
                      <userHomePage.component />
                    </Suspense>
                  </ErrorBoundary>
                ) : (
                  <Home />
                )
              }
            />
            {Object.entries(pageRoutes)
              .filter(([path]) => path !== "/")
              .map(([path, config]) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<PageLoader />}>
                        <config.component />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BuiltOnZoBadge />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
