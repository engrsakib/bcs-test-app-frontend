"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { confirmAction } from "@/components/ui/confirm-dialog";
import { questionStudyTopicProxy } from "@/lib/question-study-topic-api";
import { useStudyTopicTypes } from "@/hooks/useStudyTopicTypes";

type StudyTopicItem = {
  _id: string;
  category_number: number;
  name: string;
  type: string;
  position?: number;
  createdAt?: string;
  updatedAt?: string;
};

type StudyTopicApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: StudyTopicItem[];
  };
};

export default function ViewAllStudyTopic() {
  const router = useRouter();
  const { options: typeOptions, getLabel } = useStudyTopicTypes();

  const [topics, setTopics] = useState<StudyTopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [draggedCategoryNumber, setDraggedCategoryNumber] = useState<
    number | null
  >(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        searchTerm,
      });

      if (typeFilter) {
        params.set("type", typeFilter);
      }

      const { ok, data: result } =
        await questionStudyTopicProxy<StudyTopicApiResponse>(
          `?${params.toString()}`,
          { method: "GET" }
        );

      if (!ok) {
        throw new Error(result.message || "Failed to fetch study topics");
      }

      setTopics(result.data.data);
      setMeta(result.data.meta);
    } catch (err) {
      console.error(err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [page, limit, searchTerm, typeFilter]);

  const handleSearchClick = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const buildReorderPayload = (items: StudyTopicItem[]) => {
    const pageOffset = (page - 1) * limit;

    return items.map((item, index) => ({
      id: item.category_number,
      position: pageOffset + index,
    }));
  };

  const saveTopicOrder = async (
    updatedTopics: StudyTopicItem[],
    activeItemId: string
  ) => {
    const previousTopics = topics;

    setTopics(updatedTopics);
    setReorderingId(activeItemId);

    try {
      const { ok, data: result } = await questionStudyTopicProxy<{
        message?: string;
      }>("/reorder", {
        method: "PATCH",
        body: JSON.stringify({ items: buildReorderPayload(updatedTopics) }),
      });

      if (!ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      notify.success(
        "Order updated successfully",
        result?.message || "Topic sequence saved"
      );

      fetchTopics();
    } catch (error: unknown) {
      setTopics(previousTopics);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Order Update Failed", message);
    } finally {
      setReorderingId(null);
      setDraggedCategoryNumber(null);
    }
  };

  const moveTopic = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const updatedTopics = [...topics];
    const [movedItem] = updatedTopics.splice(fromIndex, 1);
    updatedTopics.splice(toIndex, 0, movedItem);

    saveTopicOrder(updatedTopics, movedItem._id);
  };

  const handlePositionChange = (item: StudyTopicItem, nextIndex: number) => {
    const currentIndex = topics.findIndex((topic) => topic._id === item._id);
    moveTopic(currentIndex, nextIndex);
  };

  const handleDrop = (targetItem: StudyTopicItem) => {
    const currentIndex = topics.findIndex(
      (topic) => topic.category_number === draggedCategoryNumber
    );
    const nextIndex = topics.findIndex(
      (topic) => topic._id === targetItem._id
    );

    moveTopic(currentIndex, nextIndex);
  };

  const deleteTopic = async (categoryNumber: number) => {
    const confirmed = await confirmAction({
      title: "Delete?",
      description: "Do you want to delete this study topic?",
      variant: "destructive",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await questionStudyTopicProxy<{
        message?: string;
      }>(`/${categoryNumber}`, { method: "DELETE" });

      if (!ok) {
        throw new Error(result?.message || "Failed to delete study topic");
      }

      notify.success("Deleted!", result?.message || "Study topic deleted");
      fetchTopics();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Delete Failed", message);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Question Study Topics</h1>
          <p className="text-indigo-100">
            Manage categories before creating questions. Category number is
            immutable.
          </p>
        </div>
        <Link
          href="/dashboard/question/question-study-topic/create"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-50"
        >
          <Plus size={18} />
          Create Topic
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2 border rounded-xl px-3 md:col-span-2">
            <Search />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="py-3 outline-none w-full"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-xl px-3 py-3"
          >
            <option value="">All types</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearchClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold"
          >
            Search
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-indigo-700 font-semibold"
          >
            <Filter size={18} />
            Pagination
            {showFilters ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="border rounded-xl p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold">Page</label>
              <input
                type="number"
                min={1}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">Limit</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full border rounded-xl p-3 mt-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No study topics found.</p>
            <Link
              href="/dashboard/question/question-study-topic/create"
              className="text-indigo-600 hover:underline mt-2 inline-block"
            >
              Create your first topic
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Category Number</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((item, index) => (
                  <tr
                    key={item._id}
                    draggable
                    onDragStart={() =>
                      setDraggedCategoryNumber(item.category_number)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(item)}
                    className={`border-b hover:bg-gray-50 ${
                      reorderingId === item._id ? "opacity-60" : ""
                    }`}
                  >
                    <td className="p-3 text-gray-400 cursor-grab">
                      <GripVertical size={18} />
                    </td>
                    <td className="p-3">
                      <select
                        value={index}
                        onChange={(e) =>
                          handlePositionChange(item, Number(e.target.value))
                        }
                        className="border rounded-lg px-2 py-1 text-sm"
                        disabled={reorderingId === item._id}
                      >
                        {topics.map((_, i) => (
                          <option key={i} value={i}>
                            {i + 1 + (page - 1) * limit}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 font-mono text-sm text-gray-600">
                      {item.category_number}
                    </td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 capitalize">
                      {getLabel(item.type)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/question/question-study-topic/edit/${item.category_number}`
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTopic(item.category_number)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && topics.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Showing page {meta.page} of {meta.totalPage} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(meta.totalPage, p + 1))
                }
                disabled={page >= meta.totalPage}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
