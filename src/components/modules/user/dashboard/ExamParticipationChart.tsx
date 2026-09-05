"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats, ExamParticipation } from "@/lib/dashboard-stats";

type ChartRow = ExamParticipation & {
  totalStudents: number;
  slot: number;
};

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
    <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-2xl shadow-slate-200/50 min-w-[240px]">
      <p className="text-sm font-semibold text-slate-900 leading-snug">
        {data.exam_name}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
            On-time
          </p>
          <p className="text-lg font-semibold tabular-nums text-emerald-700">
            {data.onTimeSubmissions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-lime-600">
            After time
          </p>
          <p className="text-lg font-semibold tabular-nums text-lime-700">
            {data.lateSubmissions.toLocaleString()}
          </p>
        </div>
      </div>
      <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        {data.participants.toLocaleString()} total submissions ·{" "}
        {data.participationRate.toFixed(1)}% of{" "}
        {data.totalStudents.toLocaleString()} students
      </p>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[360px] rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
      <div className="h-5 w-48 bg-slate-100 rounded" />
      <div className="mt-2 h-4 w-64 bg-slate-50 rounded" />
      <div className="mt-8 h-[260px] bg-slate-50 rounded-xl" />
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

  const chartData: ChartRow[] = stats.examParticipation
    .slice(0, 10)
    .map((exam, index) => ({
      ...exam,
      totalStudents: stats.totalStudents,
      slot: index + 1,
    }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <h2 className="text-base font-semibold text-slate-900">
          Submission Timing
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {stats.totalExams > 0
            ? "Participation data could not be loaded. Try refreshing the page."
            : "Metrics will appear once exams are created."}
        </p>
      </div>
    );
  }

  const totalOnTime = chartData.reduce(
    (sum, row) => sum + row.onTimeSubmissions,
    0
  );
  const totalLate = chartData.reduce(
    (sum, row) => sum + row.lateSubmissions,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Submission Timing
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Last 10 exams — on-time vs after-time submissions
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
              On-time
            </p>
            <p className="text-xl font-semibold tabular-nums text-emerald-700">
              {totalOnTime.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-lime-600">
              After time
            </p>
            <p className="text-xl font-semibold tabular-nums text-lime-700">
              {totalLate.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative rounded-xl border border-slate-100 bg-slate-50/40 px-2 pt-4 pb-2 md:px-4"
        role="img"
        aria-label="Line chart of on-time and late submissions for recent exams"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="slot"
              hide
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
              }
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              content={<ParticipationTooltip />}
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="plainline"
              iconSize={12}
              wrapperStyle={{
                fontSize: 12,
                color: "#64748b",
                paddingBottom: 12,
                fontWeight: 500,
              }}
            />
            <Line
              type="monotone"
              dataKey="onTimeSubmissions"
              name="On-time submit"
              stroke="#059669"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#059669",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="lateSubmissions"
              name="Submit after time"
              stroke="#65a30d"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#65a30d",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-slate-400">
          Hover any point to view exam details
        </p>
      </div>
    </div>
  );
}
