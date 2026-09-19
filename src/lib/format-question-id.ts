const MAX_SHORT_QUESTION_ID = 999_999;
const QUESTION_ID_DISPLAY_LENGTH = 6;

function toNumericId(questionId: string | number): number | null {
  const n =
    typeof questionId === "number" ? questionId : Number(String(questionId).trim());
  return Number.isFinite(n) ? n : null;
}

function formatShortQuestionId(id: number): string {
  return String(Math.trunc(id)).padStart(QUESTION_ID_DISPLAY_LENGTH, "0");
}

/** Display 000001–999999 for new question IDs; legacy EAN IDs unchanged. */
export function formatQuestionId(questionId: string | number): string {
  const n = toNumericId(questionId);
  if (n === null) {
    return String(questionId);
  }
  if (n >= 1 && n <= MAX_SHORT_QUESTION_ID) {
    return formatShortQuestionId(n);
  }
  return String(n);
}

export function formatQuestionIdHash(questionId: string | number): string {
  return `#${formatQuestionId(questionId)}`;
}
