"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  ExternalLink,
  Hash,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { examSolutionProxy } from "@/lib/exam-solution-api";

type ExamSolutionDetails = {
  _id: string;
  id: string;
  exam_solution_number: number;
  title: string;
  description: string;
  status: "active" | "inactive" | "admin_approval";
  thumbnail_url: string;
  exam_solution_url: string;
  createdAt: string;
  updatedAt: string;
};

type ExamSolutionDetailsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: ExamSolutionDetails;
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

export default function ExamSolutionDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const examSolutionNumber = params?.examSolutionNumber as string;

  const [loading, setLoading] = useState(true);
  const [examSolution, setExamSolution] = useState<ExamSolutionDetails | null>(null);
  const [error, setError] = useState("");

  const fetchExamSolutionDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const { ok, data: result } =
        await examSolutionProxy<ExamSolutionDetailsResponse>(`/${examSolutionNumber}`, {
          method: "GET",
        });

      if (!ok) {
        throw new Error(result?.message || "Failed to fetch model test solution details");
      }

      setExamSolution(result.data);
    } catch (error: any) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examSolutionNumber) {
      fetchExamSolutionDetails();
    }
  }, [examSolutionNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg text-teal-700">
          <Loader2 className="animate-spin" size={22} />
          <span className="font-semibold">Loading model test solution details...</span>
        </div>
      </div>
    );
  }

  if (error || !examSolution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Top Actions */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <a
            href={examSolution.exam_solution_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-700"
          >
            <ExternalLink size={18} />
            Open Model Test Solution
          </a>
        </div>

        {/* Hero Section */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="h-full min-h-[280px] bg-gray-100">
              {examSolution.thumbnail_url ? (
                <img
                  src={examSolution.thumbnail_url}
                  alt={examSolution.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-gray-400">
                  No Thumbnail Available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${statusClass(
                    examSolution.status
                  )}`}
                >
                  {formatStatus(examSolution.status)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {examSolution.title}
              </h1>

              <p className="mt-4 text-gray-600 leading-7">
                This model test solution contains structured preparation material and
                guidance for learners. You can preview the main information
                below and open the linked resource for the full content.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-teal-50 p-4">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold">
                    <Hash size={18} />
                    Model Test Solution Number
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    #{examSolution.exam_solution_number}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sky-700 font-semibold">
                    <CalendarDays size={18} />
                    Created At
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {formatDate(examSolution.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold">
                    <CalendarDays size={18} />
                    Updated At
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {formatDate(examSolution.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description + Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 md:p-8 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                <p className="text-sm text-gray-500">
                  Detailed content of this model test solution
                </p>
              </div>
            </div>

            <div
              className="prose max-w-none prose-p:leading-7 prose-li:leading-7"
              dangerouslySetInnerHTML={{ __html: examSolution.description }}
            />
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900">Quick Info</h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">Database ID</p>
                  <p className="mt-1 break-all font-semibold text-gray-800">
                    {examSolution._id}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {formatStatus(examSolution.status)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold">Resource Access</h3>
              <p className="mt-2 text-teal-100 leading-7">
                Open the attached model test solution file or external resource to view
                the full material.
              </p>

              <a
                href={examSolution.exam_solution_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-teal-700 hover:bg-teal-50"
              >
                <ExternalLink size={18} />
                Open Full Model Test Solution
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}