"use client";

import { ENV } from "@/config/env";
import {
  buildDefaultExportTitle,
  exportMeritListCsv,
  exportMeritListPdf,
  MeritExportRow,
} from "@/lib/export-merit-list";
import { formatExamDateTime } from "@/lib/exam-datetime";
import { notify } from "@/lib/toast";
import getCookie from "@/util/GetCookie";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Exam {
  _id: string;
  exam_name: string;
  exam_date_time: string;
  exam_number: number;
}

interface ExportResultModalProps {
  allExams: Exam[];
  initialExamNumber?: string;
  initialExamSearch?: string;
  onClose: () => void;
}

type PhoneMode = "half" | "full";
type ExportFormat = "csv" | "pdf";

export default function ExportResultModal({
  allExams,
  initialExamNumber = "",
  initialExamSearch = "",
  onClose,
}: ExportResultModalProps) {
  const [examSearch, setExamSearch] = useState(initialExamSearch);
  const [selectedExamNumber, setSelectedExamNumber] =
    useState(initialExamNumber);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [meritFrom, setMeritFrom] = useState("1");
  const [meritTo, setMeritTo] = useState("100");
  const [includePhone, setIncludePhone] = useState(true);
  const [phoneMode, setPhoneMode] = useState<PhoneMode>("half");
  const [title, setTitle] = useState("");
  const [totalRanked, setTotalRanked] = useState<number | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const filteredExams = useMemo(() => {
    if (!examSearch.trim()) return allExams;
    return allExams.filter((exam) =>
      exam.exam_name.toLowerCase().includes(examSearch.toLowerCase()),
    );
  }, [allExams, examSearch]);

  const selectedExam = useMemo(
    () =>
      allExams.find(
        (exam) => exam.exam_number.toString() === selectedExamNumber,
      ) ?? null,
    [allExams, selectedExamNumber],
  );

  useEffect(() => {
    if (selectedExam) {
      setTitle(
        buildDefaultExportTitle(
          selectedExam.exam_name,
          selectedExam.exam_date_time,
          formatExamDateTime,
        ),
      );
    }
  }, [selectedExam]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".export-exam-search-container")) {
        setShowExamDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!selectedExamNumber) {
      setTotalRanked(null);
      return;
    }

    const fetchTotalRanked = async () => {
      setLoadingMeta(true);
      try {
        const params = new URLSearchParams({
          from: "1",
          to: "1",
          includePhone: "false",
          phoneMode: "half",
        });

        const response = await fetch(
          `${ENV.BASE_URL}/results/${selectedExamNumber}/merit-export?${params.toString()}`,
          {
            headers: {
              Authorization: getCookie("access_token") || "",
            },
          },
        );

        const json = await response.json();

        if (json.success && json.data) {
          setTotalRanked(json.data.totalRanked ?? 0);
          if (json.data.totalRanked > 0) {
            setMeritTo(String(Math.min(100, json.data.totalRanked)));
          }
        } else {
          setTotalRanked(null);
        }
      } catch {
        setTotalRanked(null);
      } finally {
        setLoadingMeta(false);
      }
    };

    fetchTotalRanked();
  }, [selectedExamNumber]);

  const handleExamSelect = (exam: Exam) => {
    setSelectedExamNumber(exam.exam_number.toString());
    setExamSearch(exam.exam_name);
    setShowExamDropdown(false);
  };

  const validateForm = () => {
    const from = Number(meritFrom);
    const to = Number(meritTo);

    if (!selectedExamNumber) {
      notify.error("Please select an exam.");
      return null;
    }

    if (!meritFrom || !meritTo || Number.isNaN(from) || Number.isNaN(to)) {
      notify.error("Please enter valid merit range values.");
      return null;
    }

    if (from < 1 || to < from) {
      notify.error(
        "Merit range is invalid. 'From' must be >= 1 and 'To' must be >= 'From'.",
      );
      return null;
    }

    if (totalRanked !== null && to > totalRanked) {
      notify.error(
        `Merit 'To' cannot exceed available ranked students (${totalRanked}).`,
      );
      return null;
    }

    return { from, to };
  };

  const fetchMeritRows = async (from: number, to: number) => {
    const params = new URLSearchParams({
      from: from.toString(),
      to: to.toString(),
      includePhone: includePhone.toString(),
      phoneMode,
    });

    const response = await fetch(
      `${ENV.BASE_URL}/results/${selectedExamNumber}/merit-export?${params.toString()}`,
      {
        headers: {
          Authorization: getCookie("access_token") || "",
        },
      },
    );

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.message || "Failed to fetch merit list");
    }

    return json.data as {
      exam_name: string;
      exam_date_time: string;
      exam_number: number;
      totalRanked: number;
      rows: MeritExportRow[];
    };
  };

  const handleExport = async (format: ExportFormat) => {
    const range = validateForm();
    if (!range) return;

    setExporting(format);

    try {
      const data = await fetchMeritRows(range.from, range.to);

      if (!data.rows.length) {
        notify.error("No merit list rows found for the selected range.");
        return;
      }

      const exportOptions = {
        title:
          title.trim() ||
          buildDefaultExportTitle(
            data.exam_name,
            data.exam_date_time,
            formatExamDateTime,
          ),
        subtitle: `${data.exam_name} • ${formatExamDateTime(data.exam_date_time)}`,
        rows: data.rows,
        includePhone,
        examNumber: data.exam_number,
        from: range.from,
        to: range.to,
      };

      if (format === "csv") {
        exportMeritListCsv(exportOptions);
      } else {
        exportMeritListPdf(exportOptions);
      }

      notify.success(`${format.toUpperCase()} exported successfully.`);
      onClose();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Export failed. Please try again.",
      );
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close export modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Export Merit List
          </h3>
          <p className="text-gray-600">Download ranked results as CSV or PDF</p>
        </div>

        <div className="space-y-5">
          <div className="relative export-exam-search-container">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Exam Name
            </label>
            <input
              type="text"
              placeholder="Search exam name..."
              value={examSearch}
              onFocus={() => setShowExamDropdown(true)}
              onChange={(e) => {
                setExamSearch(e.target.value);
                if (!e.target.value) setSelectedExamNumber("");
              }}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
            <FaSearch className="absolute left-3 top-[2.65rem] text-gray-400" />

            {showExamDropdown && filteredExams.length > 0 && (
              <div className="absolute bg-white shadow-xl border border-gray-200 rounded-xl w-full max-h-48 overflow-y-auto z-20 mt-2">
                {filteredExams.map((exam) => (
                  <div
                    key={exam._id}
                    onClick={() => handleExamSelect(exam)}
                    className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <p className="font-medium text-gray-800 truncate">
                      {exam.exam_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatExamDateTime(exam.exam_date_time)} • #
                      {exam.exam_number}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Merit From
              </label>
              <input
                type="number"
                min={1}
                value={meritFrom}
                onChange={(e) => setMeritFrom(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Merit To
              </label>
              <input
                type="number"
                min={1}
                value={meritTo}
                onChange={(e) => setMeritTo(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          {loadingMeta ? (
            <p className="text-sm text-gray-500">Loading available ranks...</p>
          ) : totalRanked !== null ? (
            <p className="text-sm text-gray-500">
              Max available ranked students: {totalRanked}
            </p>
          ) : null}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="MCQ Analysis - Exam Name - Date"
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includePhone}
                onChange={(e) => setIncludePhone(e.target.checked)}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Include phone number
              </span>
            </label>

            {includePhone && (
              <div className="grid grid-cols-2 gap-3 pl-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="phoneMode"
                    checked={phoneMode === "half"}
                    onChange={() => setPhoneMode("half")}
                    className="accent-green-600"
                  />
                  <span className="text-sm text-gray-700">Half number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="phoneMode"
                    checked={phoneMode === "full"}
                    onChange={() => setPhoneMode("full")}
                    className="accent-green-600"
                  />
                  <span className="text-sm text-gray-700">Full number</span>
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-5 h-5" />
              {exporting === "csv" ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              {exporting === "pdf" ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
