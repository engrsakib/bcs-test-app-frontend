import {
  formatSequentialId,
  formatSequentialIdHash,
} from "@/lib/format-sequential-id";

function toNumericId(questionId: string | number): number | null {
  const n =
    typeof questionId === "number" ? questionId : Number(String(questionId).trim());
  return Number.isFinite(n) ? n : null;
}

/** Display 0001–9999 for new question IDs; legacy EAN IDs unchanged. */
export function formatQuestionId(questionId: string | number): string {
  const n = toNumericId(questionId);
  if (n === null) {
    return String(questionId);
  }
  return formatSequentialId(n);
}

export function formatQuestionIdHash(questionId: string | number): string {
  const n = toNumericId(questionId);
  if (n === null) {
    return `#${questionId}`;
  }
  return formatSequentialIdHash(n);
}
