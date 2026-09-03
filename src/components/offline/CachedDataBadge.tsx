"use client";

import { getNotificationRelativeTime } from "@/lib/notifications";

type CachedDataBadgeProps = {
  fromCache: boolean;
  fetchedAt?: number;
  isStale?: boolean;
};

export function CachedDataBadge({
  fromCache,
  fetchedAt,
  isStale,
}: CachedDataBadgeProps) {
  if (!fromCache || !fetchedAt) return null;

  const ageLabel = getNotificationRelativeTime({
    _id: "cache-badge",
    title: "",
    description: "",
    module: "",
    time: "",
    isRead: true,
    createdAt: new Date(fetchedAt).toISOString(),
  });

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isStale
          ? "bg-amber-50 text-amber-800 border border-amber-200"
          : "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      Cached · updated {ageLabel}
    </span>
  );
}

export function useOfflineActionsDisabled(): boolean {
  if (typeof navigator === "undefined") return false;
  return !navigator.onLine;
}
