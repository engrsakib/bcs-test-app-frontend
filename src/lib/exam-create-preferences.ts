import {
  DEFAULT_EXAM_SUBJECT,
  EXAM_SUBJECTS,
  type ExamSubject,
} from "@/lib/exam-subjects";

const SUBJECT_KEY = "mcq-create-exam-subject";
const NEGATIVE_MARK_KEY = "mcq-create-exam-negative-mark";

const VALID_NEGATIVE_MARKS = [0.25, 0.5] as const;

function isBrowser() {
  return typeof window !== "undefined";
}

export function isValidExamSubject(value: string): value is ExamSubject {
  return (EXAM_SUBJECTS as readonly string[]).includes(value);
}

export function getLastExamSubject(): ExamSubject | null {
  if (!isBrowser()) return null;
  try {
    const value = localStorage.getItem(SUBJECT_KEY)?.trim();
    if (value && isValidExamSubject(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function setLastExamSubject(subject: string): void {
  if (!isBrowser() || !isValidExamSubject(subject)) return;
  try {
    localStorage.setItem(SUBJECT_KEY, subject);
  } catch {
    // ignore
  }
}

export function getLastExamNegativeMark(): number | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(NEGATIVE_MARK_KEY);
    if (raw == null) return null;
    const n = Number(raw);
    if (VALID_NEGATIVE_MARKS.includes(n as (typeof VALID_NEGATIVE_MARKS)[number])) {
      return n;
    }
    return null;
  } catch {
    return null;
  }
}

export function setLastExamNegativeMark(value: number): void {
  if (!isBrowser()) return;
  if (!VALID_NEGATIVE_MARKS.includes(value as (typeof VALID_NEGATIVE_MARKS)[number])) {
    return;
  }
  try {
    localStorage.setItem(NEGATIVE_MARK_KEY, String(value));
  } catch {
    // ignore
  }
}

export function getDefaultCreateExamSubject(): ExamSubject {
  return getLastExamSubject() ?? DEFAULT_EXAM_SUBJECT;
}

export function getDefaultCreateExamNegativeMark(): number {
  return getLastExamNegativeMark() ?? 0.25;
}
