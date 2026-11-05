import {
  stripOuterMathDelimiters,
  stripInlineDollarDelimiters,
} from "./delimiters";
import {
  hasBengaliLetters,
  hasBengaliOutsideTextBlocks,
  stripInvisibleChars,
} from "./math-latex-repairs";
import { renderKatexHtml } from "./katex-render";
import {
  delimitedSegmentsToUndelimitedInput,
  delimiterParseLooksCorrupt,
  hasMicroInlineMathDelimiters,
  parseExamContentSegments,
  repairMathLatex,
  tryComposeDelimitedSegmentsToHybridLatex,
  tryComposeMultiSegmentHybridLatex,
  tryComposeUnifiedHybridLatex,
  tryParseHybridUndelimitedForRender,
  tryPrepareDirectKatexFormula,
  type ExamContentSegment,
  type HybridFlowItem,
} from "./prepare-latex-content";

export type CompileStrategy = "stored" | "stored-repaired" | "hybrid" | "direct";

export type CompileExamMathResult = {
  strategy: CompileStrategy;
  latex: string;
  html: string;
  displayMode: boolean;
};

export type HybridFlowFallback = {
  kind: "mixed-flow";
  flow: HybridFlowItem[];
};

export type CompileExamMathOutcome =
  | { kind: "single-html"; result: CompileExamMathResult }
  | HybridFlowFallback
  | { kind: "empty" };

function pickDisplayMode(latex: string, requested: boolean): boolean {
  if (!requested) return false;
  if (/\\text\{/.test(latex)) return false;
  return true;
}

function tryStoredCompile(
  raw: string,
  displayMode: boolean,
  useRepair: boolean
): CompileExamMathResult | null {
  const cleaned = stripInvisibleChars(raw.trim());
  if (!cleaned) return null;

  const inner = stripOuterMathDelimiters(cleaned);
  if (hasBengaliOutsideTextBlocks(inner)) return null;

  const { html, ok } = renderKatexHtml(inner, {
    displayMode: pickDisplayMode(inner, displayMode),
    repair: useRepair,
  });
  if (!ok) return null;

  return {
    strategy: useRepair ? "stored-repaired" : "stored",
    latex: useRepair ? repairMathLatex(inner) : inner,
    html,
    displayMode: pickDisplayMode(inner, displayMode),
  };
}

function tryHybridLatexCompose(
  stripped: string,
  displayMode: boolean
): CompileExamMathResult | null {
  const directLatex = tryPrepareDirectKatexFormula(stripped);
  if (directLatex) {
    const { html, ok } = renderKatexHtml(directLatex, {
      displayMode: pickDisplayMode(directLatex, displayMode),
      repair: false,
    });
    if (ok) {
      return {
        strategy: "direct",
        latex: directLatex,
        html,
        displayMode: pickDisplayMode(directLatex, displayMode),
      };
    }
  }

  if (!hasBengaliLetters(stripped)) return null;

  const hybridCandidates = [
    tryComposeMultiSegmentHybridLatex(stripped),
    tryComposeUnifiedHybridLatex(stripped),
  ].filter((v): v is string => Boolean(v));

  for (const hybridLatex of hybridCandidates) {
    const { html, ok } = renderKatexHtml(hybridLatex, {
      displayMode: pickDisplayMode(hybridLatex, displayMode),
      repair: false,
    });
    if (ok) {
      return {
        strategy: "hybrid",
        latex: hybridLatex,
        html,
        displayMode: pickDisplayMode(hybridLatex, displayMode),
      };
    }
  }

  return null;
}

function tryDelimitedHybridCompose(
  segments: ExamContentSegment[],
  displayMode: boolean
): CompileExamMathResult | null {
  const hasBanglaProse = segments.some(
    (s) => s.kind === "prose" && hasBengaliLetters(s.value)
  );
  if (!hasBanglaProse) return null;

  let composed: string | null = null;
  if (hasMicroInlineMathDelimiters(segments)) {
    composed = tryComposeMultiSegmentHybridLatex(
      delimitedSegmentsToUndelimitedInput(segments)
    );
  } else {
    composed = tryComposeDelimitedSegmentsToHybridLatex(segments);
  }

  if (!composed) return null;
  const { html, ok } = renderKatexHtml(composed, {
    displayMode: pickDisplayMode(composed, displayMode),
    repair: false,
  });
  if (!ok) return null;

  return {
    strategy: "hybrid",
    latex: composed,
    html,
    displayMode: pickDisplayMode(composed, displayMode),
  };
}

function hybridFlowFallback(stripped: string): HybridFlowFallback | null {
  const hybridSegments = tryParseHybridUndelimitedForRender(stripped);
  if (!hybridSegments) return null;
  const flow: HybridFlowItem[] = hybridSegments.map((seg) =>
    seg.kind === "math"
      ? { kind: "math", value: repairMathLatex(seg.value) }
      : { kind: "text", value: seg.value }
  );
  return { kind: "mixed-flow", flow };
}

/**
 * Canonical compile: admin primary (stored LaTeX) first, hybrid legacy fallback.
 */
export function compileExamMathFormula(
  raw: string,
  displayMode = false
): CompileExamMathOutcome {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: "empty" };

  const stripped = stripInvisibleChars(trimmed);

  const primaryAttempts = [
    stripped,
    stripInlineDollarDelimiters(stripped),
    stripOuterMathDelimiters(stripped),
    stripOuterMathDelimiters(stripInlineDollarDelimiters(stripped)),
  ];

  for (const candidate of primaryAttempts) {
    const stored = tryStoredCompile(candidate, displayMode, false);
    if (stored) return { kind: "single-html", result: stored };
  }

  for (const candidate of primaryAttempts) {
    const stored = tryStoredCompile(candidate, displayMode, true);
    if (stored) return { kind: "single-html", result: stored };
  }

  const parsed = parseExamContentSegments(stripped);
  if (parsed.hadDelimiters && parsed.segments.length > 0) {
    const hasBanglaDelimited = parsed.segments.some(
      (s) => s.kind === "prose" && hasBengaliLetters(s.value)
    );

    if (delimiterParseLooksCorrupt(parsed.segments) || hasBanglaDelimited) {
      const withoutDollars = stripInlineDollarDelimiters(stripped);
      const hybrid = tryHybridLatexCompose(withoutDollars, displayMode);
      if (hybrid) return { kind: "single-html", result: hybrid };
    }

    const delimitedHybrid = tryDelimitedHybridCompose(
      parsed.segments,
      displayMode
    );
    if (delimitedHybrid) return { kind: "single-html", result: delimitedHybrid };

    if (hasBanglaDelimited) {
      const withoutDollars = stripInlineDollarDelimiters(stripped);
      const hybrid = tryHybridLatexCompose(withoutDollars, displayMode);
      if (hybrid) return { kind: "single-html", result: hybrid };

      const rebuilt = delimitedSegmentsToUndelimitedInput(parsed.segments);
      const hybridFromRebuild = tryHybridLatexCompose(rebuilt, displayMode);
      if (hybridFromRebuild) {
        return { kind: "single-html", result: hybridFromRebuild };
      }

      const flow = hybridFlowFallback(rebuilt) ?? hybridFlowFallback(withoutDollars);
      if (flow) return flow;
    }
  }

  const hybrid = tryHybridLatexCompose(stripped, displayMode);
  if (hybrid) return { kind: "single-html", result: hybrid };

  const flow = hybridFlowFallback(stripped);
  if (flow) return flow;

  const lastResort = tryStoredCompile(stripped, displayMode, true);
  if (lastResort) return { kind: "single-html", result: lastResort };

  return { kind: "empty" };
}
