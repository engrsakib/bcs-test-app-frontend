"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats, ExamParticipation } from "@/lib/dashboard-stats";

type ChartRow = ExamParticipation & {
  label: string;
  totalStudents: number;
};

function formatExamLabel(exam: ExamParticipation): string {
  const name =
    exam.exam_name.length > 18
      ? `${exam.exam_name.slice(0, 18)}…`
      : exam.exam_name;
  return `#${exam.exam_number} ${name}`;
}

function ParticipationTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartRow }[];
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-gray-900">{data.exam_name}</p>
      <p className="text-gray-600">Exam #{data.exam_number}</p>
      <p className="mt-1 text-gray-700">
        Participants: <span className="font-medium">{data.participants.toLocaleString()}</span>
      </p>
      <p className="text-gray-700">
        Total Students:{" "}
        <span className="font-medium">{data.totalStudents.toLocaleString()}</span>
      </p>
      <p className="text-indigo-700 font-medium">
        Participation Rate: {data.participationRate.toFixed(2)}%
      </p>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[360px] rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
      <div className="h-6 w-64 bg-gray-200 rounded mb-6" />
      <div className="h-[280px] bg-gray-100 rounded" />
    </div>
  );
}

export function ExamParticipationChart({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) {
  if (loading) {
    return <ChartSkeleton />;
  }

  const chartData: ChartRow[] = stats.examParticipation.map((exam) => ({
    ...exam,
    label: formatExamLabel(exam),
    totalStudents: stats.totalStudents,
  }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Exam Participation
        </h2>
        <p className="mt-2 text-gray-600">
          {stats.totalExams > 0
            ? "Exam records were found, but participation data could not be loaded. Try refreshing the page."
            : "No exam data available yet. Participation metrics will appear once exams are created."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Exam Participation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Participants vs total registered students for recent exams
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="min-w-[640px]"
          role="img"
          aria-label="Exam participation chart showing participants and participation rate by exam"
        >
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart
              data={chartData}
              margin={{ top: 8, right: 24, left: 8, bottom: 48 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={70}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, "auto"]}
              />
              <Tooltip content={<ParticipationTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalStudents"
                name="Total Students"
                fill="#e5e7eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                yAxisId="left"
                dataKey="participants"
                name="Participants"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="participationRate"
                name="Participation Rate (%)"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 3, fill: "#059669" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
