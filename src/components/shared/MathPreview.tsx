"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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

  return (
    <div className={`${overflowClass} ${className}`.trim()}>
      <BlockMath math={value} />
    </div>
  );
}
