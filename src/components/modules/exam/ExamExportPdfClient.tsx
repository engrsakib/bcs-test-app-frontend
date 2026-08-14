"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaFilePdf } from "react-icons/fa";
import {
  exportExamPdf,
  type ExamExportData,
} from "@/lib/export-exam-pdf";
import { notify } from "@/lib/toast";

export default function ExamExportPdfClient() {
  const params = useSearchParams();
  const router = useRouter();
  const examNumber = params.get("exam");

  const [exam, setExam] = useState<ExamExportData | null>(null);
  const [status, setStatus] = useState<
    "loading" | "exporting" | "done" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchExam = useCallback(async () => {
    if (!examNumber) return null;

    const res = await fetch(`${backendUrl}/exam/${examNumber}`);
    const json = await res.json();
    if (!json.success) {
      throw new Error("Exam not found");
    }
    return json.data as ExamExportData;
  }, [backendUrl, examNumber]);

  useEffect(() => {
    if (!examNumber) {
      setStatus("error");
      setErrorMessage("Missing exam number in URL.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchExam();
        if (cancelled || !data) return;
        setExam(data);
        setStatus("exporting");

        const toastId = notify.loading(
          "Generating PDF…",
          "Rendering Bangla, English, and LaTeX content",
        );

        await exportExamPdf(data);

        if (cancelled) return;
        notify.dismiss(toastId);
        notify.success("PDF downloaded", "Exam question paper saved to your device.");
        setStatus("done");
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "PDF export failed.";
        setErrorMessage(message);
        setStatus("error");
        notify.error("Export failed", message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [examNumber, fetchExam]);

  const detailsUrl = `/dashboard/exam/details?exam=${examNumber ?? ""}`;

  if (!examNumber) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-gray-700">Invalid exam number.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <FaFilePdf size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Export Exam PDF</h1>
            <p className="text-sm text-gray-500">Exam #{examNumber}</p>
          </div>
        </div>

        {status === "loading" || status === "exporting" ? (
          <div className="py-8 text-center">
            <div className="relative mx-auto mb-4 h-14 w-14">
              <div className="h-14 w-14 rounded-full border-4 border-emerald-100" />
              <div className="absolute top-0 h-14 w-14 animate-spin rounded-full border-t-4 border-emerald-600" />
            </div>
            <p className="font-medium text-gray-800">
              {status === "loading"
                ? "Loading exam data…"
                : "Building PDF with Bangla & LaTeX…"}
            </p>
            {exam?.exam_name ? (
              <p className="mt-2 text-sm text-gray-500">{exam.exam_name}</p>
            ) : null}
          </div>
        ) : null}

        {status === "done" ? (
          <div className="py-6 text-center">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-emerald-600" />
            <p className="text-lg font-semibold text-gray-900">PDF ready</p>
            <p className="mt-2 text-sm text-gray-600">
              {exam?.exam_name ?? "Exam"} — {exam?.questions.length ?? 0}{" "}
              questions exported.
            </p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push(detailsUrl)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FaArrowLeft size={14} />
            Back to Details
          </button>
          {status === "done" && exam ? (
            <button
              type="button"
              onClick={() => {
                setStatus("exporting");
                exportExamPdf(exam)
                  .then(() => {
                    notify.success("PDF downloaded again");
                    setStatus("done");
                  })
                  .catch((err) => {
                    notify.error(
                      "Export failed",
                      err instanceof Error ? err.message : undefined,
                    );
                    setStatus("error");
                  });
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <FaFilePdf size={14} />
              Download Again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
