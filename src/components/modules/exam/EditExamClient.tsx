"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getCookie from "@/util/GetCookie";
import { notify } from "@/lib/toast";
import {
  FaListUl,
  FaCalendarAlt,
  FaClock,
  FaCheckDouble,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { apiUrl } from "@/config/env";
import {
  saveExamDraft,
  loadExamDraft,
  type ExamQuestion,
} from "@/lib/exam-draft-storage";

interface ExamData {
  exam_name: string;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  questions: ExamQuestion[];
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: React.ElementType;
}

const Input: React.FC<InputProps> = ({ label, id, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
      <input
        id={id}
        {...props}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-green-500 focus:border-green-500
          bg-white text-gray-900 ${Icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

export default function UpdateExamClient() {
  const router = useRouter();
  const params = useSearchParams();
  const examNumber = params.get("exam");

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      const res = await fetch(apiUrl(`/exam/${examNumber}`), {
        headers: { Authorization: getCookie("access_token") || "" },
      });

      const json = await res.json();

      if (json.success) {
        setExamData(json.data);
        const draft = loadExamDraft();
        if (draft?.examNumber === examNumber && draft.selectedQuestions?.length) {
          setSelectedQuestions(draft.selectedQuestions);
        } else {
          setSelectedQuestions(json.data.questions);
        }
      }
    } catch (err) {
      console.error("Error loading exam", err);
    }
    setLoading(false);
  };

  const openQuestionSelector = () => {
    if (!examData || !examNumber) return;
    saveExamDraft({
      selectedQuestions,
      examNumber,
      formData: {
        exam_name: examData.exam_name,
        exam_date_time: examData.exam_date_time,
        duration_minutes: String(examData.duration_minutes),
        negative_mark: 0,
      },
    });
    router.push(
      `/dashboard/exam/select-questions?returnTo=${encodeURIComponent(`/dashboard/exam/edit?exam=${examNumber}`)}&mode=edit`,
    );
  };

  const handleUpdate = async () => {
    if (!examData) return;

    setIsUpdating(true);

    const payload = {
      exam_name: examData.exam_name,
      exam_date_time: examData.exam_date_time,
      duration_minutes: examData.duration_minutes,
      total_marks: totalMarks,
      questions: selectedQuestions.map((q) => q._id),
    };

    try {
      const res = await fetch(apiUrl(`/exam/${examNumber}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("access_token") || "",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        notify.success("Updated Successfully!", "The exam has been updated.", {
          duration: 1500,
        });
      } else {
        notify.error("Update Failed", json.message);
      }
    } catch {
      notify.error("Network Error", "Could not update exam.");
    }

    setIsUpdating(false);
  };

  if (loading || !examData) {
    return <p className="p-10 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">Update Exam</h1>
        <p className="text-sm text-gray-600 mb-6">Modify exam details and questions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Exam Name"
            id="examName"
            icon={FaListUl}
            value={examData.exam_name}
            onChange={(e) =>
              setExamData({ ...examData, exam_name: e.target.value })
            }
          />

          <Input
            label="Exam Date & Time"
            id="examDate"
            type="datetime-local"
            icon={FaCalendarAlt}
            value={examData.exam_date_time.slice(0, 16)}
            onChange={(e) =>
              setExamData({ ...examData, exam_date_time: e.target.value })
            }
          />

          <Input
            label="Duration (Minutes)"
            id="duration"
            type="number"
            icon={FaClock}
            value={examData.duration_minutes}
            onChange={(e) =>
              setExamData({
                ...examData,
                duration_minutes: Number(e.target.value),
              })
            }
          />

          <Input
            label="Total Marks (Auto)"
            id="totalMarks"
            type="number"
            icon={FaCheckDouble}
            value={totalMarks}
            disabled
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Selected Questions ({selectedQuestions.length})
            </h3>

            <button
              type="button"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-2.5 rounded-lg hover:from-emerald-700 hover:to-green-700 shadow-md"
              onClick={openQuestionSelector}
            >
              <FaPlus size={14} /> Add Questions
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {selectedQuestions.length === 0 ? (
              <button
                type="button"
                onClick={openQuestionSelector}
                className="w-full p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50"
              >
                <p className="font-medium">No questions selected</p>
                <p className="text-sm mt-1">Click to browse questions</p>
              </button>
            ) : (
              selectedQuestions.map((q, i) => (
                <div
                  key={q._id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {i + 1}. {q.title}
                    </h4>
                    <span className="text-sm text-gray-600">{q.marks} Marks</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = selectedQuestions.filter((x) => x._id !== q._id);
                      setSelectedQuestions(updated);
                      saveExamDraft({
                        selectedQuestions: updated,
                        examNumber: examNumber ?? undefined,
                      });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="mt-8 w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 font-semibold shadow-md"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            "Update Exam"
          )}
        </button>
      </div>
    </div>
  );
}
