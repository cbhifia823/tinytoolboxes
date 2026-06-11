import type { Context } from "hono";

export default function handler(c: Context) {
  const body = `User-agent: *
Allow: /
Sitemap: https://padawan.zo.space/sitemap.xml
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
