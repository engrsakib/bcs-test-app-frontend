"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathPreviewProps {
  value?: string;
  className?: string;
}

export default function MathPreview({ value, className = "" }: MathPreviewProps) {
  if (!value?.trim()) {
    return <span className="text-sm italic text-gray-400">Empty equation</span>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <BlockMath math={value} />
    </div>
  );
}
