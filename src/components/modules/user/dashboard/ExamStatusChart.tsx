"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboard-stats";

const COLORS = ["#10b981", "#d1d5db"];

function ChartSkeleton() {
  return (
    <div className="h-[320px] rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="mx-auto h-52 w-52 rounded-full bg-gray-100" />
    </div>
  );
}

export function ExamStatusChart({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) {
  if (loading) {
    return <ChartSkeleton />;
  }

  const pendingExams = Math.max(stats.totalExams - stats.completedExams, 0);
  const chartData = [
    { name: "Completed", value: stats.completedExams },
    { name: "Pending", value: pendingExams },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Exam Status</h2>
        <p className="mt-2 text-sm text-gray-500">No exams to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Status</h2>
      <div role="img" aria-label="Donut chart of completed vs pending exams">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
