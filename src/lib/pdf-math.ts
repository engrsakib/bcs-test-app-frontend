import katex from "katex";

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

function stripDelimiters(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return trimmed.slice(2, -2).trim();
  }
  if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
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

export function renderMathHtml(
  value: string,
  displayMode = true,
): string {
  const input = stripDelimiters(value);
  if (!input) return "";

  try {
    return katex.renderToString(input, {
      throwOnError: false,
      displayMode,
      strict: "ignore",
    });
  } catch {
    return escapeHtml(value);
  }
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
