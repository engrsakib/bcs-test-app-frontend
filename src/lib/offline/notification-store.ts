import { getNotificationRelativeTime, type NotificationItem } from "@/lib/notifications";
import { NOTIFICATION_CACHE_LIMIT } from "@/config/offline";
import { getOfflineDb, isOfflineStorageAvailable, type StoredNotification } from "./db";

function toStored(item: NotificationItem): StoredNotification {
  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    module: item.module,
    time: item.time,
    isRead: item.isRead,
    createdAt: item.createdAt,
    actorName: item.actorName,
    action: item.action,
    entityType: item.entityType,
    entityId: item.entityId,
    cachedAt: Date.now(),
  };
}

function fromStored(item: StoredNotification): NotificationItem {
  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    module: item.module,
    time: item.time,
    isRead: item.isRead,
    createdAt: item.createdAt,
    actorName: item.actorName,
    action: item.action,
    entityType: item.entityType,
    entityId: item.entityId,
  };
}

export async function persistNotifications(
  items: NotificationItem[]
): Promise<void> {
  if (!isOfflineStorageAvailable() || !items.length) return;

  const db = getOfflineDb();
  await db.notifications.bulkPut(items.map(toStored));

  const all = await db.notifications.orderBy("cachedAt").reverse().toArray();
  if (all.length > NOTIFICATION_CACHE_LIMIT) {
    const stale = all.slice(NOTIFICATION_CACHE_LIMIT);
    await db.notifications.bulkDelete(stale.map((item) => item._id));
  }
}

export async function loadCachedNotifications(): Promise<NotificationItem[]> {
  if (!isOfflineStorageAvailable()) return [];

  const items = await getOfflineDb()
    .notifications
    .orderBy("cachedAt")
    .reverse()
    .limit(NOTIFICATION_CACHE_LIMIT)
    .toArray();

  return items.map(fromStored);
}

export async function updateCachedNotificationRead(id: string): Promise<void> {
  if (!isOfflineStorageAvailable()) return;
  const item = await getOfflineDb().notifications.get(id);
  if (!item) return;

  await getOfflineDb().notifications.put({
    ...item,
    isRead: true,
    time: getNotificationRelativeTime(fromStored(item)),
  });
}
