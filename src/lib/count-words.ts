export const MAX_CAMPAIGN_BODY_WORDS = 200;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function isBodyWithinWordLimit(
  body: string,
  maxWords = MAX_CAMPAIGN_BODY_WORDS
): boolean {
  return countWords(body) <= maxWords;
}
