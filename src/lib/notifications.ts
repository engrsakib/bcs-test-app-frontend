import { ENV, apiUrl } from "@/config/env";

export type NotificationItem = {
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
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function getAuthHeaders(): HeadersInit {
  const token = getCookie("access_token");
  return {
    Authorization: token || "",
    "Content-Type": "application/json",
  };
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(apiUrl("/notifications?audience=admin"), {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const json = (await res.json()) as ApiResponse<NotificationItem[]>;
  return json.data ?? [];
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  const res = await fetch(apiUrl(`/notifications/${id}/read`), {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  const json = (await res.json()) as ApiResponse<NotificationItem>;
  return json.data;
}

export type NotificationStreamHandlers = {
  onNotification: (notification: NotificationItem) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
};

export function connectNotificationStream(
  handlers: NotificationStreamHandlers
): EventSource {
  const source = new EventSource("/api/notifications/stream", {
    withCredentials: true,
  });

  source.addEventListener("connected", () => {
    handlers.onConnected?.();
  });

  source.addEventListener("notification", (event) => {
    try {
      const data = JSON.parse(event.data) as NotificationItem;
      handlers.onNotification(data);
    } catch {
      // ignore malformed payloads
    }
  });

  source.onerror = (error) => {
    handlers.onError?.(error);
  };

  return source;
}

export { ENV };
