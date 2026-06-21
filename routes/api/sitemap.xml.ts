import type { Context } from "hono";
import breedsData from "../../assets/breeds-data.json" with { type: "json" };
import { pageRoutes } from "../pages/index";

export default function handler(c: Context) {
  const base = "https://www.tinytoolboxes.com";

  // Auto-generate from the page route registry so every new tool is included
  // automatically. Skip non-public routes and dynamic param routes such as
  // "/breed/:slug" (the concrete breed URLs are added separately below).
  const staticRoutes = Object.entries(pageRoutes)
    .filter(([path, config]) => config.public && !path.includes(":"))
    .map(([path]) => path);

  const breedSlugs = Object.keys(breedsData as Record<string, unknown>);
  const allRoutes = [...staticRoutes, ...breedSlugs.map((s) => `/breed/${s}`)];

  const urls = allRoutes.map((path) => `  <url><loc>${base}${path}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
