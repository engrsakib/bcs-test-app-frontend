"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { ENV } from "@/config/env";

type RangeKey =
  | "last7"
  | "last15"
  | "last30"
  | "lastMonth"
  | "lastYear"
  | "custom";

type TimeSeriesPoint = {
  date: string;
  avgScore: number;
  attempts: number;
  avgCorrectRate: number;
  avgTotalScore: number;
};

type GrowthSummary = {
  averageScore: number;
  totalAttempts: number;
  averageCorrectRate: number;
  professionalGrade: number;
};

type StudentInfo = {
  _id: string;
  name: string;
  phone_number: string;
  email?: string;
};

type GrowthResponse = {
  timeSeries: TimeSeriesPoint[];
  summary: GrowthSummary;
  student?: StudentInfo;
};

const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "last7", label: "7d" },
  { value: "last15", label: "15d" },
  { value: "last30", label: "30d" },
  { value: "lastMonth", label: "Last month" },
  { value: "lastYear", label: "Last year" },
  { value: "custom", label: "Custom" },
];

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function GrowthChart({ data }: { data: TimeSeriesPoint[] }) {
  const chart = useMemo(() => {
    if (!data.length) return null;

    const width = 720;
    const height = 260;
    const padding = { top: 20, right: 20, bottom: 36, left: 44 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const maxScore = Math.max(...data.map((d) => d.avgScore), 1);
    const points = data.map((item, index) => {
      const x =
        padding.left +
        (data.length === 1 ? innerW / 2 : (index / (data.length - 1)) * innerW);
      const y = padding.top + innerH - (item.avgScore / maxScore) * innerH;
      return { x, y, item };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${
      padding.top + innerH
    } L ${points[0].x} ${padding.top + innerH} Z`;

    return { width, height, padding, innerH, maxScore, points, linePath, areaPath };
  }, [data]);

  if (!chart) return null;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="min-w-full h-auto"
        role="img"
        aria-label="Average score over time"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chart.padding.top + chart.innerH - ratio * chart.innerH;
          return (
            <g key={ratio}>
              <line
                x1={chart.padding.left}
                y1={y}
                x2={chart.width - chart.padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x="8" y={y + 4} fontSize="11" fill="#6b7280">
                {Math.round(chart.maxScore * ratio)}
              </text>
            </g>
          );
        })}

        <path d={chart.areaPath} fill="rgba(22, 101, 52, 0.08)" />
        <path
          d={chart.linePath}
          fill="none"
          stroke="#166534"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {chart.points.map((point) => (
          <g key={point.item.date}>
            <circle cx={point.x} cy={point.y} r="4" fill="#166534" />
            <text
              x={point.x}
              y={chart.height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {point.item.date.slice(5)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function StudentPersonalGrowth({
  studentId,
}: {
  studentId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>("last7");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [growth, setGrowth] = useState<GrowthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGrowth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");
      const params = new URLSearchParams({ range });

      if (range === "custom") {
        if (!customStart || !customEnd) {
          setError("Select both start and end dates for custom range.");
          setLoading(false);
          return;
        }
        params.set("start", customStart);
        params.set("end", customEnd);
      }

      const res = await fetch(
        `${ENV.BASE_URL}/user/${studentId}/personal-growth?${params.toString()}`,
        {
          headers: {
            Authorization: token || "",
          },
          cache: "no-store",
        }
      );

      const result = await res.json();

      if (!res.ok || !result?.success) {
        setGrowth(null);
        setError(result?.message || "Failed to load personal growth data.");
        return;
      }

      setGrowth(result.data as GrowthResponse);
    } catch {
      setGrowth(null);
      setError("Something went wrong while loading personal growth data.");
    } finally {
      setLoading(false);
    }
  }, [studentId, range, customStart, customEnd]);

  useEffect(() => {
    if (range !== "custom") {
      fetchGrowth();
    }
  }, [fetchGrowth, range]);

  const summary = growth?.summary;
  const student = growth?.student;
  const timeSeries = growth?.timeSeries ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/dashboard/team/view-student"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Students</span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
            <div className="flex items-center gap-3 text-white">
              <TrendingUp className="w-8 h-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Personal Growth
                </h1>
                <p className="text-green-50/90 text-sm md:text-base">
                  {student?.name || "Student performance overview"}
                </p>
              </div>
            </div>
          </div>

          {student && (
            <div className="grid md:grid-cols-3 gap-4 p-6 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-700" />
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-700" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {student.phone_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-700" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">
                    {student.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRange(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    range === option.value
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {range === "custom" && (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchGrowth}
                  className="px-5 py-2.5 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800"
                >
                  Apply Range
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-green-700" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <SummaryCard
                    title="Avg Score"
                    value={`${summary?.averageScore ?? 0}`}
                  />
                  <SummaryCard
                    title="Attempts"
                    value={`${summary?.totalAttempts ?? 0}`}
                  />
                  <SummaryCard
                    title="Correct %"
                    value={`${(((summary?.averageCorrectRate ?? 0) * 100) || 0).toFixed(1)}%`}
                  />
                  <SummaryCard
                    title="Grade"
                    value={`${summary?.professionalGrade ?? 0}%`}
                  />
                </div>

                {timeSeries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-gray-600">
                    No exam activity in this period. Growth data will appear
                    after the student takes tests.
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Average Score Trend
                      </h2>
                      <GrowthChart data={timeSeries} />
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Avg Score
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Attempts
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Correct Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {timeSeries.map((row) => (
                            <tr key={row.date} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{row.date}</td>
                              <td className="px-4 py-3">{row.avgScore}</td>
                              <td className="px-4 py-3">{row.attempts}</td>
                              <td className="px-4 py-3">
                                {(row.avgCorrectRate * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
