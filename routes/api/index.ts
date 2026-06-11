import type { Context } from "hono";

export type ApiRouteHandler = (c: Context) => Response | Promise<Response>;

export interface ApiRouteConfig {
  handler: ApiRouteHandler;
  public: boolean;
}

export interface ApiRouteManifest {
  file: string;
  public: boolean;
}

export const apiRouteManifest: Record<string, ApiRouteManifest> = {
  "/ads.txt": { file: "ads.txt", public: true },
  "/api/rhyme-zone": { file: "api-rhyme-zone", public: true },
  "/robots.txt": { file: "robots.txt", public: true },
  "/sitemap.xml": { file: "sitemap.xml", public: true },
};

export const apiRoutes: Record<string, ApiRouteConfig> = {};

export async function loadApiRoutes(
  writeError: (route: string, type: "import", error: unknown) => Promise<void>,
  clearError: (route: string) => Promise<void>
): Promise<void> {
  for (const [path, manifest] of Object.entries(apiRouteManifest)) {
    try {
      const module = await import(`./${manifest.file}.ts`);
      let handler: ApiRouteHandler;

      if (typeof module.default === "function") {
        handler = module.default;
      } else if (typeof module.default === "object" && module.default !== null) {
        const methods: Record<string, ApiRouteHandler> = {};
        for (const [key, val] of Object.entries(module.default)) {
          if (typeof val === "function") methods[key.toUpperCase()] = val as ApiRouteHandler;
        }
        if (Object.keys(methods).length === 0) {
          throw new Error(`Route ${path} default export has no handler methods`);
        }
        handler = async (c: Context) => {
          const fn = methods[c.req.method];
          if (!fn) return c.json({ error: "Method not allowed" }, 405);
          return fn(c);
        };
      } else {
        throw new Error(`Route ${path} must export a default function or method handlers`);
      }

      apiRoutes[path] = {
        handler,
        public: manifest.public,
      };

      await clearError(path);
    } catch (error) {
      await writeError(path, "import", error);
    }
  }
}
