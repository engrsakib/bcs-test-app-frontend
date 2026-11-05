const BENGALI_DIGIT = /[\u09E6-\u09EF]/;
const BENGALI_LETTER = /[\u0980-\u09FF]/;

export function readBracedGroup(value: string, contentStart: number): number {
  let depth = 1;
  let j = contentStart;
  while (j < value.length && depth > 0) {
    if (value[j] === "{") depth += 1;
    else if (value[j] === "}") depth -= 1;
    j += 1;
  }
  return j;
}

export function foldMultilineTextBlocks(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const contentStart = i + 6;
      const end = readBracedGroup(value, contentStart);
      const inner = value
        .slice(contentStart, end - 1)
        .replace(/\s+/g, " ")
        .trim();
      out += `\\text{${inner}}`;
      i = end;
      continue;
    }
    out += value[i];
    i += 1;
  }
  return out;
}

/** KaTeX math mode expects ASCII digits; keep Bengali numerals inside `\\text{}`. */
export function convertBengaliDigitsOutsideTextBlocks(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const contentStart = i + 6;
      const end = readBracedGroup(value, contentStart);
      out += value.slice(i, end);
      i = end;
      continue;
    }
    const ch = value[i];
    if (BENGALI_DIGIT.test(ch)) {
      out += String(ch.charCodeAt(0) - 0x09e6);
    } else {
      out += ch;
    }
    i += 1;
  }
  return out;
}

export function normalizeApiLatexEscaping(value: string): string {
  return value
    .replace(/&#92;/g, "\\")
    .replace(/\\\\+(frac|div|sqrt|text|cdot|times|pm|left|right)\b/g, "\\$1");
}

/** `\div`, `\\div`, bare `div`, spaced `\ div`, unicode ÷ → KaTeX `\div`. */
export function normalizeDivCommand(value: string): string {
  let s = normalizeApiLatexEscaping(value);
  s = s.replace(/÷/g, "\\div ");
  s = s.replace(/\\\s+div\b/gi, "\\div");
  s = s.replace(/\\{2,}div\b/gi, "\\div");
  s = s.replace(/(?<!\\)div(?![a-zA-Z])/gi, "\\div");
  s = s.replace(/\s*\\div\s*/g, " \\div ");
  return s;
}

export function repairBareLatexCommands(value: string): string {
  return value
    .replace(/(?<!\\)frac\{([^}]*)\}\{([^}]*)\}/g, "\\frac{$1}{$2}")
    .replace(/(?<!\\)sqrt\{([^}]*)\}/g, "\\sqrt{$1}")
    .replace(/(?<!\\)text\{([^}]*)\}/g, "\\text{$1}");
}

export function repairDivisionAndFractionTypos(value: string): string {
  let s = normalizeDivCommand(value);
  s = s.replace(/\\d\{([^}]*)\}\{([^}]*)\}/g, "\\frac{$1}{$2}");
  s = s.replace(/\\d\s*(?=\\frac)/g, "");
  s = s.replace(/\\d(?![a-zA-Z{])/g, "\\div ");
  s = s.replace(/\^\{\s*\}/g, "");
  s = s.replace(/(\})\s*(\d+)\s*(\\div\b)/g, "$1^$2 $3");
  s = s.replace(/(\\frac\{[^}]*\}\{[^}]*\})\s*(\d+)\s*(\\div\b)/g, "$1^$2 $3");
  return s.replace(/\s{2,}/g, " ").trim();
}

/** `\\frac{..}{..}^2 \\div a a+b` → second side as `\\frac{a+b}{a}`. */
export function repairPartialFractionAfterDiv(value: string): string {
  if (BENGALI_LETTER.test(value)) return value;

  const cleaned = stripMathInvisibleChars(value).trim();
  const match = cleaned.match(
    /^([\s\S]*\\frac\{[^}]*\}\{[^}]*\}(?:\^{[^}]*}|\^\d+)?)\s*\\div\s+([^\s]+)\s+([^\s]+)\s*$/
  );
  if (!match) return value;

  const [, head, den2, num2] = match;
  return `${head.trim()} \\div \\frac{${num2}}{${den2}}`;
}

export function repairImplicitFractionEquation(value: string): string {
  if (BENGALI_LETTER.test(value)) return value;

  const cleaned = stripMathInvisibleChars(normalizeDivCommand(value)).trim();

  if (/\\frac\s*\{/.test(cleaned)) {
    return repairPartialFractionAfterDiv(cleaned);
  }

  const match = cleaned.match(
    /^([^\s]+)\s+([^\s]+)\s*(\d+)?\s*\\div\s*([^\s]+)\s+([^\s]+)\s*$/i
  );
  if (!match) return value;

  const [, den1, num1, exponent, den2, num2] = match;
  const expPart = exponent ? `^${exponent}` : "";
  return `\\frac{${num1}}{${den1}}${expPart} \\div \\frac{${num2}}{${den2}}`;
}

export function normalizeMathPlaceholders(value: string): string {
  return value
    .replace(/\\frac\{\?\}\{/g, "\\frac{\\text{?}}{")
    .replace(/\\frac\{\?\}/g, "\\frac{\\text{?}}");
}

/** CMS spaced superscripts (`x ^ { 2 }`) → `x^{2}` outside `\\text{}`. */
export function normalizeSpacedMathSuperscripts(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const end = readBracedGroup(value, i + 6);
      out += value.slice(i, end);
      i = end;
      continue;
    }

    const rest = value.slice(i);
    const braced = rest.match(/^([a-zA-Z0-9)\}])\s*\^\s*\{\s*([^}]+?)\s*\}/);
    if (braced) {
      out += `${braced[1]}^{${braced[2].trim()}}`;
      i += braced[0].length;
      continue;
    }

    const simple = rest.match(/^([a-zA-Z0-9)\}])\s*\^\s*([0-9a-zA-Z])/);
    if (simple) {
      out += `${simple[1]}^${simple[2]}`;
      i += simple[0].length;
      continue;
    }

    out += value[i];
    i += 1;
  }
  return out;
}

/** Prose-safe: remove ZWSP/BOM only (preserve Bengali ZWNJ U+200C). */
export function stripInvisibleChars(value: string): string {
  return value.replace(/[\u200B\uFEFF]/g, "");
}

/** Math segments: also strip ZWJ (U+200D) that breaks KaTeX tokenization. */
export function stripMathInvisibleChars(value: string): string {
  return value.replace(/[\u200B\u200D\uFEFF]/g, "");
}

const UNICODE_SUP_DIGIT: Record<number, string> = {
  0x2070: "0",
  0x00B9: "1",
  0x00B2: "2",
  0x00B3: "3",
  0x2074: "4",
  0x2075: "5",
  0x2076: "6",
  0x2077: "7",
  0x2078: "8",
  0x2079: "9",
};

function mapSuperscriptChar(code: number): string | null {
  if (code in UNICODE_SUP_DIGIT) return UNICODE_SUP_DIGIT[code];
  if (code >= 0x2070 && code <= 0x2079) {
    return code === 0x2070 ? "0" : String(code - 0x2070);
  }
  if (code === 0x207a) return "+";
  if (code === 0x207b) return "-";
  if (code === 0x207e) return "=";
  return null;
}

function mapSubscriptChar(code: number): string | null {
  if (code >= 0x2080 && code <= 0x2089) {
    return String(code - 0x2080);
  }
  if (code === 0x208a) return "+";
  if (code === 0x208b) return "-";
  if (code === 0x208e) return "=";
  return null;
}

/** CMS unicode scripts (x², a₁) → LaTeX-style `^` / `_` (outside `\\text{}`). */
export function normalizeUnicodeMathScripts(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const end = readBracedGroup(value, i + 6);
      out += value.slice(i, end);
      i = end;
      continue;
    }

    const ch = value[i];
    const code = ch.charCodeAt(0);
    const prev = out.length > 0 ? out[out.length - 1] : "";
    const prevIsBase = /[a-zA-Z0-9)\}]/.test(prev);

    if (prevIsBase) {
      const sup = mapSuperscriptChar(code);
      if (sup !== null) {
        out += `^${sup.length > 1 ? `{${sup}}` : sup}`;
        i += 1;
        continue;
      }
      const sub = mapSubscriptChar(code);
      if (sub !== null) {
        out += `_${sub.length > 1 ? `{${sub}}` : sub}`;
        i += 1;
        continue;
      }
    }

    if (ch === "\u2212" || ch === "\u2013" || ch === "\u2014") {
      out += "-";
      i += 1;
      continue;
    }

    out += ch;
    i += 1;
  }
  return out;
}

export function hasUnicodeMathScripts(value: string): boolean {
  return /[\u00B2\u00B3\u00B9\u2070-\u207F\u2080-\u209F]/.test(value);
}

export function hasBengaliLetters(value: string): boolean {
  return BENGALI_LETTER.test(value);
}

/** True when Bengali letters appear outside KaTeX `\\text{…}` blocks. */
export function hasBengaliOutsideTextBlocks(value: string): boolean {
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      i = readBracedGroup(value, i + 6);
      continue;
    }
    const code = value.charCodeAt(i);
    if (code >= 0x0980 && code <= 0x09ff && (code < 0x09e6 || code > 0x09ef)) {
      return true;
    }
    i += 1;
  }
  return false;
}

function repairMalformedScriptMarkersOutsideText(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value.startsWith("\\text{", i)) {
      const end = readBracedGroup(value, i + 6);
      out += value.slice(i, end);
      i = end;
      continue;
    }

    const rest = value.slice(i);
    const asciiSup = rest.match(
      /^([a-zA-Z])\s+(\d)(?=\s*[\-+−=^,)}\]]|\s*$|\s*[\-+−])/
    );
    if (asciiSup) {
      out += `${asciiSup[1]}^${asciiSup[2]}`;
      i += asciiSup[0].length;
      continue;
    }

    const emptySub = rest.match(/^_\s*\{\s*\}\s*/);
    if (emptySub) {
      i += emptySub[0].length;
      continue;
    }

    out += value[i];
    i += 1;
  }
  return out;
}

/** CMS/Word artifacts: `x 2`, empty `_{}`, spaced scripts (math segments only). */
export function repairMalformedScriptMarkers(value: string): string {
  return repairMalformedScriptMarkersOutsideText(value);
}

function shouldUnwrapEquationTextBlock(inner: string): boolean {
  if (BENGALI_LETTER.test(inner)) return false;
  const n = normalizeDivCommand(inner).trim();
  if (!/\\div\b/.test(n)) return false;
  if (/\\frac\s*\{/.test(n)) return true;
  return /^[^\s]+\s+[^\s]+\s*(\d+)?\s*\\div\s*[^\s]+\s+[^\s]+\s*$/i.test(n);
}

function isMathIdentifierFragment(part: string): boolean {
  if (/\\frac|\\sqrt|\^/.test(part)) return true;
  if (/^\d+$/.test(part)) return true;
  return /^[a-zA-Z][a-zA-Z0-9]*(\+[a-zA-Z0-9]+)*$/.test(part);
}

function wrapTextOrLeaveMath(part: string): string {
  const p = part.trim();
  if (!p) return "";
  if (BENGALI_LETTER.test(p)) return `\\text{${p}}`;
  if (/\\frac|\\sqrt|\\text\{/.test(p)) {
    return repairTextEmbeddedMathOperatorsOnce(p);
  }
  if (
    isMathIdentifierFragment(p) &&
    (/[+0-9]|\\frac/.test(p) || p.length <= 2)
  ) {
    return p;
  }
  return `\\text{${p}}`;
}

function splitTextBlockOnDiv(inner: string): string {
  const normalized = normalizeDivCommand(inner).trim();
  if (/^\\div$/i.test(normalized)) return "\\div";
  const parts = normalized
    .split(/\s*\\div\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) return `\\text{${inner}}`;
  return parts.map(wrapTextOrLeaveMath).filter(Boolean).join(" \\div ");
}

/** KaTeX treats `\\div` inside `\\text{}` as an error (red literal). Promote to math mode. */
export function repairTextEmbeddedMathOperatorsOnce(value: string): string {
  let s = value.trim();
  const full = s.match(/^\\text\{([\s\S]*)\}$/);
  if (full && shouldUnwrapEquationTextBlock(full[1])) {
    return repairTextEmbeddedMathOperatorsOnce(full[1]);
  }

  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("\\text{", i)) {
      const contentStart = i + 6;
      const end = readBracedGroup(s, contentStart);
      const inner = s.slice(contentStart, end - 1);
      if (/\\div\b/i.test(normalizeDivCommand(inner))) {
        out += splitTextBlockOnDiv(inner);
      } else {
        out += `\\text{${inner}}`;
      }
      i = end;
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out;
}

export function repairTextEmbeddedMathOperators(value: string): string {
  let s = value.trim();
  for (let pass = 0; pass < 6; pass += 1) {
    const next = repairTextEmbeddedMathOperatorsOnce(s);
    if (next === s) break;
    s = next;
  }
  return s;
}
