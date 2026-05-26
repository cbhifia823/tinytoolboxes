// Error logging utility for writing to .errors/ directory

import { mkdir } from "node:fs/promises";

const ERRORS_DIR = "./.errors";

// Paths to scrub from error messages/stacks - agent should never see these
const SCRUB_PATTERNS = [
  /\/__substrate\/space\//g,
  /\/__substrate\/default-space\//g,
  /\/root\/\.z\/space\//g,
  /\/root\/\.z\/space\/assets\//g,
];

export type ErrorType = "import" | "runtime" | "build" | "asset" | "uncaught";

export interface ErrorLog {
  route: string;
  type: ErrorType;
  error: string;
  stack?: string;
  timestamp: string;
}

function sanitizeFilename(route: string): string {
  if (route === "/") {
    return "_home";
  }
  const sanitized = route.replace(/\//g, "_");
  return route.startsWith("/") ? sanitized.replace(/^_/, "") : sanitized;
}

function scrubPaths(text: string): string {
  let result = text;
  for (const pattern of SCRUB_PATTERNS) {
    result = result.replace(pattern, "./");
  }
  return result;
}

export async function writeError(
  route: string,
  type: ErrorType,
  error: unknown,
): Promise<void> {
  try {
    await mkdir(ERRORS_DIR, { recursive: true });

    // Handle Error objects, plain objects with message/stack, or strings
    let rawMessage: string;
    let rawStack: string | undefined;

    if (error instanceof Error) {
      rawMessage = error.message;
      rawStack = error.stack;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      rawMessage = String((error as { message: unknown }).message);
      rawStack =
        "stack" in error
          ? String((error as { stack: unknown }).stack)
          : undefined;
    } else {
      rawMessage = String(error);
    }

    const errorLog: ErrorLog = {
      route,
      type,
      error: scrubPaths(rawMessage),
      stack: rawStack ? scrubPaths(rawStack) : undefined,
      timestamp: new Date().toISOString(),
    };

    const filename = `${ERRORS_DIR}/${sanitizeFilename(route)}.json`;
    await Bun.write(filename, JSON.stringify(errorLog, null, 2));

    // Console log with scrubbed paths too
    console.error(`[${type}] Error in ${route}:`, scrubPaths(rawMessage));
  } catch (writeError) {
    console.error("Failed to write error log:", writeError);
  }
}

export async function clearError(route: string): Promise<void> {
  try {
    const filename = `${ERRORS_DIR}/${sanitizeFilename(route)}.json`;
    const file = Bun.file(filename);
    if (await file.exists()) {
      const { unlink } = await import("node:fs/promises");
      await unlink(filename);
    }
  } catch {
    // Ignore - file might not exist
  }
}

export async function listErrors(): Promise<ErrorLog[]> {
  try {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(ERRORS_DIR);
    const errors: ErrorLog[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const content = await Bun.file(`${ERRORS_DIR}/${file}`).json();
          errors.push(content);
        } catch {
          // Skip malformed files
        }
      }
    }

    return errors;
  } catch {
    return [];
  }
}
