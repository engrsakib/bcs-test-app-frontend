const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

/** Same-origin path; works with next.config rewrites when public env is missing at build. */
const CLIENT_API_FALLBACK = "/api/v1";

/** Absolute URL for server-side fetch (new URL() requires a full base). */
const SERVER_API_FALLBACK = "http://187.52.120.181:9001/api/v1";

const API_V1_SUFFIX = "/api/v1";

function normalizeBaseUrl(url: string): string {
  const trimmed = stripTrailingSlash(url.trim());
  // Collapse accidental .../api/v1/api/v1 in env values
  return trimmed.replace(/(\/api\/v1)+$/i, API_V1_SUFFIX);
}

function readPublicBaseUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!value || value === "undefined") return undefined;
  return normalizeBaseUrl(value);
}

const configuredBaseUrl = readPublicBaseUrl();

export const ENV = {
  BASE_URL: configuredBaseUrl ?? CLIENT_API_FALLBACK,

  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
    UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
  },
};

/** Backend base for server-side proxy fetch (must be absolute). */
export const SERVER_API_BASE_URL = configuredBaseUrl ?? SERVER_API_FALLBACK;

/**
 * Build a full API URL from a path like "/question" or "/admin/login".
 * Strips a leading "/api/v1" from the path when the base already includes it.
 */
export function apiUrl(path: string): string {
  const base = stripTrailingSlash(ENV.BASE_URL);
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (base.endsWith(API_V1_SUFFIX) && cleanPath.startsWith(API_V1_SUFFIX)) {
    cleanPath = cleanPath.slice(API_V1_SUFFIX.length) || "/";
  }

  return `${base}${cleanPath}`;
}
