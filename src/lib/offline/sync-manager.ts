import { OFFLINE_ENABLED } from "@/config/offline";
import {
  getPendingSyncCount,
  getPendingSyncItems,
  incrementSyncRetry,
  markSyncItemProcessing,
  removeSyncItem,
} from "./sync-queue";
import { pruneExpiredCache } from "./cache-store";
import { syncPendingStudyTopicTypesFromQueue } from "./processors/study-topic-type-processor";

export type SyncManagerEvent =
  | { type: "sync-start" }
  | { type: "sync-complete"; processed: number; failed: number }
  | { type: "sync-error"; message: string };

type SyncListener = (event: SyncManagerEvent) => void;

class OfflineSyncManager {
  private listeners = new Set<SyncListener>();
  private syncing = false;
  private started = false;

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: SyncManagerEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  start() {
    if (!OFFLINE_ENABLED || this.started || typeof window === "undefined") return;
    this.started = true;

    window.addEventListener("online", () => {
      void this.syncNow();
    });

    void pruneExpiredCache();
    if (navigator.onLine) {
      void this.syncNow();
    }
  }

  async syncNow(): Promise<{ processed: number; failed: number }> {
    if (!OFFLINE_ENABLED || this.syncing || typeof window === "undefined") {
      return { processed: 0, failed: 0 };
    }

    if (!navigator.onLine) {
      return { processed: 0, failed: 0 };
    }

    this.syncing = true;
    this.emit({ type: "sync-start" });

    let processed = 0;
    let failed = 0;

    try {
      await syncPendingStudyTopicTypesFromQueue();

      const items = await getPendingSyncItems();

      for (const item of items) {
        await markSyncItemProcessing(item.id);

        try {
          const res = await fetch(item.url, {
            method: item.action,
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: item.body ? JSON.stringify(item.body) : undefined,
          });

          if (!res.ok) {
            const message = `Sync failed (${res.status})`;
            await incrementSyncRetry(item.id, message);
            failed += 1;
            continue;
          }

          await removeSyncItem(item.id);
          processed += 1;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown sync error";
          await incrementSyncRetry(item.id, message);
          failed += 1;
        }
      }

      await pruneExpiredCache();
      this.emit({ type: "sync-complete", processed, failed });
      return { processed, failed };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      this.emit({ type: "sync-error", message });
      return { processed, failed };
    } finally {
      this.syncing = false;
    }
  }

  async getPendingCount(): Promise<number> {
    return getPendingSyncCount();
  }

  isSyncing(): boolean {
    return this.syncing;
  }
}

export const offlineSyncManager = new OfflineSyncManager();
