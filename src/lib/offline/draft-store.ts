import { getOfflineDb, isOfflineStorageAvailable, type DraftEntry } from "./db";

export async function saveDraft(
  draftId: string,
  type: string,
  payload: unknown
): Promise<void> {
  if (!isOfflineStorageAvailable()) return;

  await getOfflineDb().drafts.put({
    draftId,
    type,
    payload,
    updatedAt: Date.now(),
  });
}

export async function loadDraft<T>(draftId: string): Promise<T | null> {
  if (!isOfflineStorageAvailable()) return null;

  const entry = await getOfflineDb().drafts.get(draftId);
  return (entry?.payload as T) ?? null;
}

export async function loadDraftByType<T>(type: string): Promise<T | null> {
  if (!isOfflineStorageAvailable()) return null;

  const entry = await getOfflineDb().drafts
    .where("type")
    .equals(type)
    .reverse()
    .sortBy("updatedAt");

  const latest = entry.at(-1);
  return (latest?.payload as T) ?? null;
}

export async function deleteDraft(draftId: string): Promise<void> {
  if (!isOfflineStorageAvailable()) return;
  await getOfflineDb().drafts.delete(draftId);
}

export async function listDrafts(type?: string): Promise<DraftEntry[]> {
  if (!isOfflineStorageAvailable()) return [];

  if (type) {
    return getOfflineDb().drafts.where("type").equals(type).toArray();
  }

  return getOfflineDb().drafts.toArray();
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}
