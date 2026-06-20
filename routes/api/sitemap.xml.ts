import type { Context } from "hono";
import breedsData from "../../assets/breeds-data.json" with { type: "json" };

const routes = [
  "/",
  "/about",
  "/contact",
  "/privacy-policy",
  "/age-calculator",
  "/bmi-calculator",
  "/business-day-calculator",
  "/calorie-calculator",
  "/can-my-dog-eat",
  "/can-my-cat-eat",
  "/cat-age-calculator",
  "/chocolate-toxicity-calculator",
  "/currency-converter",
  "/date-difference-calculator",
  "/dhl-dimensional-weight-calculator",
  "/dog-age-calculator",
  "/fedex-dimensional-weight-calculator",
  "/invoice-due-date-calculator",
  "/lily-toxicity-checker",
  "/minesweeper",
  "/loan-calculator",
  "/mortgage-calculator-australia",
  "/percentage-calculator",
  "/pet-body-condition-score",
  "/pet-calorie-calculator",
  "/puppy-adult-weight-calculator",
  "/rhyme-zone",
  "/time-zone-converter",
  "/unit-converter",
  "/ups-dimensional-weight-calculator",
  "/url-encoder-decoder",
  "/volumetric-weight-calculator",
  "/wheel-spinner",
  "/famous-birthdays",
  "/word-counter",
  "/xylitol-toxicity-calculator",
  "/breeds",
];

export default function handler(c: Context) {
  const base = "https://www.tinytoolboxes.com";
  const breedSlugs = Object.keys(breedsData as Record<string, unknown>);
  const allRoutes = [...routes, ...breedSlugs.map((s) => `/breed/${s}`)];
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
