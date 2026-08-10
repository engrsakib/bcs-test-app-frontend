"use client";

import React, { useEffect, useRef, useState } from "react";

interface MathEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label?: string;
}

export default function MathEditor({
  value = "",
  onChange,
  readOnly = false,
  label,
}: MathEditorProps) {
  const mathEditorRef = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "mathlive-script";

    if (window.MathfieldElement) {
      setIsLoaded(true);
      return;
    }

    if (document.getElementById(scriptId)) {
      const checkInterval = window.setInterval(() => {
        if (window.MathfieldElement) {
          setIsLoaded(true);
          window.clearInterval(checkInterval);
        }
      }, 100);
      return () => window.clearInterval(checkInterval);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://unpkg.com/mathlive";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mathEditorRef.current) return;

    const mathField = mathEditorRef.current as HTMLElement & {
      setValue?: (value: string) => void;
      setOptions?: (options: Record<string, unknown>) => void;
      getValue?: () => string;
      addEventListener: HTMLElement["addEventListener"];
      removeEventListener: HTMLElement["removeEventListener"];
    };

    if (value && mathField.setValue) {
      mathField.setValue(value);
    }

    if (mathField.setOptions) {
      mathField.setOptions({
        virtualKeyboardMode: "manual",
        smartMode: true,
      });
    }

    const handleInput = () => {
      if (mathField.getValue && !readOnly && onChange) {
        onChange(mathField.getValue());
      }
    };

    mathField.addEventListener("input", handleInput);
    mathField.addEventListener("change", handleInput);

    return () => {
      mathField.removeEventListener("input", handleInput);
      mathField.removeEventListener("change", handleInput);
    };
  }, [isLoaded, onChange, readOnly, value]);

  useEffect(() => {
    if (!isLoaded || !mathEditorRef.current) return;

    const mathField = mathEditorRef.current as HTMLElement & {
      getValue?: () => string;
      setValue?: (value: string) => void;
    };

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
          read-only={readOnly ? "true" : undefined}
          style={{
            display: "block",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            padding: "0.5rem 0.75rem",
            fontSize: "1.125rem",
            background: "#ffffff",
            width: "100%",
            minHeight: "3rem",
          }}
        >
          {value || ""}
        </math-field>
      )}
    </div>
  );
}
