"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/mathlive-katex-fonts.css";
import "@/styles/math-editor.css";
import {
  isLikelyBijoyAnsi,
  sanitizePastedTextForMathField,
} from "@/lib/sanitize-math-paste";

interface MathEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label?: string;
}

type MathFieldElement = HTMLElement & {
  setValue?: (value: string) => void;
  setOptions?: (options: Record<string, unknown>) => void;
  getValue?: () => string;
  insert?: (value: string) => boolean;
  addEventListener: HTMLElement["addEventListener"];
  removeEventListener: HTMLElement["removeEventListener"];
};

let mathLiveLoader: Promise<void> | null = null;

function ensureMathLiveLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!mathLiveLoader) {
    mathLiveLoader = import("mathlive").then(({ MathfieldElement }) => {
      MathfieldElement.fontsDirectory = "/mathlive-fonts";
    });
  }

  return mathLiveLoader;
}

export default function MathEditor({
  value = "",
  onChange,
  readOnly = false,
  label,
}: MathEditorProps) {
  const mathEditorRef = useRef<MathFieldElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureMathLiveLoaded().then(() => {
      if (!cancelled) {
        setIsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mathEditorRef.current) return;

    const mathField = mathEditorRef.current;

    if (value && mathField.setValue) {
      mathField.setValue(value);
    }

    if (mathField.setOptions) {
      mathField.setOptions({
        virtualKeyboardMode: "manual",
        smartMode: true,
        defaultMode: "math",
      });
    }

    const handleInput = () => {
      if (mathField.getValue && !readOnly && onChange) {
        onChange(mathField.getValue());
      }
    };

    const handlePaste = (event: Event) => {
      if (readOnly) return;

      const clipboardEvent = event as ClipboardEvent;
      const raw = clipboardEvent.clipboardData?.getData("text/plain") ?? "";
      if (!isLikelyBijoyAnsi(raw)) {
        return;
      }

      const converted = sanitizePastedTextForMathField(raw);
      if (converted === raw) {
        return;
      }

      clipboardEvent.preventDefault();
      clipboardEvent.stopPropagation();
      mathField.insert?.(converted);
    };

    mathField.addEventListener("input", handleInput);
    mathField.addEventListener("change", handleInput);
    mathField.addEventListener("paste", handlePaste);

    return () => {
      mathField.removeEventListener("input", handleInput);
      mathField.removeEventListener("change", handleInput);
      mathField.removeEventListener("paste", handlePaste);
    };
  }, [isLoaded, onChange, readOnly, value]);

  useEffect(() => {
    if (!isLoaded || !mathEditorRef.current) return;

    const mathField = mathEditorRef.current;

    if (mathField.getValue && mathField.setValue) {
      const currentVal = mathField.getValue();
      if (currentVal !== value) {
        mathField.setValue(value || "");
      }
    }
  }, [value, isLoaded]);

  return (
    <div>
      {label ? (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      {!isLoaded ? (
        <div className="w-full rounded-md border border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
          Loading Math Editor...
        </div>
      ) : (
        <math-field
          ref={mathEditorRef as React.RefObject<HTMLElement>}
          className="math-editor-field"
          read-only={readOnly ? "true" : undefined}
          smart-mode="on"
        >
          {value || ""}
        </math-field>
      )}
    </div>
  );
}
