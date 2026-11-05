import {
  convertBengaliDigitsOutsideTextBlocks,
  foldMultilineTextBlocks,
  hasBengaliLetters,
  normalizeDivCommand,
  normalizeMathPlaceholders,
  readBracedGroup,
  repairBareLatexCommands,
  repairDivisionAndFractionTypos,
  repairImplicitFractionEquation,
  repairPartialFractionAfterDiv,
  repairTextEmbeddedMathOperators,
  normalizeUnicodeMathScripts,
  normalizeSpacedMathSuperscripts,
  hasUnicodeMathScripts,
  hasBengaliOutsideTextBlocks,
  repairMalformedScriptMarkers,
  stripInvisibleChars,
  stripMathInvisibleChars,
} from "./math-latex-repairs";

export type HybridUndelimitedSegment =
  | { kind: "math"; value: string }
  | { kind: "prose"; value: string };

export type ExamContentSegment =
  | { kind: "prose"; value: string }
  | { kind: "math"; value: string; display: "inline" | "block" };

export type ParsedExamContent = {
  segments: ExamContentSegment[];
  hadDelimiters: boolean;
};

function pushProse(segments: ExamContentSegment[], value: string) {
  if (!value) return;
  const prev = segments[segments.length - 1];
  if (prev?.kind === "prose") {
    prev.value += value;
    return;
  }
  segments.push({ kind: "prose", value });
}

function parseDelimitedSegments(raw: string): ParsedExamContent {
  const segments: ExamContentSegment[] = [];
  let hadDelimiters = false;
  let i = 0;
  let proseBuf = "";

  const flushProse = () => {
    if (proseBuf) {
      pushProse(segments, proseBuf);
      proseBuf = "";
    }
  };

  while (i < raw.length) {
    if (raw.startsWith("$$", i)) {
      hadDelimiters = true;
      flushProse();
      i += 2;
      const start = i;
      while (i < raw.length && !raw.startsWith("$$", i)) {
        i += 1;
      }
      const inner = raw.slice(start, i).trim();
      if (inner) {
        segments.push({ kind: "math", value: inner, display: "block" });
      }
      if (raw.startsWith("$$", i)) i += 2;
      continue;
    }

    if (raw[i] === "$" && raw[i - 1] !== "\\") {
      hadDelimiters = true;
      flushProse();
      i += 1;
      const start = i;
      while (i < raw.length) {
        if (raw[i] === "$" && raw[i - 1] !== "\\") break;
        i += 1;
      }
      const inner = raw.slice(start, i).trim();
      if (inner) {
        segments.push({ kind: "math", value: inner, display: "inline" });
      }
      if (raw[i] === "$") i += 1;
      continue;
    }

    proseBuf += raw[i];
    i += 1;
  }

  flushProse();

  if (segments.length === 0 && raw) {
    segments.push({ kind: "prose", value: raw });
  }

  return { segments, hadDelimiters };
}

/** Tokenize `$...$` / `$$...$$` vs prose without mutating prose content. */
export function parseExamContentSegments(raw: string): ParsedExamContent {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned) {
    return { segments: [], hadDelimiters: false };
  }
  return parseDelimitedSegments(cleaned);
}

function looksLikeLatex(value: string): boolean {
  const s = normalizeUnicodeMathScripts(value);
  return (
    /\\[a-zA-Z]|\\text\{|\^|_|\\frac|\\sqrt/.test(s) ||
    /(?<!\\)(frac|sqrt|text)\{/.test(s) ||
    hasUnicodeMathScripts(s)
  );
}

function isEquationChunk(value: string): boolean {
  const trimmed = normalizeUnicodeMathScripts(value.trim());
  if (!trimmed || hasBengaliLetters(trimmed)) return false;
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  if (looksLikeLatex(trimmed) && hasNonTextLatex(trimmed)) return true;
  if (!/[=+\-×÷*/^()]/.test(trimmed)) return false;
  if (trimmed.includes("=") && /[=+\-×÷*/^()]/.test(trimmed)) return true;
  if (
    !trimmed.includes(". ") &&
    trimmed.length <= 160 &&
    /[\d=a-zA-Z+\-×÷*/^()]/.test(trimmed) &&
    trimmed.split(/\s+/).length <= 14
  ) {
    return true;
  }
  return false;
}

function isBengaliLetterCode(code: number): boolean {
  return code >= 0x0980 && code <= 0x09ff && (code < 0x09e6 || code > 0x09ef);
}

function readBanglaRunEnd(value: string, start: number): number {
  let i = start;
  while (i < value.length) {
    const code = value.charCodeAt(i);
    const ch = value[i];
    if (isBengaliLetterCode(code) || ch === "\u200c" || ch === "\u200d") {
      i += 1;
      continue;
    }
    if (
      ch === " " &&
      i + 1 < value.length &&
      isBengaliLetterCode(value.charCodeAt(i + 1)) &&
      i > start
    ) {
      i += 1;
      continue;
    }
    break;
  }
  while (i < value.length && ",.;:?!।".includes(value[i])) {
    i += 1;
  }
  return i;
}

function readPlainRunEnd(value: string, start: number): number {
  let i = start;
  while (i < value.length) {
    const code = value.charCodeAt(i);
    if (value[i] === "\\" || value[i] === "$" || isBengaliLetterCode(code)) {
      break;
    }
    i += 1;
  }
  return i;
}

function readLatexMathRunEnd(value: string, start: number): number {
  let i = start;
  while (i < value.length) {
    if (value.startsWith("\\text{", i) || value.startsWith("\\textbf{", i)) {
      break;
    }
    if (value[i] === "\\") {
      i += 1;
      while (i < value.length && /[a-zA-Z]/.test(value[i])) i += 1;
      if (i < value.length && value[i] === "{") {
        i = readBracedGroup(value, i + 1);
      }
      continue;
    }
    if (value[i] === "{") {
      i = readBracedGroup(value, i + 1);
      continue;
    }
    const code = value.charCodeAt(i);
    if (isBengaliLetterCode(code) || value[i] === "$") break;
    i += 1;
  }
  return i;
}

function mergeHybridSegments(
  segments: HybridUndelimitedSegment[]
): HybridUndelimitedSegment[] {
  if (segments.length < 2) return segments;
  const merged: HybridUndelimitedSegment[] = [segments[0]];
  for (let i = 1; i < segments.length; i += 1) {
    const current = segments[i];
    const prev = merged[merged.length - 1];
    if (prev.kind === current.kind) {
      merged[merged.length - 1] = {
        kind: prev.kind,
        value:
          prev.kind === "prose"
            ? `${prev.value} ${current.value}`.replace(/\s+/g, " ").trim()
            : `${prev.value} ${current.value}`.trim(),
      };
    } else {
      merged.push(current);
    }
  }
  return merged;
}

function attachLeadingBaseToSuperscriptMath(
  segments: HybridUndelimitedSegment[]
): HybridUndelimitedSegment[] {
  const out: HybridUndelimitedSegment[] = [];
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    const next = segments[i + 1];
    if (
      seg.kind === "prose" &&
      next?.kind === "math" &&
      /^\s*\^/.test(next.value)
    ) {
      const match = seg.value.match(/^([\s\S]*?)([a-zA-Z])\s*$/);
      if (match?.[2]) {
        const prefix = match[1].trimEnd();
        if (prefix) out.push({ kind: "prose", value: prefix });
        out.push({
          kind: "math",
          value: `${match[2]}${next.value.trimStart()}`,
        });
        i += 1;
        continue;
      }
    }
    out.push(seg);
  }
  return out;
}

function proseNeedsHybridResplit(value: string): boolean {
  if (!hasBengaliLetters(value) || !/[a-zA-Z]/.test(value)) return false;
  return /[\^_=]|\\frac|\\sqrt/.test(value);
}

function finalizeHybridSegments(
  segments: HybridUndelimitedSegment[],
  depth = 0
): HybridUndelimitedSegment[] {
  let merged = mergeHybridSegments(
    attachLeadingBaseToSuperscriptMath(segments)
  );
  if (depth >= 2) return merged;

  const expanded: HybridUndelimitedSegment[] = [];
  let changed = false;
  for (const seg of merged) {
    if (seg.kind === "prose" && proseNeedsHybridResplit(seg.value)) {
      const inner = finalizeHybridSegments(
        parseHybridUndelimitedSegmentsRaw(seg.value),
        depth + 1
      );
      if (inner.length > 1 && inner.some((s) => s.kind === "math")) {
        expanded.push(...inner);
        changed = true;
        continue;
      }
    }
    expanded.push(seg);
  }
  return changed
    ? finalizeHybridSegments(expanded, depth + 1)
    : merged;
}

function parseHybridUndelimitedSegmentsRaw(
  raw: string
): HybridUndelimitedSegment[] {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned) return [];

  const value = normalizeSpacedMathSuperscripts(
    normalizeUnicodeMathScripts(stripMathInvisibleChars(cleaned))
  );
  const segments: HybridUndelimitedSegment[] = [];
  let cursor = 0;

  const push = (kind: HybridUndelimitedSegment["kind"], content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    segments.push({ kind, value: trimmed });
  };

  while (cursor < value.length) {
    if (value.startsWith("\\text{", cursor)) {
      const end = readBracedGroup(value, cursor + 6);
      push("prose", value.slice(cursor + 6, end - 1));
      cursor = end;
      continue;
    }

    if (value[cursor] === "\\") {
      const end = readLatexMathRunEnd(value, cursor);
      if (end > cursor) {
        push("math", value.slice(cursor, end));
        cursor = end;
        continue;
      }
      cursor += 1;
      continue;
    }

    const code = value.charCodeAt(cursor);
    if (isBengaliLetterCode(code)) {
      const end = readBanglaRunEnd(value, cursor);
      push("prose", value.slice(cursor, end));
      cursor = end;
      continue;
    }

    if (value[cursor] === "$") {
      const end = value.indexOf("$", cursor + 1);
      if (end !== -1) {
        push("math", value.slice(cursor + 1, end));
        cursor = end + 1;
        continue;
      }
    }

    const end = readPlainRunEnd(value, cursor);
    const chunk = value.slice(cursor, end);
    if (chunk.trim()) {
      push(isEquationChunk(chunk) ? "math" : "prose", chunk);
    }
    cursor = end;
  }

  return segments;
}

/** Split undelimited API strings into math vs Bengali prose runs. */
export function parseHybridUndelimitedSegments(
  raw: string
): HybridUndelimitedSegment[] {
  return finalizeHybridSegments(parseHybridUndelimitedSegmentsRaw(raw));
}

function stripTextBlocksForLatexCheck(value: string): string {
  let s = foldMultilineTextBlocks(value);
  let i = 0;
  let out = "";
  while (i < s.length) {
    if (s.startsWith("\\text{", i)) {
      i = readBracedGroup(s, i + 6);
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out.trim();
}

function hasNonTextLatex(value: string): boolean {
  const rest = normalizeUnicodeMathScripts(stripTextBlocksForLatexCheck(value));
  if (!rest) return false;
  return (
    /\\frac|\\sqrt|\^|_|\\cdot|\\times|\\div|\\pm|\\leq|\\geq|\\neq|\\left|\\right/.test(
      rest
    ) ||
    /\\(?!text\b)[a-zA-Z]/.test(rest) ||
    /(?<!\\)(frac|sqrt)\{/.test(rest) ||
    hasUnicodeMathScripts(rest)
  );
}

function escapeLatexTextContent(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/}/g, "\\}")
    .replace(/#/g, "\\#")
    .replace(/%/g, "\\%");
}

export type HybridFlowItem =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string };

/** Valid hybrid parse for exam stems (math + Bengali clauses). */
export function tryParseHybridUndelimitedForRender(
  raw: string
): HybridUndelimitedSegment[] | null {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned || !hasBengaliLetters(cleaned)) return null;

  const segments = parseHybridUndelimitedSegments(cleaned);
  if (segments.length < 2) return null;
  if (!segments.some((s) => s.kind === "math")) return null;
  if (!segments.some((s) => s.kind === "prose")) return null;
  return segments;
}

export function hybridSegmentsToFlowItems(
  segments: HybridUndelimitedSegment[]
): HybridFlowItem[] {
  return segments.map((seg) =>
    seg.kind === "math"
      ? { kind: "math", value: repairMathLatex(seg.value) }
      : { kind: "text", value: seg.value }
  );
}

function composeMultiSegmentHybridLatexFromSegments(
  segments: HybridUndelimitedSegment[]
): string {
  let out = "";
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    const next = segments[i + 1];
    if (seg.kind === "math") {
      out += repairMathLatex(seg.value);
      if (next?.kind === "prose") out += "\\;";
      continue;
    }
    let prose = seg.value.trim();
    const prev = segments[i - 1];
    if (prev?.kind === "math" && prose && !/^[ \u2009]/.test(prose)) {
      prose = ` ${prose}`;
    }
    if (next?.kind === "math" && prose && !prose.endsWith(" ")) {
      prose += " ";
    }
    out += `\\text{${escapeLatexTextContent(prose)}}`;
    if (next?.kind === "math") out += "\\;";
  }
  return out;
}

/**
 * Compose alternating math + `\\text{Bengali}` into one KaTeX document.
 */
export function tryComposeMultiSegmentHybridLatex(raw: string): string | null {
  const segments = tryParseHybridUndelimitedForRender(raw);
  if (!segments) return null;
  const out = composeMultiSegmentHybridLatexFromSegments(segments);
  return out || null;
}

/** @deprecated alias — use [tryComposeMultiSegmentHybridLatex] */
export function tryComposeUnifiedHybridLatex(raw: string): string | null {
  return tryComposeMultiSegmentHybridLatex(raw);
}

/** Remove `$…$` markers so a corrupted delimiter parse can be re-read as hybrid text. */
export function stripInlineDollarDelimiters(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] === "$" && raw[i - 1] !== "\\") continue;
    out += raw[i];
  }
  return out;
}

/** `$` pairs mis-placed in CMS (Bengali inside `$…$`, `\\frac` in prose). */
export function delimiterParseLooksCorrupt(
  segments: ExamContentSegment[]
): boolean {
  const badMath = segments.some(
    (s) =>
      s.kind === "math" &&
      hasBengaliLetters(s.value) &&
      !/\\[a-zA-Z]|\\frac|\^|_|=/.test(s.value)
  );
  const latexInProse = segments.some(
    (s) =>
      s.kind === "prose" &&
      (/\\frac|\\sqrt/.test(s.value) ||
        /\\[a-zA-Z]{2,}/.test(s.value))
  );
  return badMath || latexInProse;
}

/** Rejoin `$…$`-parsed segments into one undelimited string for hybrid re-parse. */
export function delimitedSegmentsToUndelimitedInput(
  segments: ExamContentSegment[]
): string {
  return segments
    .map((seg) => (seg.kind === "math" ? seg.value : seg.value))
    .join("");
}

/** CMS wraps tiny tokens (`$m$`, `$x$`, `$^2$`) — per-fragment render breaks layout. */
export function hasMicroInlineMathDelimiters(
  segments: ExamContentSegment[]
): boolean {
  const mathSegs = segments.filter((s) => s.kind === "math");
  if (mathSegs.length < 2) return false;
  const hasBanglaProse = segments.some(
    (s) => s.kind === "prose" && hasBengaliLetters(s.value)
  );
  if (!hasBanglaProse) return false;
  const tinyCount = mathSegs.filter((s) => s.value.trim().length <= 4).length;
  return tinyCount >= 2;
}

/** Compose `$…$` / prose alternating segments into one KaTeX hybrid document. */
export function tryComposeDelimitedSegmentsToHybridLatex(
  segments: ExamContentSegment[]
): string | null {
  if (segments.length < 2) return null;
  const hybridLike: HybridUndelimitedSegment[] = segments.map((seg) =>
    seg.kind === "math"
      ? { kind: "math", value: seg.value }
      : { kind: "prose", value: seg.value }
  );
  if (!hybridLike.some((s) => s.kind === "math")) return null;
  if (!hybridLike.some((s) => s.kind === "prose")) return null;
  const out = composeMultiSegmentHybridLatexFromSegments(hybridLike);
  return out || null;
}

/** Strip outer `$…$`, `$$…$$`, `\\(…\\)`, `\\[…\\]` wrappers. */
export function stripOuterMathDelimiters(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return trimmed.slice(2, -2).trim();
  }
  if (
    trimmed.startsWith("$") &&
    trimmed.endsWith("$") &&
    !trimmed.startsWith("$$")
  ) {
    return trimmed.slice(1, -1).trim();
  }
  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) {
    return trimmed.slice(2, -2).trim();
  }
  if (trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) {
    return trimmed.slice(2, -2).trim();
  }
  return trimmed;
}

/**
 * MathLive / admin-style formulas: one LaTeX document with `\\text{Bengali}`.
 * Returns repaired LaTeX when safe to pass directly to KaTeX (no undelimited Bengali).
 */
export function tryPrepareDirectKatexFormula(raw: string): string | null {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned) return null;

  const inner = stripOuterMathDelimiters(cleaned);
  const latex = repairMathLatex(inner);
  if (!latex) return null;
  if (hasBengaliOutsideTextBlocks(latex)) return null;
  return latex;
}

export function repairMathLatex(latex: string): string {
  let s = repairMalformedScriptMarkers(
    normalizeSpacedMathSuperscripts(
      normalizeUnicodeMathScripts(stripMathInvisibleChars(latex.trim()))
    )
  );
  if (!s) return s;

  s = normalizeDivCommand(s);
  s = foldMultilineTextBlocks(s);
  s = repairTextEmbeddedMathOperators(s);
  s = s.replace(/^[\u09CD\u200C\u200D\uFEFF\s]+/, "");
  s = repairBareLatexCommands(s);
  s = repairDivisionAndFractionTypos(s);
  s = convertBengaliDigitsOutsideTextBlocks(s);
  s = s.replace(/\\frac(\d)(\d)(?!\d)/g, "\\frac{$1}{$2}");
  s = repairImplicitFractionEquation(s);
  return normalizeMathPlaceholders(s);
}

/** True when undelimited string matches raw implicit fraction API shape. */
export function isImplicitRawEquation(value: string): boolean {
  if (hasBengaliLetters(value)) return false;
  const cleaned = normalizeDivCommand(stripInvisibleChars(value.trim()));
  if (/\\frac\s*\{/.test(cleaned)) {
    return repairPartialFractionAfterDiv(cleaned) !== cleaned;
  }
  return /^[^\s]+\s+[^\s]+\s*(\d+)?\s*\\div\s*[^\s]+\s+[^\s]+\s*$/i.test(
    cleaned
  );
}

/** @deprecated Use parseExamContentSegments + repairMathLatex */
export function prepareExamMathContent(raw: string): string {
  const parsed = parseExamContentSegments(raw);
  if (parsed.hadDelimiters) {
    return parsed.segments
      .map((seg) => {
        if (seg.kind !== "math") return seg.value;
        const inner = repairMathLatex(seg.value);
        return seg.display === "block" ? `$$${inner}$$` : `$${inner}$`;
      })
      .join("");
  }
  return repairMathLatex(raw);
}
