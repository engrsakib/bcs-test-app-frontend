"use client";

import type { ReactNode } from "react";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";
import { SonnerProvider } from "@/components/ui/sonner-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfirmProvider>
      {children}
      <SonnerProvider />
    </ConfirmProvider>
  );
}
