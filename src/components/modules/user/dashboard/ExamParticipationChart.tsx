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
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Participants
          </p>
          <p className="text-lg font-semibold tabular-nums text-slate-900">
            {data.participants.toLocaleString()}
          </p>
        </div>
        <div className="h-10 w-px bg-slate-100" />
        <div className="flex-1 text-right">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Rate
          </p>
          <p className="text-lg font-semibold tabular-nums text-emerald-600">
            {data.participationRate.toFixed(1)}%
          </p>
        </div>
      </div>
      <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        of {data.totalStudents.toLocaleString()} registered students
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
          Participation Overview
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {stats.totalExams > 0
            ? "Participation data could not be loaded. Try refreshing the page."
            : "Metrics will appear once exams are created."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Participation Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Last 10 exams — engagement across your student base
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Exams
            </p>
            <p className="text-xl font-semibold tabular-nums text-slate-900">
              {chartData.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Avg. Rate
            </p>
            <p className="text-xl font-semibold tabular-nums text-emerald-600">
              {(
                chartData.reduce((sum, row) => sum + row.participationRate, 0) /
                chartData.length
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative rounded-xl border border-slate-100 bg-slate-50/40 px-2 pt-4 pb-2 md:px-4"
        role="img"
        aria-label="Exam participation chart. Hover bars for exam details."
      >
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            barCategoryGap="22%"
          >
            <defs>
              <linearGradient id="participantFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
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
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
              }
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, "auto"]}
              width={36}
            />
            <Tooltip
              content={<ParticipationTooltip />}
              cursor={{ fill: "rgba(99, 102, 241, 0.08)", radius: 6 }}
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
            <Bar
              yAxisId="left"
              dataKey="participants"
              name="Participants"
              fill="url(#participantFill)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="participationRate"
              name="Participation rate"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#059669",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-slate-400">
          Hover any bar to view exam details
        </p>
      </div>
    </div>
  );
}
