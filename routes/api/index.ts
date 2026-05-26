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

export const apiRouteManifest: Record<string, ApiRouteManifest> = {};

export const apiRoutes: Record<string, ApiRouteConfig> = {};

export async function loadApiRoutes(
  writeError: (route: string, type: "import", error: unknown) => Promise<void>,
  clearError: (route: string) => Promise<void>,
): Promise<void> {
  for (const [path, manifest] of Object.entries(apiRouteManifest)) {
    try {
      const module = await import(`./${manifest.file}.ts`);

      if (typeof module.default !== "function") {
        throw new Error(`Route ${path} must have a default export function`);
      }

      apiRoutes[path] = {
        handler: module.default,
        public: manifest.public,
      };

      // Clear any previous error for this route
      await clearError(path);
    } catch (error) {
      await writeError(path, "import", error);
      // Route is skipped - not added to apiRoutes
    }
  }
}
