"use client";

import { CloudOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { OFFLINE_ENABLED } from "@/config/offline";

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { isSyncing, pendingCount, syncNow } = useOfflineSync();

  if (!OFFLINE_ENABLED || online) {
    if (OFFLINE_ENABLED && pendingCount > 0 && online) {
      return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-900 flex items-center justify-between gap-3">
          <span>
            {pendingCount} change{pendingCount === 1 ? "" : "s"} waiting to sync
          </span>
          <button
            type="button"
            onClick={() => void syncNow()}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 font-medium hover:bg-amber-200 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            Sync now
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="bg-slate-800 text-white px-4 py-2 text-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <CloudOff className="w-4 h-4 shrink-0" />
        <span>You are offline. Showing cached data where available.</span>
      </div>
      {pendingCount > 0 && (
        <span className="text-xs text-slate-300">{pendingCount} pending</span>
      )}
    </div>
  );
}
