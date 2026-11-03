const STORAGE_KEY = "mcq-add-question-answer-type";

const VALID_TYPES = ["mcq", "written"] as const;
export type AnswerTypePreference = (typeof VALID_TYPES)[number];

function isBrowser() {
  return typeof window !== "undefined";
}

export function isValidAnswerType(value: string): value is AnswerTypePreference {
  return (VALID_TYPES as readonly string[]).includes(value);
}

export function getLastAnswerType(): AnswerTypePreference | null {
  if (!isBrowser()) return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY)?.trim();
    if (value && isValidAnswerType(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function setLastAnswerType(type: string): void {
  if (!isBrowser() || !isValidAnswerType(type)) return;
  try {
    localStorage.setItem(STORAGE_KEY, type);
  } catch {
    // ignore quota / private mode
  }
}
