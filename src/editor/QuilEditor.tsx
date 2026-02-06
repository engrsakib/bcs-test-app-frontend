



"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
};

export default function QuillEditor({
  value = "",
  onChange,
  readOnly = false,
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      readOnly,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });

    // ✅ set initial content
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // ✅ CORRECT WAY to get HTML
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChange?.(html);
    });

    quillRef.current = quill;
  }, []);

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div ref={editorRef} className="min-h-[220px]" />
    </div>
  );
}
