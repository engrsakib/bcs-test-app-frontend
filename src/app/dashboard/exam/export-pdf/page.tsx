"use client";

import ExamExportPdfClient from "@/components/modules/exam/ExamExportPdfClient";
import { Suspense } from "react";

export default function ExamExportPdfPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-gray-600">Preparing PDF export…</p>
        </div>
      }
    >
      <ExamExportPdfClient />
    </Suspense>
  );
}
