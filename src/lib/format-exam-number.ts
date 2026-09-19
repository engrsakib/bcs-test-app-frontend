import {
  formatSequentialId,
  formatSequentialIdHash,
} from "@/lib/format-sequential-id";

/** Display 0001–9999 for sequential IDs; legacy long IDs unchanged. */
export function formatExamNumber(examNumber: number): string {
  return formatSequentialId(examNumber);
}

export function formatExamNumberHash(examNumber: number): string {
  return formatSequentialIdHash(examNumber);
}
