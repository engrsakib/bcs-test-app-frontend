const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

/** Same-origin path; works with next.config rewrites when public env is missing at build. */
const CLIENT_API_FALLBACK = "/api/v1";

/** Absolute URL for server-side fetch (new URL() requires a full base). */
const SERVER_API_FALLBACK =
  "https://mcq-analysis-apps-server.onrender.com/api/v1";

function readPublicBaseUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!value || value === "undefined") return undefined;
  return stripTrailingSlash(value);
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
export const SERVER_API_BASE_URL =
  configuredBaseUrl ?? SERVER_API_FALLBACK;
