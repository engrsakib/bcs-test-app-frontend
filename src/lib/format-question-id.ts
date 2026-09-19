import {
  formatSequentialId,
  formatSequentialIdHash,
} from "@/lib/format-sequential-id";

/** Display 0001–9999 for new question IDs; legacy EAN IDs unchanged. */
export function formatQuestionId(questionId: number): string {
  return formatSequentialId(questionId);
}

export function formatQuestionIdHash(questionId: number): string {
  return formatSequentialIdHash(questionId);
}
