import { serveStatic } from "hono/bun";
import config from "./zosite.json";
import { Hono } from "hono";
import { apiRoutes, loadApiRoutes } from "./routes/api";
import { writeError, clearError } from "./lib/errors";
import { escapeHtml, pathToTitle } from "./lib/text";
const app = new Hono();
const ASSETS_DIR = process.env.SPACE_ASSETS_DIR || "./assets";
const RAW_HANDLE = process.env.VITE_HANDLE || "";
const HANDLE = RAW_HANDLE ? escapeHtml(RAW_HANDLE) : "";
let siteSettings = {};
try {
    siteSettings = await Bun.file("./space-settings.json").json();
}
catch {
    // No settings file yet — all defaults
}
let pagesMeta = {};
try {
    pagesMeta = await Bun.file("./pages-meta.json").json();
}
catch {
    // No per-page meta file yet — every page inherits space defaults
}
let indexTemplate = await Bun.file("./dist/index.html").text();
if (siteSettings.lang && siteSettings.lang !== "en") {
    indexTemplate = indexTemplate.replace('<html lang="en">', `<html lang="${escapeHtml(siteSettings.lang)}">`);
}
if (siteSettings.favicon_url) {
    indexTemplate = indexTemplate.replace('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />', `<link rel="icon" href="${escapeHtml(siteSettings.favicon_url)}" />`);
}
if (siteSettings.custom_head_html) {
    indexTemplate = indexTemplate.replace("</head>", `${siteSettings.custom_head_html}\n</head>`);
}
const clientSettings = {
    ...(siteSettings.site_title && { site_title: siteSettings.site_title }),
    ...(siteSettings.site_description && {
        site_description: siteSettings.site_description,
    }),
    ...(siteSettings.og_image_url && { og_image_url: siteSettings.og_image_url }),
    ...(siteSettings.custom_404_route && {
        custom_404_route: siteSettings.custom_404_route,
    }),
    ...(siteSettings.hide_built_on_zo_badge && {
        hide_built_on_zo_badge: true,
    }),
};
if (Object.keys(clientSettings).length > 0) {
    indexTemplate = indexTemplate.replace("</head>", `<script>window.__ZO_SITE_SETTINGS__=${JSON.stringify(clientSettings).replace(/</g, "\\u003c")}</script>\n</head>`);
}
const PLACEHOLDER_RE = /__ZO_OG_(TITLE|DESCRIPTION|IMAGE|URL)__/g;
function injectMeta(rawPath) {
    const path = escapeHtml(rawPath);
    const isHome = rawPath === "/";
    const pageMeta = pagesMeta[rawPath];
    // Three-tier resolution: per-page override → space default → handle-derived auto.
    const overrideTitle = pageMeta?.page_title?.trim();
    const safeSpaceTitle = siteSettings.site_title
        ? escapeHtml(siteSettings.site_title)
        : undefined;
    const title = overrideTitle
        ? escapeHtml(overrideTitle)
        : safeSpaceTitle
            ? isHome
                ? safeSpaceTitle
                : `${escapeHtml(pathToTitle(rawPath))} — ${safeSpaceTitle}`
            : HANDLE
                ? isHome
                    ? `${HANDLE} | Zo Space`
                    : `${HANDLE}${path} | Zo Space`
                : isHome
                    ? "Zo Space"
                    : `${escapeHtml(pathToTitle(rawPath))} — Zo Space`;
    const overrideDescription = pageMeta?.page_description?.trim();
    const description = overrideDescription
        ? escapeHtml(overrideDescription)
        : siteSettings.site_description
            ? escapeHtml(siteSettings.site_description)
            : HANDLE
                ? isHome
                    ? `Visit ${HANDLE}'s Zo Space.`
                    : `Explore ${HANDLE}'s Zo Space page at ${path}.`
                : isHome
                    ? "A Zo Space."
                    : `Explore this Zo Space page at ${path}.`;
    const spaceOrigin = RAW_HANDLE
        ? `https://${RAW_HANDLE}.zo.space`
        : "https://zo.space";
    const canonicalOrigin = siteSettings.site_url || spaceOrigin;
    const ogBgUrl = pageMeta?.page_og_image_url || siteSettings.og_image_url || "";
    const spaceOgBase = `https://zo.computer/api/space-og?handle=${encodeURIComponent(RAW_HANDLE)}&path=${encodeURIComponent(rawPath)}`;
    const ogWithBg = ogBgUrl
        ? `${spaceOgBase}&bg=${encodeURIComponent(`${spaceOrigin}${ogBgUrl}`)}`
        : spaceOgBase;
    const ogImage = siteSettings.hide_handle_overlay
        ? `${ogWithBg}&hide_overlay=1`
        : ogWithBg;
    const canonicalUrl = `${canonicalOrigin}${path}`;
    const values = {
        TITLE: title,
        DESCRIPTION: description,
        IMAGE: ogImage,
        URL: canonicalUrl,
    };
    let html = indexTemplate.replace(PLACEHOLDER_RE, (_, key) => values[key]);
    // Per-page noindex overrides the space-wide setting in either direction.
    // 'block' → emit the tag; 'allow' → never emit it; absent → fall back to space.
    let noindex = siteSettings.noindex ?? false;
    if (pageMeta?.page_noindex === "block")
        noindex = true;
    else if (pageMeta?.page_noindex === "allow")
        noindex = false;
    if (noindex) {
        html = html.replace("</head>", '<meta name="robots" content="noindex, nofollow" />\n</head>');
    }
    return html;
}
await loadApiRoutes(writeError, clearError);
process.on("uncaughtException", (error) => {
    writeError("_server", "uncaught", error).catch(() => { });
});
process.on("unhandledRejection", (reason) => {
    writeError("_server", "uncaught", reason).catch(() => { });
});
app.onError(async (error, c) => {
    const route = c.req.path;
    await writeError(route, "runtime", error);
    return c.json({ error: `Internal server error` }, 500);
});
app.get("/api/_health", (c) => c.json({ status: "ok" }));
// Internal endpoint for client-side error reporting (React ErrorBoundary)
app.post("/api/_error", async (c) => {
    try {
        const body = await c.req.json();
        const { route, error, stack } = body;
        if (route && error) {
            await writeError(route, "runtime", { message: error, stack });
        }
        return c.json({ ok: true });
    }
    catch (e) {
        console.error("[_error] Malformed error report:", e);
        return c.json({ ok: false }, 400);
    }
});
for (const [path, routeConfig] of Object.entries(apiRoutes)) {
    app.all(path, async (c) => {
        try {
            const response = await routeConfig.handler(c);
            await clearError(path);
            return response;
        }
        catch (error) {
            await writeError(path, "runtime", error);
            return c.json({ error: `Route ${path} encountered an error` }, 500);
        }
    });
}
app.get("/robots.txt", (c) => {
    const body = siteSettings.robots_txt || "User-agent: *\nAllow: /\n";
    return c.text(body);
});
app.use("/assets/*", serveStatic({ root: "./dist" }));
app.use("/assets/*", async (c, next) => {
    try {
        const staticFile = Bun.file(`${ASSETS_DIR}${c.req.path}`);
        if (await staticFile.exists()) {
            const stat = await staticFile.stat();
            if (stat && !stat.isDirectory()) {
                return new Response(staticFile.stream(), {
                    headers: {
                        "Content-Type": staticFile.type,
                        "Content-Length": String(staticFile.size),
                    },
                });
            }
        }
    }
    catch { }
    return next();
});
app.get("/favicon.ico", (c) => {
    const target = siteSettings.favicon_url || "/favicon.svg";
    return c.redirect(target, 302);
});
app.use(async (c, next) => {
    if (c.req.method !== "GET" && c.req.method !== "HEAD")
        return next();
    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/"))
        return next();
    // Check agent-uploaded static files first (e.g., /images/logo.png)
    try {
        const staticFile = Bun.file(`${ASSETS_DIR}${path}`);
        if (await staticFile.exists()) {
            const stat = await staticFile.stat();
            if (stat && !stat.isDirectory()) {
                await clearError(path);
                return new Response(staticFile.stream(), {
                    headers: {
                        "Content-Type": staticFile.type,
                        "Content-Length": String(staticFile.size),
                    },
                });
            }
        }
    }
    catch (error) {
        await writeError(path, "asset", error);
        return c.notFound();
    }
    // Then check dist (Vite built files)
    try {
        const file = Bun.file(`./dist${path}`);
        if (await file.exists()) {
            const stat = await file.stat();
            if (stat && !stat.isDirectory()) {
                return new Response(file);
            }
        }
    }
    catch (error) {
        await writeError(path, "asset", error);
    }
    // If path looks like a static asset but wasn't found, return 404
    if (/\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|pdf)$/i.test(path)) {
        return c.notFound();
    }
    // SPA fallback with server-side meta injection
    return c.html(injectMeta(path));
});
const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : (config.publish?.published_port ?? config.local_port);
export default { fetch: app.fetch, port, idleTimeout: 255 };
