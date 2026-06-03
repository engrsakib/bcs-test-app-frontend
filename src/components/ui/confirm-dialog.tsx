"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import clsx from "clsx";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

let globalConfirm: ((options: ConfirmOptions) => Promise<boolean>) | null = null;

export async function confirmAction(options: ConfirmOptions): Promise<boolean> {
  if (globalConfirm) {
    return globalConfirm(options);
  }

  return window.confirm(
    options.description ? `${options.title}\n\n${options.description}` : options.title
  );
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState(options);
    });
  }, []);

  useEffect(() => {
    globalConfirm = confirm;
    return () => {
      globalConfirm = null;
    };
  }, [confirm]);

  const close = (result: boolean) => {
    setState(null);
    resolverRef.current?.(result);
    resolverRef.current = null;
  };

  const isDestructive = state?.variant === "destructive";
  const Icon = isDestructive ? AlertTriangle : HelpCircle;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {state && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => close(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/30 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start gap-4">
              <div
                className={clsx(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  isDestructive ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{state.title}</h3>
                {state.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {state.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {state.cancelText ?? "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={clsx(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors",
                  isDestructive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {state.confirmText ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context.confirm;
}
