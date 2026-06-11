export const apiRouteManifest = {
    "/ads.txt": { file: "ads.txt", public: true },
    "/api/rhyme-zone": { file: "api-rhyme-zone", public: true },
    "/robots.txt": { file: "robots.txt", public: true },
    "/sitemap.xml": { file: "sitemap.xml", public: true },
};
export const apiRoutes = {};
export async function loadApiRoutes(writeError, clearError) {
    for (const [path, manifest] of Object.entries(apiRouteManifest)) {
        try {
            const module = await import(`./${manifest.file}.ts`);
            let handler;
            if (typeof module.default === "function") {
                handler = module.default;
            }
            else if (typeof module.default === "object" && module.default !== null) {
                const methods = {};
                for (const [key, val] of Object.entries(module.default)) {
                    if (typeof val === "function")
                        methods[key.toUpperCase()] = val;
                }
                if (Object.keys(methods).length === 0) {
                    throw new Error(`Route ${path} default export has no handler methods`);
                }
                handler = async (c) => {
                    const fn = methods[c.req.method];
                    if (!fn)
                        return c.json({ error: "Method not allowed" }, 405);
                    return fn(c);
                };
            }
            else {
                throw new Error(`Route ${path} must export a default function or method handlers`);
            }
            apiRoutes[path] = {
                handler,
                public: manifest.public,
            };
            await clearError(path);
        }
        catch (error) {
            await writeError(path, "import", error);
        }
    }
}
