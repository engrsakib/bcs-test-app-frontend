const MAX_SHORT_SEQUENTIAL_ID = 9999;

/** Display 0001–9999 for sequential IDs; legacy long IDs unchanged. */
export function formatSequentialId(id: number): string {
  if (
    Number.isFinite(id) &&
    id >= 1 &&
    id <= MAX_SHORT_SEQUENTIAL_ID
  ) {
    return String(Math.trunc(id)).padStart(4, "0");
  }
  return String(id);
}

export function formatSequentialIdHash(id: number): string {
  return `#${formatSequentialId(id)}`;
}
