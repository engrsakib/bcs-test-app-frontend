






"use client";



import React, { useEffect, useState, useRef } from "react";
import { 
  Loader2, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft,
  MoreVertical,
  Search,
  Filter
} from "lucide-react";
import { notify } from "@/lib/toast";
import { apiUrl } from "@/config/env";

function MathEditor({ value, onChange, readOnly = false }) {
  const mathEditorRef = useRef(null);

  useEffect(() => {
    const scriptId = "mathlive-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://unpkg.com/mathlive?module";
    script.type = "module";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.MathfieldElement && mathEditorRef.current) {
        clearInterval(checkReady);

        const mathField = mathEditorRef.current;

        const handleChange = (evt) => {
          const newValue = evt.target.getValue
            ? evt.target.getValue()
            : evt.target.value;
          onChange(newValue);
        };

        mathField.addEventListener("input", handleChange);
        mathField.addEventListener("change", handleChange);

        return () => {
          mathField.removeEventListener("input", handleChange);
          mathField.removeEventListener("change", handleChange);
        };
      }
    }, 200);

    return () => clearInterval(checkReady);
  }, [onChange]);

  return (
    <math-field ref={mathEditorRef} readOnly={readOnly}>
      {value}
    </math-field>
  );
}

// ====================== COOKIE HELPER ======================
function getCookie(name) {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

  return null;
}

export default function ViewAllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    category_number: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    category_number: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        const accessToken = getCookie("access_token");
        const res = await fetch(apiUrl("/question-study-topic/dropdown"), {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: accessToken || "",
          },
        });
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setTopics(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch study topics", error);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const buildQuestionQuery = (params) => {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });

    if (params.searchTerm?.trim()) {
      query.set("searchTerm", params.searchTerm.trim());
    }

    if (params.category_number) {
      query.set("category_number", String(params.category_number));
    }

    return query;
  };

  // ====================== FETCH QUESTIONS FROM SERVER ======================
  const fetchQuestions = async (params = appliedFilters) => {
    try {
      setLoading(true);

      const query = buildQuestionQuery(params);
      const accessToken = getCookie("access_token");

      const res = await fetch(`${apiUrl("/question/")}?${query.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: accessToken || "",
        },
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        setQuestions(result.data.data);
        setMeta(result.data.meta);
      } else {
        notify.error("Error", result.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.log("Fetch Failed", error);
      notify.error("Error", "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(appliedFilters);
  }, [appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters({
      ...filters,
      page: 1,
    });
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleTopicFilterChange = (categoryNumber) => {
    const nextFilters = {
      ...filters,
      category_number: categoryNumber,
      page: 1,
    };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
  };

  const clearTopicFilter = () => {
    handleTopicFilterChange("");
  };

  const handlePaginationChange = (updates) => {
    const nextFilters = { ...filters, ...updates };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
  };

  // ====================== DELETE QUESTION ======================
  const handleDelete = async (id) => {
    try {
      const accessToken = getCookie("access_token");

      const res = await fetch(apiUrl(`/question/${id}`), {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: accessToken || "",
        },
      });

      const result = await res.json();

      if (result.success) {
        notify.success("Deleted!", "Question deleted successfully", { duration: 1500 });
        fetchQuestions();
      } else {
        notify.error("Error", result.message || "Delete failed!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      notify.error("Error", "Failed to delete question");
    }
  };

  // ====================== ACTION HANDLERS ======================
  const handleViewQuestion = (q) => {
    setSelectedQuestion(q);
    setViewMode("view");
  };

  const handleEditQuestion = (q) => {
    const categoryId = q.category_id?._id || q.category_id || "";
    setSelectedQuestion({ ...q, category_id: categoryId });
    setViewMode("edit");
  };

  const getTopicName = (q) => {
    if (q.category_id && typeof q.category_id === "object") {
      return q.category_id.name || "—";
    }
    const topic = topics.find((t) => t._id === q.category_id);
    return topic?.name || "—";
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion.category_id) {
      notify.warning("Missing Topic", "Please select a study topic");
      return;
    }

    try {
      setUpdateLoading(true);
      const accessToken = getCookie("access_token");

      const payload = {
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        type: selectedQuestion.type,
        answerType: selectedQuestion.answerType,
        marks: selectedQuestion.marks,
        mathFormula: selectedQuestion.mathFormula,
        answer: selectedQuestion.answer,
        category_id: selectedQuestion.category_id,
      };

      const res = await fetch(apiUrl(`/question/${selectedQuestion.questionId}`), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken || "",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        notify.success("Success!", "Question updated successfully", { duration: 1500 });
        setTimeout(() => {
          setViewMode("list");
          fetchQuestions();
        }, 1500);
      } else {
        notify.error("Error", result.message || "Update failed!");
      }
    } catch (err) {
      console.log("Update failed", err);
      notify.error("Error", "Failed to update question");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ====================== TRUNCATE ======================
  const truncateText = (text, len = 40) =>
    text?.length > len ? text.substring(0, len) + "..." : text;

  // ====================== TYPE COLORS ======================
  const getTypeGradient = (t) =>
    ({
      math: "bg-blue-50 text-blue-700 border border-blue-200",
      general: "bg-green-50 text-green-700 border border-green-200",
      science: "bg-purple-50 text-purple-700 border border-purple-200",
    }[t] || "bg-gray-50 text-gray-700");

  const getAnswerTypeGradient = (t) =>
    ({
      mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
      "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
      written: "bg-orange-50 text-orange-700 border border-orange-200",
    }[t] || "bg-gray-50 text-gray-700");

  // ========================================================================
  // ============================ LIST MODE ================================
  // ========================================================================

  if (viewMode === "list") {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Created Questions</h1>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          {/* Search Bar */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  placeholder="Search by title, description..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter size={18} />
                Filters
              </button>

              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Search size={18} />
                Search
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Question Topic
              </label>
              <select
                value={filters.category_number}
                onChange={(e) => handleTopicFilterChange(e.target.value)}
                disabled={topicsLoading}
                className="w-full sm:max-w-xs border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-60"
              >
                <option value="">
                  {topicsLoading ? "Loading topics..." : "All topics"}
                </option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic.category_number}>
                    {topic.name}
                  </option>
                ))}
              </select>
              {filters.category_number ? (
                <button
                  type="button"
                  onClick={clearTopicFilter}
                  className="text-sm text-green-700 hover:text-green-900 underline"
                >
                  Clear topic filter
                </button>
              ) : null}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                <input
                  type="number"
                  min="1"
                  value={filters.page}
                  onChange={(e) =>
                    handlePaginationChange({ page: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    handlePaginationChange({
                      limit: Number(e.target.value),
                      page: 1,
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handlePaginationChange({ sortBy: e.target.value, page: 1 })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt">Created At</option>
                  <option value="title">Title</option>
                  <option value="marks">Marks</option>
                  <option value="type">Type</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handlePaginationChange({ sortOrder: e.target.value, page: 1 })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* TABLE - No borders except bottom row border */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto min-h-screen pb-32">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Topic</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Answer Type</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Marks</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>


            

      <tbody>
  {loading ? (
    <tr>
      <td colSpan={8} className="text-center py-10">
        <Loader2 className="mx-auto animate-spin text-green-600" size={32} />
      </td>
    </tr>
  ) : questions.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center py-10 text-gray-500">
        No Question is Available
      </td>
    </tr>
  ) : (
    questions.map((q) => (
          <tr key={q._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600">{q.questionId}</td>
                    <td className="p-4 text-gray-800">{truncateText(q.title, 40)}</td>
                    <td className="p-4 text-gray-700 text-sm">{getTopicName(q)}</td>
                    <td className="p-4 text-gray-600 text-sm">{truncateText(q.description, 50)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(q.type)}`}>
                        {q.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
                          q.answerType
                        )}`}
                      >
                        {q.answerType}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700">{q.marks}</td>

                    {/* ACTIONS THREE DOT MENU */}
                    <td className="p-4 relative" ref={openDropdown === q._id ? dropdownRef : null}>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === q._id ? null : q._id)
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdown === q._id && (
                        <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-lg w-44 z-20">
                          <button
                            onClick={() => {
                              handleViewQuestion(q);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
                          >
                            <Eye size={16} />
                            View Question
                          </button>

                          <button
                            onClick={() => {
                              handleEditQuestion(q);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
                          >
                            <Edit size={16} />
                            Edit Question
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(q.questionId);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
          </p>

          <div className="flex gap-3">
            <button
              disabled={meta.page <= 1}
              onClick={() => handlePaginationChange({ page: filters.page - 1 })}
              className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Prev
            </button>
            <button
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
              onClick={() => handlePaginationChange({ page: filters.page + 1 })}
              className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // ============================ VIEW MODE ================================
  // ========================================================================

  if (viewMode === "view" && selectedQuestion) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setViewMode("list")}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Question Details</h1>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Question ID</p>
                <p className="text-lg font-semibold text-gray-800">{selectedQuestion.questionId}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Marks</p>
                <p className="text-lg font-semibold text-gray-800">{selectedQuestion.marks}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-lg text-gray-800">{selectedQuestion.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Study Topic</p>
              <p className="text-lg text-gray-800">{getTopicName(selectedQuestion)}</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Question Type</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
                  {selectedQuestion.type}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Answer Type</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
                  {selectedQuestion.answerType}
                </span>
              </div>
            </div>

            {selectedQuestion.mathFormula && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Math Formula</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <MathEditor value={selectedQuestion.mathFormula} readOnly />
                </div>
              </div>
            )}

            {selectedQuestion.answer?.options && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Answer Options</p>
                <div className="space-y-2">
                  {selectedQuestion.answer.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        String(i + 1) === selectedQuestion.answer.correctAnswer
                          ? "bg-green-50 border-2 border-green-500"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <span className="font-semibold text-gray-700">{i + 1}.</span>
                      <span className="text-gray-800">{opt}</span>
                      {String(i + 1) === selectedQuestion.answer.correctAnswer && (
                        <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct Answer</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // ============================ EDIT MODE ================================
  // ========================================================================

  if (viewMode === "edit" && selectedQuestion) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => !updateLoading && setViewMode("list")}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Question</h1>

          {/* Edit Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
              <input
                type="text"
                value={selectedQuestion.title}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter question title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Description</label>
              <textarea
                rows={4}
                value={selectedQuestion.description}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter question description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                <input
                  type="number"
                  value={selectedQuestion.marks}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      marks: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter marks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type</label>
                <select
                  value={selectedQuestion.answerType}
                  onChange={(e) =>
                    setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="mcq">MCQ</option>
                  <option value="written">Written</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                value={selectedQuestion.type}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="general">General</option>
                <option value="math">Math</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Study Topic *</label>
              <select
                value={selectedQuestion.category_id || ""}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    category_id: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.name} ({topic.category_number})
                  </option>
                ))}
              </select>
            </div>

            {/* Math Formula - Only show if type is "math" */}
            {selectedQuestion.type === "math" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula</label>
                <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
                  <MathEditor
                    value={selectedQuestion.mathFormula || ""}
                    onChange={(v) =>
                      setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
                    }
                  />
                </div>
              </div>
            )}

            {/* Options - Only show if answerType is "mcq" */}
            {selectedQuestion.answerType === "mcq" && selectedQuestion.answer?.options && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>

                <div className="grid grid-cols-2 gap-4">
                  {selectedQuestion.answer.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={opt}
                        onChange={(e) => {
                          const newOpt = [...selectedQuestion.answer.options];
                          newOpt[i] = e.target.value;
                          setSelectedQuestion({
                            ...selectedQuestion,
                            answer: { ...selectedQuestion.answer, options: newOpt },
                          });
                        }}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Option ${i + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOpt = selectedQuestion.answer.options.filter(
                            (_, idx) => idx !== i
                          );
                          setSelectedQuestion({
                            ...selectedQuestion,
                            answer: { ...selectedQuestion.answer, options: newOpt },
                          });
                        }}
                        className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                  <select
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedQuestion.answer.correctAnswer}
                    onChange={(e) =>
                      setSelectedQuestion({
                        ...selectedQuestion,
                        answer: {
                          ...selectedQuestion.answer,
                          correctAnswer: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Choose correct answer</option>
                    {selectedQuestion.answer.options.map((_, i) => (
                      <option key={i} value={String(i + 1)}>
                        Option {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* SAVE BUTTON */}
            <button
              onClick={handleUpdateQuestion}
              disabled={updateLoading}
              className="w-full px-6 py-4 bg-green-800 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}





