"use client";

import { useRouter } from "next/navigation";
import {
  Book,
  FileText,
  GraduationCap,
  HelpCircle,
  Link2,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard-stats";

type NumericStatKey = Exclude<keyof DashboardStats, "examParticipation">;

type KpiItem = {
  title: string;
  value: NumericStatKey;
  icon: React.ReactNode;
  href: string;
};

const KPI_ITEMS: KpiItem[] = [
  {
    title: "Total Students",
    value: "totalStudents",
    icon: <Users className="h-5 w-5 text-blue-600" />,
    href: "/dashboard/team/view-student",
  },
  {
    title: "Total Questions",
    value: "totalQuestions",
    icon: <HelpCircle className="h-5 w-5 text-violet-600" />,
    href: "/dashboard/question/view-question",
  },
  {
    title: "Total Exams",
    value: "totalExams",
    icon: <GraduationCap className="h-5 w-5 text-indigo-600" />,
    href: "/dashboard/exam/view-exam",
  },
  {
    title: "Completed Exams",
    value: "completedExams",
    icon: <Trophy className="h-5 w-5 text-emerald-600" />,
    href: "/dashboard/exam/view-exam",
  },
  {
    title: "Guidelines",
    value: "totalGuidelines",
    icon: <Book className="h-5 w-5 text-amber-600" />,
    href: "/dashboard/guideline/view-guideline",
  },
  {
    title: "YouTube Videos",
    value: "totalYoutubeVideos",
    icon: <Video className="h-5 w-5 text-red-600" />,
    href: "/dashboard/youtube/view-video",
  },
  {
    title: "Rokomari Links",
    value: "rokomariBooks",
    icon: <Link2 className="h-5 w-5 text-cyan-600" />,
    href: "/dashboard/my-book/view-book",
  },
  {
    title: "Results",
    value: "totalResults",
    icon: <FileText className="h-5 w-5 text-gray-600" />,
    href: "/dashboard/result/view-result",
  },
];

function KpiSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="mt-3 h-8 w-16 bg-gray-200 rounded" />
    </div>
  );
}

export function DashboardKpiGrid({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <KpiSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPI_ITEMS.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={() => router.push(item.href)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-left transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500">{item.title}</p>
            {item.icon}
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats[item.value].toLocaleString()}
          </p>
        </button>
      ))}
    </div>
  );
}
