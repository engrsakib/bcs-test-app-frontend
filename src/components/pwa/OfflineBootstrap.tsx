"use client";

import { useEffect } from "react";
import { offlineSyncManager } from "@/lib/offline/sync-manager";
import { OFFLINE_ENABLED } from "@/config/offline";

export function OfflineBootstrap() {
  useEffect(() => {
    if (!OFFLINE_ENABLED) return;
    offlineSyncManager.start();
  }, []);

  return null;
}
