"use client";

import { apiUrl } from "@/config/env";
import getCookie from "@/util/GetCookie";
import React, { useState, useEffect } from "react";
import {
  FaListUl,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaCheckDouble,
  FaPlus,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  saveExamDraft,
  loadExamDraft,
  clearExamDraft,
} from "@/lib/exam-draft-storage";
import { parseDateTimeLocalToISO } from "@/lib/exam-datetime";

const negativeMarkOptions = [
  { label: "0.25", value: 0.25 },
  { label: "0.50", value: 0.5 },
];

const Input = ({ label, id, icon, ...props }) => {
  const Icon = icon;
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        )}
        <input
          id={id}
          {...props}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                     bg-white text-gray-900 ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
};

export default function CreateExamForm() {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [formData, setFormData] = useState({
    exam_name: "",
    exam_date_time: "",
    duration_minutes: "",
    negative_mark: 0.25,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const draft = loadExamDraft();
    if (!draft) return;
    if (draft.formData) {
      setFormData((prev) => ({ ...prev, ...draft.formData }));
    }
    if (draft.selectedQuestions?.length) {
      setSelectedQuestions(draft.selectedQuestions);
    }
  }, []);

  const totalMarks = selectedQuestions.reduce(
    (sum, q) => sum + (q.marks || 0),
    0,
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveQuestion = (questionId) => {
    const updated = selectedQuestions.filter((q) => q._id !== questionId);
    setSelectedQuestions(updated);
    saveExamDraft({ formData, selectedQuestions: updated });
  };

  const openQuestionSelector = () => {
    saveExamDraft({ formData, selectedQuestions });
    router.push(
      "/dashboard/exam/select-questions?returnTo=/dashboard/exam/create-exam&mode=create",
    );
  };

  const handleSubmit = async () => {
    if (
      !formData.exam_name ||
      !formData.exam_date_time ||
      !formData.duration_minutes
    ) {
      setSubmitStatus({
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    if (selectedQuestions.length === 0) {
      setSubmitStatus({
        type: "error",
        message: "Please select at least one question",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        exam_name: formData.exam_name,
        exam_date_time: parseDateTimeLocalToISO(formData.exam_date_time),
        duration_minutes: parseInt(formData.duration_minutes),
        total_marks: totalMarks,
        questions: selectedQuestions.map((q) => q._id),
        negative_mark: Number(formData.negative_mark),
      };

      const response = await fetch(apiUrl("/exam/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("access_token") || "",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "Exam created successfully!",
        });
        clearExamDraft();
        setFormData({
          exam_name: "",
          exam_date_time: "",
          duration_minutes: "",
          negative_mark: 0.25,
        });
        router.push("/dashboard/exam/view-exam");
        setSelectedQuestions([]);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to create exam",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Error creating exam. Please try again.",
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        <div className="pb-5 border-b">
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill the form to schedule a new exam
          </p>
        </div>

        {submitStatus && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
          <Input
            label="Exam Name"
            id="exam_name"
            name="exam_name"
            icon={FaListUl}
            placeholder="BCS Mock Test"
            value={formData.exam_name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Exam Date & Time"
            id="exam_date_time"
            name="exam_date_time"
            type="datetime-local"
            icon={FaCalendarAlt}
            value={formData.exam_date_time}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Duration (Minutes)"
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            icon={FaClock}
            placeholder="e.g., 60"
            value={formData.duration_minutes}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Total Marks (Auto-calculated)"
            id="total_marks"
            type="number"
            icon={FaCheckDouble}
            value={totalMarks}
            disabled
          />
        </div>

        <select
          name="negative_mark"
          value={formData.negative_mark}
          onChange={(e) =>
            setFormData({
              ...formData,
              negative_mark: Number(e.target.value),
            })
          }
          className="block w-6/12 px-3 py-2 mt-3 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {negativeMarkOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Selected Questions ({selectedQuestions.length})
              {selectedQuestions.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  · Total: {totalMarks} Marks
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={openQuestionSelector}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <FaPlus size={14} /> Add Questions
            </button>
          </div>

          <div className="mt-4">
            {selectedQuestions.length === 0 ? (
              <button
                type="button"
                onClick={openQuestionSelector}
                className="w-full p-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
              >
                <p className="text-lg font-medium">No questions selected yet</p>
                <p className="mt-1 text-sm">
                  Click here to browse and select questions
                </p>
              </button>
            ) : (
              <div className="space-y-3">
                {selectedQuestions.map((q, index) => (
                  <div
                    key={q._id}
                    className="flex items-center gap-4 p-4 transition-all border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center shrink-0 w-8 h-8 font-semibold text-white bg-green-600 rounded-full">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{q.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full capitalize">
                          {q.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full capitalize">
                          {q.answerType}
                        </span>
                        <span className="ml-auto text-sm font-semibold text-gray-700">
                          {q.marks} Marks
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q._id)}
                      className="shrink-0 p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      title="Remove question"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-5 mt-8 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 text-lg font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Exam..." : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
