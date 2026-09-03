"use client";

import { useCallback, useEffect, useState } from "react";
import { offlineSyncManager } from "@/lib/offline/sync-manager";

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    const count = await offlineSyncManager.getPendingCount();
    setPendingCount(count);
  }, []);

  const syncNow = useCallback(async () => {
    const result = await offlineSyncManager.syncNow();
    await refreshPendingCount();
    return result;
  }, [refreshPendingCount]);

  useEffect(() => {
    offlineSyncManager.start();

    void refreshPendingCount();

    const unsubscribe = offlineSyncManager.subscribe((event) => {
      if (event.type === "sync-start") {
        setIsSyncing(true);
      }

      if (event.type === "sync-complete" || event.type === "sync-error") {
        setIsSyncing(false);
        void refreshPendingCount();
      }
    });

    return unsubscribe;
  }, [refreshPendingCount]);

  return {
    isSyncing,
    pendingCount,
    syncNow,
    refreshPendingCount,
  };
}
