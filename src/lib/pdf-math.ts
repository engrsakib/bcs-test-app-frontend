import {
  renderKatexHtml,
  stripOuterMathDelimiters,
} from "@mcq/exam-math-compile";

const LATEX_PATTERN =
  /\\(?:frac|sqrt|sum|int|lim|left|right|text|begin|end|[a-zA-Z]+)|\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\(|\\\[|\\\)|\\\]/;

export function looksLikeLatex(text: string): boolean {
  if (!text?.trim()) return false;
  return LATEX_PATTERN.test(text);
}

export function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderMathHtml(
  value: string,
  displayMode = true,
): string {
  const input = stripOuterMathDelimiters(value);
  if (!input) return "";

  const { html, ok } = renderKatexHtml(input, {
    displayMode,
    repair: false,
  });
  return ok ? html : escapeHtml(value);
}

/** Renders plain Bangla/English or LaTeX for PDF HTML. */
export function renderContentHtml(
  value: string,
  options?: { forceMath?: boolean; displayMode?: boolean },
): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const useMath = options?.forceMath || looksLikeLatex(trimmed);
  if (useMath) {
    return `<span class="pdf-math">${renderMathHtml(trimmed, options?.displayMode ?? false)}</span>`;
  }

  return `<span class="pdf-text">${escapeHtml(trimmed)}</span>`;
}
