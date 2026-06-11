import type { Context } from "hono";

const ADS_TXT = "google.com, pub-7326539635759576, DIRECT, f08c47fec0942fa0\n";

export default function handler(c: Context) {
  return new Response(ADS_TXT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
