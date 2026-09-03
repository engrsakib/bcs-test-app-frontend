import {
  getOfflineDb,
  isOfflineStorageAvailable,
  type SyncQueueEntry,
  type SyncQueueStatus,
} from "./db";

export type EnqueueSyncOptions = {
  entity: string;
  action: SyncQueueEntry["action"];
  url: string;
  body?: unknown;
};

export async function enqueueSyncItem(
  options: EnqueueSyncOptions
): Promise<SyncQueueEntry> {
  if (!isOfflineStorageAvailable()) {
    throw new Error("Sync queue requires IndexedDB");
  }

  const item: SyncQueueEntry = {
    id: crypto.randomUUID(),
    entity: options.entity,
    action: options.action,
    url: options.url,
    body: options.body,
    createdAt: Date.now(),
    retries: 0,
    status: "pending",
  };

  await getOfflineDb().sync_queue.put(item);
  return item;
}

export async function getPendingSyncItems(): Promise<SyncQueueEntry[]> {
  if (!isOfflineStorageAvailable()) return [];

  return getOfflineDb().sync_queue
    .where("status")
    .anyOf(["pending", "failed"])
    .sortBy("createdAt");
}

export async function getPendingSyncCount(): Promise<number> {
  if (!isOfflineStorageAvailable()) return 0;
  return getOfflineDb().sync_queue
    .where("status")
    .anyOf(["pending", "failed"])
    .count();
}

export async function updateSyncItemStatus(
  id: string,
  status: SyncQueueStatus,
  lastError?: string
): Promise<void> {
  if (!isOfflineStorageAvailable()) return;

  await getOfflineDb().sync_queue.update(id, {
    status,
    lastError,
    ...(status === "pending" ? {} : {}),
  });
}

export async function incrementSyncRetry(
  id: string,
  lastError: string
): Promise<void> {
  if (!isOfflineStorageAvailable()) return;

  const item = await getOfflineDb().sync_queue.get(id);
  if (!item) return;

  await getOfflineDb().sync_queue.update(id, {
    retries: item.retries + 1,
    status: "failed",
    lastError,
  });
}

export async function removeSyncItem(id: string): Promise<void> {
  if (!isOfflineStorageAvailable()) return;
  await getOfflineDb().sync_queue.delete(id);
}

export async function markSyncItemProcessing(id: string): Promise<void> {
  await updateSyncItemStatus(id, "processing");
}
