import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {children}
      </div>
    </section>
  );
}
