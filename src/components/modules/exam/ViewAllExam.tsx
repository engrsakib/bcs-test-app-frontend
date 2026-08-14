



"use client";

import { ENV } from "@/config/env";
import getCookie from "@/util/GetCookie";
import { ChevronLeft, ChevronRight, ToggleRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { notify } from "@/lib/toast";
import { confirmAction } from "@/components/ui/confirm-dialog";
import { formatExamDateTime } from "@/lib/exam-datetime";

function isExamStartTimePassed(examDateTime: string): boolean {
  const time = new Date(examDateTime).getTime();
  return !Number.isNaN(time) && time <= Date.now();
}

function getExamStatus(exam: {
  is_completed: boolean;
  is_started: boolean;
  is_published: boolean;
  is_practice_mode?: boolean;
  results_published?: boolean;
  exam_date_time: string;
}) {
  if (exam.is_practice_mode) {
    return { label: "Practice", className: "bg-purple-600 text-white" };
  }

  if (exam.is_completed && !exam.results_published) {
    return { label: "Finalizing", className: "bg-amber-600 text-white" };
  }

  if (exam.is_completed) {
    return { label: "Completed", className: "bg-green-600 text-white" };
  }

  if (exam.is_started) {
    return { label: "Live", className: "bg-yellow-500 text-white" };
  }

  if (isExamStartTimePassed(exam.exam_date_time)) {
    return { label: "Starting…", className: "bg-orange-500 text-white" };
  }

  if (exam.is_published) {
    return { label: "Scheduled", className: "bg-blue-600 text-white" };
  }

  return { label: "Draft", className: "bg-gray-500 text-white" };
}

interface ExamStatusModalExam {
  _id?: string;
  exam_number: number;
  exam_name?: string;
  is_published: boolean;
  is_started: boolean;
  is_completed: boolean;
  is_practice_mode?: boolean;
  exam_date_time?: string;
}

// -----------------------------------------------------
// Toggle Component
// -----------------------------------------------------
const Toggle = ({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={() => onChange(!enabled)}
    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition shrink-0 ${
      enabled ? "bg-green-500" : "bg-gray-300"
    }`}
  >
    <span
      aria-hidden="true"
      className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default function ExamListPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // console.log("SearchTerm",searchTerm)

  const limit = 10;

  // Modal States
  const [selectedExam, setSelectedExam] = useState<ExamStatusModalExam | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();



  // -----------------------------------------------------
  // Fetch Exams
  // -----------------------------------------------------
  useEffect(() => {
    fetchExams(page, searchTerm);

    if (showModal) {
      return;
    }

    const refreshInterval = setInterval(() => {
      fetchExams(page, searchTerm);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [page, searchTerm, showModal]);

  const handleCreateExam = () => {
  router.push("/dashboard/exam/view-exam");
};

  const fetchExams = async (currentPage: number, search: string) => {
    setLoading(true);

    try {
      const url = `${ENV.BASE_URL}/exam?page=${currentPage}&limit=${limit}&searchTerm=${search}`;
      const response = await fetch(url, {
        headers: { Authorization: getCookie("access_token") || "" },
      });

      const result = await response.json();

      if (result.success) {
        setExams(result.data.data);
        setTotalPages(result.data.meta.totalPage);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }

    setLoading(false);
  };

  // SEARCH
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchExams(1, value);
  };

  // PAGINATION
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchExams(newPage, searchTerm);
  };

  // DELETE
  const handleDelete = async (examNumber: string) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      description: "This exam will be permanently deleted!",
      variant: "destructive",
      confirmText: "Yes, delete it",
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`${ENV.BASE_URL}/exam/${examNumber}`, {
        method: "DELETE",
        headers: { Authorization: getCookie("access_token") || "" },
      });

      const result = await response.json();

      if (result.success) {
        notify.success("Deleted!", undefined, { duration: 1500 });

        fetchExams(page, searchTerm);
      }
    } catch (error) {
      notify.error("Delete failed");
    }
  };

  // OPEN MODAL
  const openStatusModal = (exam: ExamStatusModalExam) => {
    setSelectedExam({
      ...exam,
      is_published: Boolean(exam.is_published),
      is_started: Boolean(exam.is_started),
      is_completed: Boolean(exam.is_completed),
      is_practice_mode: Boolean(exam.is_practice_mode),
    });
    setShowModal(true);
  };

  const updateExamStatusField = (
    field: "is_published" | "is_started" | "is_completed" | "is_practice_mode",
    value: boolean,
  ) => {
    setSelectedExam((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // UPDATE STATUS API
  const updateStatus = async () => {
    if (!selectedExam) return;

    const payload = {
      is_published: Boolean(selectedExam.is_published),
      is_started: Boolean(selectedExam.is_started),
      is_completed: Boolean(selectedExam.is_completed),
      is_practice_mode: Boolean(selectedExam.is_practice_mode),
    };

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/exam/${selectedExam.exam_number}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("access_token") || "",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.success) {
        notify.success("Status Updated!", undefined, { duration: 1500 });
        setShowModal(false);
        setSelectedExam(null);
        fetchExams(page, searchTerm);
        return;
      }

      notify.error(result.message || "Failed to update exam status.");
    } catch (error) {
      notify.error("Update Failed!");
    }
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Exam Management
              </h1>
              <p className="text-gray-600">Manage all your exams</p>
            </div>

            <Link href={"/dashboard/exam/create-exam"}>
              <button 
              
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700">
                <FaPlus /> Create Exam
              </button>
            </Link>
          </div>

          {/* SEARCH */}
          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Search exams..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {!loading ? (
            <>
              <table className="w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Exam Number</th>
                    <th className="px-6 py-4 text-left">Exam Name</th>
                    <th className="px-6 py-4 text-left">Date & Time</th>
                    <th className="px-6 py-4 text-left">Duration</th>
                    <th className="px-6 py-4 text-left">Marks</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && exams.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        No Exam Data Available
                      </td>
                    </tr>
                  )}

                  {exams.map((exam) => (
                    <tr key={exam._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{exam.exam_number}</td>
                      <td className="px-6 py-4 font-semibold">
                        {exam.exam_name}
                      </td>
                      <td className="px-6 py-4">
                        {formatExamDateTime(exam.exam_date_time)}
                      </td>
                      <td className="px-6 py-4">
                        {exam.duration_minutes} min
                      </td>
                      <td className="px-6 py-4">{exam.total_marks}</td>

                      {/* Status Logic */}
                      <td className="px-6 py-4">
                        {(() => {
                          const status = getExamStatus(exam);
                          return (
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${status.className}`}
                            >
                              {status.label}
                            </span>
                          );
                        })()}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="px-6 py-4 text-center flex gap-3 justify-center">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          onClick={() =>
                            (window.location.href = `/dashboard/exam/details?exam=${exam.exam_number}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          onClick={() =>
                            (window.location.href = `/dashboard/exam/edit?exam=${exam.exam_number}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          onClick={() => handleDelete(exam.exam_number)}
                        >
                          <FaTrash />
                        </button>

                        <button
                          onClick={() => openStatusModal(exam)}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <ToggleRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="flex justify-between p-4 bg-gray-50 border-t">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-7 text-white  bg-green-600 py-2 border rounded disabled:opacity-50"
                >
                  <ChevronLeft />
                </button>

                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-7 bg-green-600 text-white py-2  border rounded disabled:opacity-50"
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin border-b-2 border-green-600 h-10 w-10 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedExam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Update Exam Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Manual changes are saved immediately and will not be overwritten
              by the automatic scheduler.
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-medium">Published</span>
                <Toggle
                  label="Published"
                  enabled={selectedExam.is_published}
                  onChange={(value) =>
                    updateExamStatusField("is_published", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-medium">Started</span>
                <Toggle
                  label="Started"
                  enabled={selectedExam.is_started}
                  onChange={(value) =>
                    updateExamStatusField("is_started", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-medium">Completed</span>
                <Toggle
                  label="Completed"
                  enabled={selectedExam.is_completed}
                  onChange={(value) =>
                    updateExamStatusField("is_completed", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-lg font-medium">Test Mode</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Practice mode. Auto-enables 360 seconds after exam
                    completion if left off.
                  </p>
                </div>
                <Toggle
                  label="Test Mode"
                  enabled={Boolean(selectedExam.is_practice_mode)}
                  onChange={(value) =>
                    updateExamStatusField("is_practice_mode", value)
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedExam(null);
                }}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
