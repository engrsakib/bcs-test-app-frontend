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

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type NotificationsPage = {
  items: NotificationItem[];
  page: number;
  hasMore: boolean;
  total: number;
};

export const NOTIFICATIONS_PAGE_SIZE = 10;

function normalizeNotification(raw: Record<string, unknown>): NotificationItem {
  let createdAt: string | undefined;
  if (raw.createdAt) {
    if (typeof raw.createdAt === "string") {
      createdAt = raw.createdAt;
    } else {
      const parsed = new Date(raw.createdAt as string | number);
      if (!Number.isNaN(parsed.getTime())) {
        createdAt = parsed.toISOString();
      }
    }
  }

  return {
    _id: String(raw._id ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    module: String(raw.module ?? ""),
    time: String(raw.time ?? ""),
    isRead: Boolean(raw.isRead),
    createdAt,
    actorName: raw.actorName ? String(raw.actorName) : undefined,
    action: raw.action ? String(raw.action) : undefined,
    entityType: raw.entityType ? String(raw.entityType) : undefined,
    entityId: raw.entityId ? String(raw.entityId) : undefined,
  };
}

export function formatRelativeTime(
  isoOrDate: string | Date | undefined | null,
  referenceMs: number = Date.now()
): string {
  if (!isoOrDate) return "";

  const date =
    typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return "";

  const diffMs = Math.max(0, referenceMs - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;

  const remainingHours = diffHour % 24;
  const remainingMins = diffMin % 60;
  const dayPart = `${diffDay} day${diffDay === 1 ? "" : "s"}`;

  if (remainingHours === 0 && remainingMins === 0) {
    return `${dayPart} ago`;
  }

  const timeParts: string[] = [];
  if (remainingHours > 0) timeParts.push(`${remainingHours} hr`);
  if (remainingMins > 0) timeParts.push(`${remainingMins} min`);

  if (diffDay >= 30) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return `${dayPart} and ${timeParts.join(" ")} ago`;
}

export function getNotificationRelativeTime(
  item: NotificationItem,
  referenceMs: number = Date.now()
): string {
  if (item.createdAt) {
    const formatted = formatRelativeTime(item.createdAt, referenceMs);
    if (formatted) return formatted;
  }

  return item.time || "";
}

export function getNotificationTimestamp(item: NotificationItem): number {
  if (item.createdAt) {
    const parsed = Date.parse(item.createdAt);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return 0;
}

export function sortNotificationsNewestFirst(
  items: NotificationItem[]
): NotificationItem[] {
  return [...items].sort(
    (a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a)
  );
}

export function mergeNotificationsNewestFirst(
  ...groups: NotificationItem[][]
): NotificationItem[] {
  const map = new Map<string, NotificationItem>();

  for (const group of groups) {
    for (const item of group) {
      if (!item._id) continue;
      map.set(item._id, item);
    }
  }

  return sortNotificationsNewestFirst(Array.from(map.values()));
}

export async function fetchNotifications(
  page = 1,
  limit = NOTIFICATIONS_PAGE_SIZE
): Promise<NotificationsPage> {
  const params = new URLSearchParams({
    audience: "admin",
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`/api/proxy/notifications?${params.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications (${res.status})`);
  }

  const json = (await res.json()) as ApiResponse<{
    data?: Record<string, unknown>[];
    meta?: {
      page?: number;
      hasMore?: boolean;
      total?: number;
    };
  }>;

  const payload = json.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};

  return {
    items: rows.map(normalizeNotification),
    page: meta.page ?? page,
    hasMore: Boolean(meta.hasMore),
    total: meta.total ?? rows.length,
  };
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  const res = await fetch(`/api/proxy/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to mark notification as read (${res.status})`);
  }

  const json = (await res.json()) as ApiResponse<Record<string, unknown>>;
  return normalizeNotification(json.data ?? {});
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
      const data = JSON.parse(event.data) as Record<string, unknown>;
      handlers.onNotification(normalizeNotification(data));
    } catch {
      // ignore malformed payloads
    }
  });

  source.onerror = (error) => {
    handlers.onError?.(error);
  };

  return source;
}
