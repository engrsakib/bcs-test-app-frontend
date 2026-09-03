import { CACHE_TTL, OFFLINE_ENABLED } from "@/config/offline";
import { fetchWithCache } from "./cached-fetch";

export type ProxyResult<T> = {
  ok: boolean;
  status: number;
  data: T;
  fromCache?: boolean;
  isStale?: boolean;
  fetchedAt?: number;
};

function buildProxyPath(suffix: string): string {
  if (suffix.startsWith("?")) return suffix;
  if (!suffix) return "";
  return suffix.startsWith("/") ? suffix : `/${suffix}`;
}

async function fetchProxy<T>(
  base: string,
  path: string,
  options: RequestInit = {}
): Promise<ProxyResult<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as T;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}

export function createCachedProxy(
  base: string,
  namespace: string,
  ttlMs: number = CACHE_TTL.default
) {
  return async function cachedProxy<T = unknown>(
    suffix = "",
    options: RequestInit = {}
  ): Promise<ProxyResult<T>> {
    const method = (options.method || "GET").toUpperCase();
    const path = buildProxyPath(suffix);

    if (!OFFLINE_ENABLED || method !== "GET") {
      return fetchProxy<T>(base, path, options);
    }

    const cacheKey = `${namespace}:${method}:${path}`;

    try {
      const cached = await fetchWithCache<ProxyResult<T>>(cacheKey, {
        ttlMs,
        fetcher: async () => {
          const result = await fetchProxy<T>(base, path, options);
          if (!result.ok) {
            throw new Error(`Request failed (${result.status})`);
          }
          return result;
        },
      });

      return {
        ...cached.data,
        fromCache: cached.fromCache,
        isStale: cached.isStale,
        fetchedAt: cached.fetchedAt,
      };
    } catch {
      const fallback = await fetchProxy<T>(base, path, options);
      return fallback;
    }
  };
}

export async function fetchWithOfflineCache<T>(
  cacheKey: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<{ data: T; fromCache: boolean; isStale: boolean; fetchedAt: number }> {
  if (!OFFLINE_ENABLED) {
    const data = await fetcher();
    return {
      data,
      fromCache: false,
      isStale: false,
      fetchedAt: Date.now(),
    };
  }

  return fetchWithCache(cacheKey, { ttlMs, fetcher });
}
