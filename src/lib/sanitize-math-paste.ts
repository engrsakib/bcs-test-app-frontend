import { ConvertToUnicode } from "bijoy-unicode-converter";

/** True when pasted text looks like ANSI Bijoy (high bytes, no Bengali Unicode). */
export function isLikelyBijoyAnsi(text: string): boolean {
  if (/[\u0980-\u09FF]/.test(text)) {
    return false;
  }
  return /[\u0080-\u00FF]/.test(text);
}

/** Converts ANSI Bijoy paste to Unicode when possible; otherwise returns input unchanged. */
export function sanitizePastedTextForMathField(text: string): string {
  if (!text || !isLikelyBijoyAnsi(text)) {
    return text;
  }

  try {
    return ConvertToUnicode(text);
  } catch {
    return text;
  }
}
