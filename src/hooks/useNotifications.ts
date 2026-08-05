"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  connectNotificationStream,
  fetchNotifications,
  markNotificationRead,
  NotificationItem,
} from "@/lib/notifications";

const MAX_RECONNECT_DELAY_MS = 30000;
const BASE_RECONNECT_DELAY_MS = 1000;
const POLLING_FALLBACK_MS = 60000;

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reconnectAttempts = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = useCallback(async () => {
    if (!enabled) return;

    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );

    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      void loadNotifications();
    }
  }, [loadNotifications]);

  const prependNotification = useCallback((notification: NotificationItem) => {
    setNotifications((prev) => {
      const exists = prev.some((item) => item._id === notification._id);
      if (exists) return prev;
      return [notification, ...prev];
    });
  }, []);

  const startPollingFallback = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      void loadNotifications();
    }, POLLING_FALLBACK_MS);
  }, [loadNotifications]);

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

        if (reconnectAttempts.current >= 2) {
          startPollingFallback();
        }

        const delay = Math.min(
          BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts.current,
          MAX_RECONNECT_DELAY_MS
        );
        reconnectAttempts.current += 1;

        window.setTimeout(() => {
          connectStream();
        }, delay);
      },
    });

    eventSourceRef.current = source;
  }, [enabled, prependNotification, startPollingFallback]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    void loadNotifications();
    connectStream();

    return () => {
      eventSourceRef.current?.close();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [enabled, loadNotifications, connectStream]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    refetch: loadNotifications,
  };
}
