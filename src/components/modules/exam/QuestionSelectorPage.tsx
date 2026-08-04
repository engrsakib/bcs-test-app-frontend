"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { apiUrl } from "@/config/env";
import getCookie from "@/util/GetCookie";
import {
  consumePendingExamQuestion,
  loadExamDraft,
  updateSelectedQuestions,
  type ExamQuestion,
} from "@/lib/exam-draft-storage";
import QuestionCard from "./QuestionCard";

const PAGE_LIMIT = 9;

type StudyTopicOption = {
  _id: string;
  name: string;
  category_number: number;
  type?: string;
};

export default function QuestionSelectorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo =
    searchParams.get("returnTo") ?? "/dashboard/exam/create-exam";
  const mode = searchParams.get("mode") ?? "create";

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [selected, setSelected] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryNumber, setCategoryNumber] = useState("");
  const [topics, setTopics] = useState<StudyTopicOption[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const draft = loadExamDraft();
    let initialSelected = draft?.selectedQuestions ?? [];

    const pendingQuestion = consumePendingExamQuestion();
    if (
      pendingQuestion &&
      !initialSelected.some((q) => q._id === pendingQuestion._id)
    ) {
      initialSelected = [...initialSelected, pendingQuestion];
      updateSelectedQuestions(initialSelected);
    }

    if (initialSelected.length) {
      setSelected(initialSelected);
    }
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        const response = await fetch(apiUrl("/question-study-topic/dropdown"), {
          headers: { Authorization: getCookie("access_token") || "" },
        });
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTopics(result.data);
        }
      } catch (error) {
        console.error("Error fetching study topics:", error);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const fetchQuestions = useCallback(
    async (currentPage: number, search: string, topicNumber: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_LIMIT),
        });
        if (search.trim()) params.set("searchTerm", search.trim());
        if (topicNumber) params.set("category_number", topicNumber);

        const response = await fetch(`${apiUrl("/question/")}?${params}`, {
          headers: { Authorization: getCookie("access_token") || "" },
          cache: "no-store",
        });
        const result = await response.json();

        if (result.success) {
          setQuestions(result.data.data);
          setTotalPages(
            Math.max(1, Math.ceil(result.data.meta.total / PAGE_LIMIT)),
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchQuestions(page, searchQuery, categoryNumber);
  }, [page, searchQuery, categoryNumber, fetchQuestions]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleTopicFilterChange = (value: string) => {
    setCategoryNumber(value);
    setPage(1);
  };

  const clearTopicFilter = () => handleTopicFilterChange("");

  const activeTopic = topics.find(
    (topic) => String(topic.category_number) === categoryNumber,
  );

  const toggleQuestion = (question: ExamQuestion) => {
    setSelected((prev) => {
      const exists = prev.some((q) => q._id === question._id);
      return exists
        ? prev.filter((q) => q._id !== question._id)
        : [...prev, question];
    });
  };

  const selectAllOnPage = () => {
    setSelected((prev) => {
      const merged = [...prev];
      for (const q of questions) {
        if (!merged.some((item) => item._id === q._id)) {
          merged.push(q);
        }
      }
      return merged;
    });
  };

  const clearSelection = () => setSelected([]);

  const totalMarks = selected.reduce((sum, q) => sum + (q.marks || 0), 0);

  const handleSave = () => {
    updateSelectedQuestions(selected);
    router.push(returnTo);
  };

  const handleBack = () => router.push(returnTo);

  const handleCreateQuestion = () => {
    updateSelectedQuestions(selected);
    const currentUrl = `/dashboard/exam/select-questions?returnTo=${encodeURIComponent(returnTo)}&mode=${mode}`;
    router.push(
      `/dashboard/question/create-question?returnTo=${encodeURIComponent(currentUrl)}`,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <FaArrowLeft size={14} />
              Back to {mode === "edit" ? "Edit Exam" : "Create Exam"}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Select Questions</h1>
              <p className="mt-1 text-emerald-100 text-sm">
                Browse, search, and pick questions for your exam
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/20 text-sm font-semibold">
                {selected.length} selected
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/20 text-sm font-semibold">
                {totalMarks} marks
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Search, filter & actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:w-72 shrink-0">
              <div className="relative flex-1">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
                <select
                  value={categoryNumber}
                  onChange={(e) => handleTopicFilterChange(e.target.value)}
                  disabled={topicsLoading}
                  className="w-full appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-60"
                >
                  <option value="">
                    {topicsLoading ? "Loading topics..." : "All question topics"}
                  </option>
                  {topics.map((topic) => (
                    <option
                      key={topic._id}
                      value={String(topic.category_number)}
                    >
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCreateQuestion}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <FaPlus size={12} /> Create New Question
              </button>
              <button
                type="button"
                onClick={selectAllOnPage}
                disabled={loading || questions.length === 0}
                className="px-4 py-2.5 text-sm font-medium border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 disabled:opacity-50 transition-colors"
              >
                Select page
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={selected.length === 0}
                className="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>

          {(categoryNumber || searchQuery.trim()) && (
            <div className="px-4 py-3 bg-emerald-50/70 border-t border-emerald-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Active filters
              </span>
              {searchQuery.trim() ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs text-gray-700">
                  Search: &quot;{searchQuery.trim()}&quot;
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Clear search"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              ) : null}
              {activeTopic ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs text-gray-700">
                  Topic: {activeTopic.name}
                  <button
                    type="button"
                    onClick={clearTopicFilter}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Clear topic filter"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Question grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 min-h-[320px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p className="text-lg font-medium">No questions found</p>
              <p className="mt-1 text-sm">
                {categoryNumber || searchQuery.trim()
                  ? "Try adjusting your search or topic filter"
                  : "Create a question to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  isSelected={selected.some((s) => s._id === q._id)}
                  onToggle={toggleQuestion}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && questions.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaChevronLeft size={12} /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {selected.length === 0
              ? "No questions selected yet"
              : `${selected.length} question${selected.length !== 1 ? "s" : ""} · ${totalMarks} total marks`}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-md"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
