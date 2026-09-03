"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  connectNotificationStream,
  fetchNotifications,
  markNotificationRead,
  mergeNotificationsNewestFirst,
  NotificationItem,
  NOTIFICATIONS_PAGE_SIZE,
} from "@/lib/notifications";
import {
  loadCachedNotifications,
  persistNotifications,
  updateCachedNotificationRead,
} from "@/lib/offline/notification-store";
import { enqueueSyncItem } from "@/lib/offline/sync-queue";
import { OFFLINE_ENABLED } from "@/config/offline";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const MAX_RECONNECT_DELAY_MS = 30000;
const BASE_RECONNECT_DELAY_MS = 1000;
const POLLING_INTERVAL_MS = 15000;

export function useNotifications(enabled = true) {
  const online = useOnlineStatus();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const reconnectAttempts = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const pageRef = useRef(1);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const persistList = useCallback(async (items: NotificationItem[]) => {
    if (!OFFLINE_ENABLED) return;
    await persistNotifications(items);
  }, []);

  const loadInitial = useCallback(async () => {
    if (!enabled) return;

    try {
      if (!online) {
        const cached = await loadCachedNotifications();
        setNotifications(cached);
        setFromCache(true);
        setHasMore(false);
        setError(cached.length ? null : "Could not load notifications");
        return;
      }

      const result = await fetchNotifications(1, NOTIFICATIONS_PAGE_SIZE);
      setNotifications(result.items);
      setPage(1);
      pageRef.current = 1;
      setHasMore(result.hasMore);
      setFromCache(false);
      setError(null);
      await persistList(result.items);
    } catch (err) {
      const cached = await loadCachedNotifications();
      if (cached.length) {
        setNotifications(cached);
        setFromCache(true);
        setError(null);
      } else {
        const message =
          err instanceof Error ? err.message : "Failed to load notifications";
        setError(message);
        console.error("Failed to load notifications:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled, online, persistList]);

  const refreshLatest = useCallback(async () => {
    if (!enabled || !online) return;

    try {
      const result = await fetchNotifications(1, NOTIFICATIONS_PAGE_SIZE);
      setNotifications((prev) => {
        const merged = mergeNotificationsNewestFirst(result.items, prev);
        void persistList(merged);
        return merged;
      });
      setHasMore(result.hasMore || pageRef.current > 1);
      setFromCache(false);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh notifications:", err);
    }
  }, [enabled, online, persistList]);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoadingMore || !hasMore || !online) return;

    setIsLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const result = await fetchNotifications(nextPage, NOTIFICATIONS_PAGE_SIZE);

      setNotifications((prev) => {
        const merged = mergeNotificationsNewestFirst(prev, result.items);
        void persistList(merged);
        return merged;
      });
      setPage(nextPage);
      pageRef.current = nextPage;
      setHasMore(result.hasMore);
      setFromCache(false);
      setError(null);
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [enabled, hasMore, isLoadingMore, online, persistList]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );

    await updateCachedNotificationRead(id);

    if (!online) {
      try {
        await enqueueSyncItem({
          entity: "notification",
          action: "PATCH",
          url: `/api/proxy/notifications/${id}/read`,
        });
      } catch {
        // Best effort queue.
      }
      return;
    }

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      void loadInitial();
    }
  }, [loadInitial, online]);

  const prependNotification = useCallback((notification: NotificationItem) => {
    if (!notification._id) return;

    setNotifications((prev) => {
      const merged = mergeNotificationsNewestFirst([notification], prev);
      void persistList(merged);
      return merged;
    });
  }, [persistList]);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;

    pollingRef.current = window.setInterval(() => {
      void refreshLatest();
    }, POLLING_INTERVAL_MS);
  }, [refreshLatest]);

  const connectStream = useCallback(() => {
    if (!enabled || typeof window === "undefined" || !online) return;

    eventSourceRef.current?.close();

    const source = connectNotificationStream({
      onNotification: prependNotification,
      onConnected: () => {
        reconnectAttempts.current = 0;
      },
      onError: () => {
        source.close();
        eventSourceRef.current = null;

        const delay = Math.min(
          BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts.current,
          MAX_RECONNECT_DELAY_MS
        );
        reconnectAttempts.current += 1;

        if (reconnectTimerRef.current) {
          window.clearTimeout(reconnectTimerRef.current);
        }

        reconnectTimerRef.current = window.setTimeout(() => {
          connectStream();
        }, delay);
      },
    });

    eventSourceRef.current = source;
  }, [enabled, online, prependNotification]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    void loadInitial();
    connectStream();
    startPolling();

    const handleFocus = () => {
      void refreshLatest();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      eventSourceRef.current?.close();
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [enabled, loadInitial, refreshLatest, connectStream, startPolling]);

  useEffect(() => {
    if (online) {
      connectStream();
      void refreshLatest();
    } else {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    }
  }, [online, connectStream, refreshLatest]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    error,
    fromCache,
    markAsRead,
    loadMore,
    refetch: loadInitial,
  };
}
