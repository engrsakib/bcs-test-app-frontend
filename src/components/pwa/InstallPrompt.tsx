"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border border-emerald-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-emerald-50 p-2">
          <Download className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">Install EduMaster</p>
          <p className="text-sm text-slate-600 mt-1">
            Install the admin dashboard for faster access and offline shell support.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                await deferredPrompt.prompt();
                setDeferredPrompt(null);
              }}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
