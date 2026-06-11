"use client";

import { FaPlus, FaTimes } from "react-icons/fa";
import type { ExamQuestion } from "@/lib/exam-draft-storage";

const typeColors: Record<string, string> = {
  math: "bg-purple-100 text-purple-800",
  general: "bg-blue-100 text-blue-800",
  science: "bg-green-100 text-green-800",
};

const answerColors: Record<string, string> = {
  mcq: "bg-indigo-100 text-indigo-800",
  written: "bg-orange-100 text-orange-800",
};

interface QuestionCardProps {
  question: ExamQuestion;
  isSelected: boolean;
  onToggle: (question: ExamQuestion) => void;
}

export default function QuestionCard({
  question,
  isSelected,
  onToggle,
}: QuestionCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(question)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(question);
        }
      }}
      className={`p-4 border rounded-xl transition-all cursor-pointer ${
        isSelected
          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md"
          : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="flex-1 text-sm font-semibold text-gray-800 line-clamp-2">
          {question.title}
        </h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(question);
          }}
          aria-label={isSelected ? "Remove from selection" : "Add to selection"}
          className={`shrink-0 p-2 rounded-full transition-colors ${
            isSelected
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isSelected ? <FaTimes size={12} /> : <FaPlus size={12} />}
        </button>
      </div>

      {question.description ? (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">
          {question.description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span
          className={`px-2 py-0.5 text-xs rounded-full capitalize ${
            typeColors[question.type] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {question.type}
        </span>
        <span
          className={`px-2 py-0.5 text-xs rounded-full capitalize ${
            answerColors[question.answerType] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {question.answerType}
        </span>
        <span className="ml-auto text-sm font-bold text-gray-700">
          {question.marks} Marks
        </span>
      </div>
    </div>
  );
}
