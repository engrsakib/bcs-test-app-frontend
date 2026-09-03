import type { StudyTopicTypeItem } from "./study-topic-type-api";
import {
  createStudyTopicType,
  fetchStudyTopicTypes,
} from "./study-topic-type-api";
import { getOfflineDb, isOfflineStorageAvailable } from "./offline/db";

export type PendingStudyTopicType = {
  id: string;
  label: string;
  value: string;
  createdAt: string;
};

const STORAGE_KEY = "pending-study-topic-types";
const SYNC_ENTITY = "study-topic-type";

function isBrowser() {
  return typeof window !== "undefined";
}

async function readIndexedPending(): Promise<PendingStudyTopicType[]> {
  if (!isOfflineStorageAvailable()) return [];

  const entry = await getOfflineDb().drafts.get("pending-study-topic-types");
  return (entry?.payload as PendingStudyTopicType[]) ?? [];
}

async function writeIndexedPending(items: PendingStudyTopicType[]): Promise<void> {
  if (!isOfflineStorageAvailable()) return;

  await getOfflineDb().drafts.put({
    draftId: "pending-study-topic-types",
    type: SYNC_ENTITY,
    payload: items,
    updatedAt: Date.now(),
  });
}

export function slugifyStudyTopicTypeLabel(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  if (slug) return slug;

  return `type_${Date.now()}`;
}

export function loadPendingStudyTopicTypes(): PendingStudyTopicType[] {
  if (!isBrowser()) return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as PendingStudyTopicType[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePendingStudyTopicTypes(items: PendingStudyTopicType[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  void writeIndexedPending(items);
}

export function addPendingStudyTopicType(
  label: string,
  value?: string
): PendingStudyTopicType {
  const pending: PendingStudyTopicType = {
    id: crypto.randomUUID(),
    label: label.trim(),
    value: value?.trim().toLowerCase() || slugifyStudyTopicTypeLabel(label),
    createdAt: new Date().toISOString(),
  };

  const existing = loadPendingStudyTopicTypes();
  savePendingStudyTopicTypes([...existing, pending]);

  return pending;
}

export function removePendingStudyTopicType(id: string): void {
  const remaining = loadPendingStudyTopicTypes().filter((item) => item.id !== id);
  savePendingStudyTopicTypes(remaining);
}

export function removePendingStudyTopicTypeByValue(value: string): void {
  const remaining = loadPendingStudyTopicTypes().filter(
    (item) => item.value !== value
  );
  savePendingStudyTopicTypes(remaining);
}

export function getPendingStudyTopicTypeId(value: string): string | undefined {
  return loadPendingStudyTopicTypes().find((item) => item.value === value)?.id;
}

export function mergeStudyTopicTypeOptions(
  remote: StudyTopicTypeItem[],
  pending: PendingStudyTopicType[] = loadPendingStudyTopicTypes()
): StudyTopicTypeItem[] {
  const merged = new Map<string, StudyTopicTypeItem>();

  for (const item of remote) {
    merged.set(item.value, item);
  }

  for (const item of pending) {
    if (!merged.has(item.value)) {
      merged.set(item.value, {
        value: item.value,
        label: item.label,
        isDefault: false,
        isPending: true,
        pendingId: item.id,
      });
    }
  }

  return Array.from(merged.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export async function hydratePendingStudyTopicTypesFromIndexedDb(): Promise<void> {
  const indexed = await readIndexedPending();
  if (indexed.length) {
    savePendingStudyTopicTypes(indexed);
    return;
  }

  const legacy = loadPendingStudyTopicTypes();
  if (legacy.length) {
    await writeIndexedPending(legacy);
  }
}

export async function syncPendingStudyTopicTypesToServer(): Promise<void> {
  await hydratePendingStudyTopicTypesFromIndexedDb();

  const pending = loadPendingStudyTopicTypes();
  if (!pending.length) return;

  try {
    const remote = await fetchStudyTopicTypes();
    const remoteValues = new Set(remote.map((item) => item.value));

    for (const item of pending) {
      if (remoteValues.has(item.value)) {
        removePendingStudyTopicType(item.id);
        continue;
      }

      try {
        await createStudyTopicType({ label: item.label, value: item.value });
        removePendingStudyTopicType(item.id);
      } catch {
        // Keep pending until server accepts it.
      }
    }
  } catch {
    // Server still unavailable.
  }
}

if (isBrowser()) {
  void hydratePendingStudyTopicTypesFromIndexedDb();
}
