"use client";

import { useEffect, useState } from "react";
import {
  defaultStats,
  fetchDashboardStats,
  type DashboardStats,
} from "@/lib/dashboard-stats";
import { DashboardKpiGrid } from "@/components/modules/user/dashboard/DashboardKpiGrid";
import { ExamParticipationChart } from "@/components/modules/user/dashboard/ExamParticipationChart";
import { ExamStatusChart } from "@/components/modules/user/dashboard/ExamStatusChart";
import { PlatformContentChart } from "@/components/modules/user/dashboard/PlatformContentChart";

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((error) => {
        console.error("Failed to fetch dashboard stats:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative z-10 space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform analytics, exam participation, and content metrics
        </p>
      </div>

      <ExamParticipationChart stats={stats} loading={loading} />

      <DashboardKpiGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExamStatusChart stats={stats} loading={loading} />
        <PlatformContentChart stats={stats} loading={loading} />
      </div>
    </div>
  );
}
