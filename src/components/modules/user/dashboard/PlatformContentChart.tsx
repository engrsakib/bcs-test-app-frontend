"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboard-stats";

function ChartSkeleton() {
  return (
    <div className="h-[320px] rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
      <div className="h-[240px] bg-gray-100 rounded" />
    </div>
  );
}

export function PlatformContentChart({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) {
  if (loading) {
    return <ChartSkeleton />;
  }

  const chartData = [
    { name: "Guidelines", value: stats.totalGuidelines },
    { name: "YouTube", value: stats.totalYoutubeVideos },
    { name: "Rokomari", value: stats.rokomariBooks },
    { name: "Results", value: stats.totalResults },
  ];

  const hasData = chartData.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Platform Content
        </h2>
        <p className="mt-2 text-sm text-gray-500">No content data to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Platform Content
      </h2>
      <div
        role="img"
        aria-label="Bar chart of platform content counts"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), "Count"]}
            />
            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
