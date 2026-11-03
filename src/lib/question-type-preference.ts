const STORAGE_KEY = "mcq-add-question-type";

const VALID_TYPES = ["general", "math", "mental_ability", "ict"] as const;
export type QuestionTypePreference = (typeof VALID_TYPES)[number];

function isBrowser() {
  return typeof window !== "undefined";
}

export function isValidQuestionType(value: string): value is QuestionTypePreference {
  return (VALID_TYPES as readonly string[]).includes(value);
}

export function getLastQuestionType(): QuestionTypePreference | null {
  if (!isBrowser()) return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY)?.trim();
    if (value && isValidQuestionType(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function setLastQuestionType(type: string): void {
  if (!isBrowser() || !isValidQuestionType(type)) return;
  try {
    localStorage.setItem(STORAGE_KEY, type);
  } catch {
    // ignore quota / private mode
  }
}
