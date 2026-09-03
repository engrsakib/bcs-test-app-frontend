"use client";

import type { ReactNode } from "react";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";
import { SonnerProvider } from "@/components/ui/sonner-provider";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineBootstrap } from "@/components/pwa/OfflineBootstrap";
import { OFFLINE_ENABLED } from "@/config/offline";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfirmProvider>
      {children}
      <SonnerProvider />
      {OFFLINE_ENABLED ? <InstallPrompt /> : null}
      {OFFLINE_ENABLED ? <OfflineBootstrap /> : null}
    </ConfirmProvider>
  );
}
