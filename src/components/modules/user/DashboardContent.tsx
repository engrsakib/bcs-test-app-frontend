"use client";

import { useEffect, useState } from "react";
import { CardItem } from "@/components/modules/user/CardItem";
import {
  defaultStats,
  fetchDashboardStats,
  type DashboardStats,
} from "@/lib/dashboard-stats";

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
    <div className="relative z-10 p-4 md:p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <CardItem
        title="Total Exams"
        value={stats.totalExams}
        icon="GraduationCap"
        heading="Exam Overview"
        description="Total number of exams available"
        gradientFrom="from-purple-500"
        gradientTo="to-indigo-600"
        href="/dashboard/exam/view-exam"
        loading={loading}
      />
      <CardItem
        title="Completed Exams"
        value={stats.completedExams}
        icon="Trophy"
        heading="Progress"
        description="Exams marked as completed"
        gradientFrom="from-green-500"
        gradientTo="to-emerald-600"
        href="/dashboard/exam/view-exam"
        loading={loading}
      />
      <CardItem
        title="Total Students"
        value={stats.totalStudents}
        icon="Users"
        heading="Student Overview"
        description="Registered students on the platform"
        gradientFrom="from-blue-500"
        gradientTo="to-sky-600"
        href="/dashboard/team/view-student"
        loading={loading}
      />
      <CardItem
        title="Total Questions"
        value={stats.totalQuestions}
        icon="HelpCircle"
        heading="Question Bank"
        description="All questions in the system"
        gradientFrom="from-violet-500"
        gradientTo="to-purple-600"
        href="/dashboard/question/view-question"
        loading={loading}
      />
      <CardItem
        title="Guidelines"
        value={stats.totalGuidelines}
        icon="Book"
        heading="Study Resources"
        description="Helpful materials to prepare better"
        gradientFrom="from-yellow-500"
        gradientTo="to-orange-500"
        href="/dashboard/guideline/view-guideline"
        loading={loading}
      />
      <CardItem
        title="YouTube Videos"
        value={stats.totalYoutubeVideos}
        icon="Video"
        heading="Video Content"
        description="Watch tutorials and lectures"
        gradientFrom="from-red-500"
        gradientTo="to-pink-500"
        href="/dashboard/youtube/view-video"
        loading={loading}
      />
      <CardItem
        title="Rokomari Links"
        value={stats.rokomariBooks}
        icon="Link2"
        heading="Bookstore Links"
        description="Books available on Rokomari"
        gradientFrom="from-cyan-500"
        gradientTo="to-blue-500"
        href="/dashboard/my-book/view-book"
        loading={loading}
      />
      <CardItem
        title="Top Ranking Result"
        value={stats.totalResults}
        icon="FileText"
        heading="Latest Updates"
        description="Check exam results and rankings"
        gradientFrom="from-gray-700"
        gradientTo="to-gray-900"
        href="/dashboard/result/view-result"
        loading={loading}
      />
    </div>
  );
}
