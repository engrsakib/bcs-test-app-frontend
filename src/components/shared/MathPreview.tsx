"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import {
  compileExamMathFormula,
  renderStoredMathFormulaHtml,
} from "@/lib/exam-math-render";
import type { HybridFlowItem } from "@mcq/exam-math-compile";

function renderMixedFlowPreviewHtml(flow: HybridFlowItem[]): string {
  return flow
    .map((item) => {
      if (item.kind === "text") {
        return item.value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      }
      try {
        return katex.renderToString(item.value, {
          displayMode: false,
          throwOnError: false,
          strict: "ignore",
          trust: true,
        });
      } catch {
        return item.value;
      }
    })
    .join("");
}

function previewHtmlFromFormula(value: string): string {
  const outcome = compileExamMathFormula(value, false);
  if (outcome.kind === "single-html") return outcome.result.html;
  if (outcome.kind === "mixed-flow") {
    return renderMixedFlowPreviewHtml(outcome.flow);
  }
  return renderStoredMathFormulaHtml(value, false);
}

interface MathPreviewProps {
  value?: string;
  className?: string;
  /** Clip overflow without showing scrollbars (e.g. table cells). */
  noScroll?: boolean;
}

export default function MathPreview({
  value,
  className = "",
  noScroll = false,
}: MathPreviewProps) {
  if (!value?.trim()) {
    return <span className="text-sm italic text-gray-400">Empty equation</span>;
  }

  const overflowClass = noScroll
    ? "overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    : "overflow-x-auto";

  const html = previewHtmlFromFormula(value);

  return (
    <div
      className={`katex-preview ${overflowClass} ${className}`.trim()}
      lang="bn"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
