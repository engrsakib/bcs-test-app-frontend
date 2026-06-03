"use client";

import { Toaster } from "sonner";

export function SonnerProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast border border-slate-200/80 bg-white text-slate-900 shadow-lg shadow-slate-200/60 rounded-xl font-poppins",
          title: "text-sm font-semibold text-slate-900",
          description: "text-sm text-slate-600",
          success: "border-emerald-200 bg-emerald-50/70",
          error: "border-red-200 bg-red-50/70",
          warning: "border-amber-200 bg-amber-50/70",
          info: "border-sky-200 bg-sky-50/70",
          loading: "border-slate-200 bg-white",
          closeButton:
            "border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors",
        },
      }}
    />
  );
}
