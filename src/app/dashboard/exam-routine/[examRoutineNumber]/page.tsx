"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  Tag,
  ExternalLink,
  Hash,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { examRoutineProxy } from "@/lib/exam-routine-api";
import { formatExamRoutineCategory } from "@/lib/exam-routine-categories";

type ExamRoutineDetails = {
  _id: string;
  exam_routine_number: number;
  title: string;
  description: string;
  status: "active" | "inactive" | "admin_approval";
  thumbnail_url: string;
  exam_routine_url: string;
  category: string;
  post_date: string;
  createdAt: string;
  updatedAt: string;
};

type ExamRoutineDetailsResponse = {
  message?: string;
  data: ExamRoutineDetails;
};

const formatStatus = (status: string) => {
  if (status === "active") return "ACTIVE";
  if (status === "admin_approval") return "ADMIN APPROVAL";
  return "INACTIVE";
};

const statusClass = (status: string) => {
  if (status === "active") return "bg-green-100 text-green-700 border-green-200";
  if (status === "admin_approval") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
};

export default function ExamRoutineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const examRoutineNumber = params?.examRoutineNumber as string;

  const [loading, setLoading] = useState(true);
  const [routine, setRoutine] = useState<ExamRoutineDetails | null>(null);
  const [error, setError] = useState("");

  const fetchExamRoutineDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const { ok, data: result } =
        await examRoutineProxy<ExamRoutineDetailsResponse>(
          `/${examRoutineNumber}`,
          { method: "GET" }
        );

      if (!ok) {
        throw new Error(result?.message || "Failed to fetch exam routine details");
      }

      setRoutine(result.data);
    } catch (error: any) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examRoutineNumber) {
      fetchExamRoutineDetails();
    }
  }, [examRoutineNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg text-indigo-700">
          <Loader2 className="animate-spin" size={22} />
          <span className="font-semibold">Loading exam routine details...</span>
        </div>
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600">Failed to load</h2>
            <p className="mt-2 text-gray-500">{error || "No data found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <a
            href={routine.exam_routine_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <ExternalLink size={18} />
            Open Exam Routine
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full min-h-[280px] bg-gray-100">
              {routine.thumbnail_url ? (
                <img
                  src={routine.thumbnail_url}
                  alt={routine.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-gray-400">
                  No Thumbnail Available
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${statusClass(
                    routine.status
                  )}`}
                >
                  {formatStatus(routine.status)}
                </span>
                <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
                  {formatExamRoutineCategory(routine.category)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {routine.title}
              </h1>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                    <Hash size={18} />
                    Routine Number
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    #{routine.exam_routine_number}
                  </p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-violet-700 font-semibold">
                    <Tag size={18} />
                    Category
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {formatExamRoutineCategory(routine.category)}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sky-700 font-semibold">
                    <CalendarDays size={18} />
                    Post Date
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {formatDate(routine.post_date)}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold">
                    <CalendarDays size={18} />
                    Updated At
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {formatDate(routine.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 md:p-8 shadow-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Description</h2>
              <p className="text-sm text-gray-500">
                Detailed content of this exam routine
              </p>
            </div>
          </div>

          <div
            className="prose max-w-none prose-p:leading-7 prose-li:leading-7"
            dangerouslySetInnerHTML={{ __html: routine.description }}
          />
        </div>
      </div>
    </div>
  );
}
