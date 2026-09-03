import { OFFLINE_ENABLED } from "@/config/offline";
import { getCached, setCached } from "./cache-store";

export class OfflineError extends Error {
  constructor(message = "You are offline and no cached data is available.") {
    super(message);
    this.name = "OfflineError";
  }
}

export type FetchWithCacheOptions<T> = {
  ttlMs: number;
  fallbackToStale?: boolean;
  enabled?: boolean;
  fetcher: () => Promise<T>;
};

export type FetchWithCacheResult<T> = {
  data: T;
  fromCache: boolean;
  isStale: boolean;
  fetchedAt: number;
};

function isBrowserOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

export async function fetchWithCache<T>(
  key: string,
  options: FetchWithCacheOptions<T>
): Promise<FetchWithCacheResult<T>> {
  const {
    ttlMs,
    fallbackToStale = true,
    enabled = OFFLINE_ENABLED,
    fetcher,
  } = options;

  const cached = enabled ? await getCached<T>(key) : null;

  if (isBrowserOnline()) {
    try {
      const data = await fetcher();
      if (enabled) {
        await setCached(key, data, ttlMs);
      }

      return {
        data,
        fromCache: false,
        isStale: false,
        fetchedAt: Date.now(),
      };
    } catch (error) {
      if (cached && fallbackToStale) {
        return {
          data: cached.data,
          fromCache: true,
          isStale: cached.isStale,
          fetchedAt: cached.fetchedAt,
        };
      }
      throw error;
    }
  }

  if (cached) {
    return {
      data: cached.data,
      fromCache: true,
      isStale: cached.isStale,
      fetchedAt: cached.fetchedAt,
    };
  }

  throw new OfflineError();
}

export function hashFilters(value: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(value)))).slice(0, 32);
}
