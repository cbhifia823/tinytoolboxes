import type { Context } from "hono";

const KEY = "cfb0a610a0e2c65de2c1dd1eb565313c";

export default function handler(c: Context) {
  return new Response(KEY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
