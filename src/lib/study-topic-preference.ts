const STORAGE_KEY = "mcq-add-question-study-topic-id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getLastStudyTopicId(): string | null {
  if (!isBrowser()) return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value?.trim() ? value : null;
  } catch {
    return null;
  }
}

export function setLastStudyTopicId(id: string): void {
  if (!isBrowser() || !id?.trim()) return;
  try {
    localStorage.setItem(STORAGE_KEY, id.trim());
  } catch {
    // ignore quota / private mode
  }
}
