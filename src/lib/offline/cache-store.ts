import { getOfflineDb, isOfflineStorageAvailable } from "./db";

export type CachedResult<T> = {
  data: T;
  fetchedAt: number;
  isStale: boolean;
  fromCache: boolean;
};

export function isStaleEntry(fetchedAt: number, ttlMs: number, now = Date.now()): boolean {
  return now - fetchedAt > ttlMs;
}

export async function getCached<T>(key: string): Promise<CachedResult<T> | null> {
  if (!isOfflineStorageAvailable()) return null;

  const entry = await getOfflineDb().content_cache.get(key);
  if (!entry) return null;

  return {
    data: entry.value as T,
    fetchedAt: entry.fetchedAt,
    isStale: isStaleEntry(entry.fetchedAt, entry.ttlMs),
    fromCache: true,
  };
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlMs: number
): Promise<void> {
  if (!isOfflineStorageAvailable()) return;

  await getOfflineDb().content_cache.put({
    key,
    value,
    fetchedAt: Date.now(),
    ttlMs,
  });
}

export async function deleteCached(key: string): Promise<void> {
  if (!isOfflineStorageAvailable()) return;
  await getOfflineDb().content_cache.delete(key);
}

export async function pruneExpiredCache(now = Date.now()): Promise<number> {
  if (!isOfflineStorageAvailable()) return 0;

  const entries = await getOfflineDb().content_cache.toArray();
  const expiredKeys = entries
    .filter((entry) => isStaleEntry(entry.fetchedAt, entry.ttlMs, now))
    .map((entry) => entry.key);

  if (expiredKeys.length) {
    await getOfflineDb().content_cache.bulkDelete(expiredKeys);
  }

  return expiredKeys.length;
}

export async function getMeta<T>(key: string): Promise<T | null> {
  if (!isOfflineStorageAvailable()) return null;
  const entry = await getOfflineDb().meta.get(key);
  return (entry?.value as T) ?? null;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  if (!isOfflineStorageAvailable()) return;
  await getOfflineDb().meta.put({ key, value });
}
