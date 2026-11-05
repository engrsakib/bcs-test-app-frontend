import katex from "katex";
import { stripOuterMathDelimiters } from "./delimiters";
import { normalizeMathPlaceholders } from "./math-latex-repairs";
import { repairMathLatex } from "./prepare-latex-content";

export type KatexRenderOptions = {
  displayMode?: boolean;
  repair?: boolean;
};

export function renderKatexHtml(
  latex: string,
  options: KatexRenderOptions = {}
): { html: string; ok: boolean } {
  const { displayMode = false, repair = true } = options;
  const normalized = normalizeMathPlaceholders(
    repair ? repairMathLatex(latex) : latex.trim()
  );
  if (!normalized) return { html: "", ok: false };

  try {
    const html = katex.renderToString(normalized, {
      displayMode,
      output: "html",
      throwOnError: false,
      strict: "ignore",
      trust: true,
    });
    const ok = !html.includes('class="katex-error"');
    return { html, ok };
  } catch {
    return { html: "", ok: false };
  }
}

/** Admin-style: minimal mutation before first KaTeX pass. */
export function renderStoredMathFormulaHtml(
  value: string,
  displayMode = false
): string {
  const input = stripOuterMathDelimiters(value.trim());
  if (!input) return "";
  const { html, ok } = renderKatexHtml(input, {
    displayMode,
    repair: false,
  });
  return ok ? html : input;
}
