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

const MAX_RECONNECT_DELAY_MS = 30000;
const BASE_RECONNECT_DELAY_MS = 1000;
const POLLING_INTERVAL_MS = 15000;

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const reconnectAttempts = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const pageRef = useRef(1);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadInitial = useCallback(async () => {
    if (!enabled) return;

    try {
      const result = await fetchNotifications(1, NOTIFICATIONS_PAGE_SIZE);
      setNotifications(result.items);
      setPage(1);
      pageRef.current = 1;
      setHasMore(result.hasMore);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(message);
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const refreshLatest = useCallback(async () => {
    if (!enabled) return;

    try {
      const result = await fetchNotifications(1, NOTIFICATIONS_PAGE_SIZE);
      setNotifications((prev) =>
        mergeNotificationsNewestFirst(result.items, prev)
      );
      setHasMore(result.hasMore || pageRef.current > 1);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh notifications:", err);
    }
  }, [enabled]);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const result = await fetchNotifications(nextPage, NOTIFICATIONS_PAGE_SIZE);

      setNotifications((prev) =>
        mergeNotificationsNewestFirst(prev, result.items)
      );
      setPage(nextPage);
      pageRef.current = nextPage;
      setHasMore(result.hasMore);
      setError(null);
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [enabled, hasMore, isLoadingMore]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      void loadInitial();
    }
  }, [loadInitial]);

  const prependNotification = useCallback((notification: NotificationItem) => {
    if (!notification._id) return;

    setNotifications((prev) =>
      mergeNotificationsNewestFirst([notification], prev)
    );
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;

    pollingRef.current = window.setInterval(() => {
      void refreshLatest();
    }, POLLING_INTERVAL_MS);
  }, [refreshLatest]);

  const connectStream = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

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
  }, [enabled, prependNotification]);

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

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    error,
    markAsRead,
    loadMore,
    refetch: loadInitial,
  };
}
