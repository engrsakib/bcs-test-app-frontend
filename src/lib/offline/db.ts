import Dexie, { type Table } from "dexie";

export type ContentCacheEntry = {
  key: string;
  value: unknown;
  fetchedAt: number;
  ttlMs: number;
};

export type DraftEntry = {
  draftId: string;
  type: string;
  payload: unknown;
  updatedAt: number;
};

export type SyncQueueStatus = "pending" | "processing" | "failed";

export type SyncQueueEntry = {
  id: string;
  entity: string;
  action: "POST" | "PATCH" | "DELETE";
  url: string;
  body?: unknown;
  createdAt: number;
  retries: number;
  status: SyncQueueStatus;
  lastError?: string;
};

export type StoredNotification = {
  _id: string;
  title: string;
  description: string;
  module: string;
  time: string;
  isRead: boolean;
  createdAt?: string;
  actorName?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  cachedAt: number;
};

export type MetaEntry = {
  key: string;
  value: unknown;
};

export class OfflineDatabase extends Dexie {
  content_cache!: Table<ContentCacheEntry, string>;
  drafts!: Table<DraftEntry, string>;
  sync_queue!: Table<SyncQueueEntry, string>;
  notifications!: Table<StoredNotification, string>;
  meta!: Table<MetaEntry, string>;

  constructor() {
    super("EduMasterOffline");

    this.version(1).stores({
      content_cache: "key",
      drafts: "draftId, type, updatedAt",
      sync_queue: "id, entity, status, createdAt",
      notifications: "_id, cachedAt, isRead",
      meta: "key",
    });
  }
}

let dbInstance: OfflineDatabase | null = null;

export function getOfflineDb(): OfflineDatabase {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }

  if (!dbInstance) {
    dbInstance = new OfflineDatabase();
  }

  return dbInstance;
}

export function isOfflineStorageAvailable(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}
