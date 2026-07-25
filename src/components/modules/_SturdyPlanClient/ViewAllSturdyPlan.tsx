"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  ImageOff,
  GripVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { studyPlanProxy } from "@/lib/study-plan-api";
import { formatStudyPlanCategory } from "@/lib/study-plan-categories";
import { confirmAction } from "@/components/ui/confirm-dialog";

type StudyPlanItem = {
  _id: string;
  id: string;
  study_plan_number: number;
  title: string;
  description: string;
  status: "active" | "inactive" | "admin_approval";
  position?: number;
  thumbnail_url: string;
  study_plan_url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type ToggleTarget = {
  study_plan_number: number;
  title: string;
  status: "active" | "inactive";
} | null;

type StudyPlanApiResponse = {
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
    data: StudyPlanItem[];
  };
};

const categoryBadgeClass = (category: string) => {
  switch (category) {
    case "general":
      return "bg-slate-100 text-slate-700";
    case "technical":
      return "bg-cyan-100 text-cyan-700";
    case "exam":
      return "bg-rose-100 text-rose-700";
    case "bcs_preparation":
      return "bg-blue-100 text-blue-700";
    case "primary_teacher_preparation":
      return "bg-violet-100 text-violet-700";
    case "teacher_nibondhon_preparation":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const decodeHtml = (text: string) => {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

function stripHtml(html: string): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

const formatStatus = (status: string) => {
  if (status === "active") return "ACTIVE";
  if (status === "admin_approval") return "ADMIN APPROVAL";
  return "INACTIVE";
};

const statusClass = (status: string) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "admin_approval") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

export default function ViewAllStudyPlanTemplate() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [draggedPlanNumber, setDraggedPlanNumber] = useState<number | null>(
    null,
  );
  const [studyPlans, setStudyPlans] = useState<StudyPlanItem[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const handleDelete = async (studyPlanNumber: number) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      description: "This item will be deleted permanently.",
      variant: "destructive",
      confirmText: "Yes, delete it",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await studyPlanProxy<{ message?: string }>(
        `/${studyPlanNumber}`,
        { method: "DELETE" },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to delete item");
      }

      notify.success("Deleted", result?.message || "Item deleted successfully");

      fetchStudyPlans();
    } catch (error: any) {
      notify.error("Delete Failed", error?.message || "Something went wrong");
    }
  };

  const handleToggleStatus = async (item: StudyPlanItem) => {
    const confirmed = await confirmAction({
      title: "Change Status?",
      description: `This will toggle the status of "${item.title}".`,
      confirmText: item.status === "active" ? "Make Inactive" : "Make Active",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await studyPlanProxy<{
        message?: string;
        data?: { status: StudyPlanItem["status"] };
      }>(`/${item.study_plan_number}`, { method: "PATCH" });

      if (!ok) {
        throw new Error(result?.message || "Failed to toggle status");
      }

      notify.success("Updated", result?.message || "Status updated successfully");

      setStudyPlans((prev) =>
        prev.map((p) =>
          p.study_plan_number === item.study_plan_number
            ? { ...p, status: result.data?.status ?? p.status }
            : p,
        ),
      );
    } catch (error: any) {
      notify.error("Failed", error?.message || "Something went wrong");
    }
  };

  const fetchStudyPlans = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        searchTerm,
      });

      const { ok, data: result } = await studyPlanProxy<StudyPlanApiResponse>(
        `?${params.toString()}`,
        { method: "GET" },
      );

      if (!ok) {
        throw new Error(result.message || "Failed to fetch study plans");
      }

      setStudyPlans(result.data.data);
      setMeta(result.data.meta);
    } catch (error) {
      console.error("Fetch study plan error:", error);
      setStudyPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const buildReorderPayload = (items: StudyPlanItem[]) => {
    const pageOffset = (page - 1) * limit;

    return items.map((item, index) => ({
      id: item.study_plan_number,
      position: pageOffset + index,
    }));
  };

  const saveStudyPlanOrder = async (
    updatedPlans: StudyPlanItem[],
    activeItemId: string,
  ) => {
    const previousPlans = studyPlans;

    setStudyPlans(updatedPlans);
    setReorderingId(activeItemId);

    try {
      const { ok, data: result } = await studyPlanProxy<{ message?: string }>(
        "/reorder",
        {
          method: "PATCH",
          body: JSON.stringify({
            items: buildReorderPayload(updatedPlans),
          }),
        },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      notify.success(
        "Order updated successfully",
        result?.message || "Study plan sequence saved",
      );

      fetchStudyPlans();
    } catch (error: any) {
      setStudyPlans(previousPlans);
      notify.error(
        "Order Update Failed",
        error?.message || "Something went wrong",
      );
    } finally {
      setReorderingId(null);
      setDraggedPlanNumber(null);
    }
  };

  const moveStudyPlan = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const updatedPlans = [...studyPlans];
    const [movedItem] = updatedPlans.splice(fromIndex, 1);
    updatedPlans.splice(toIndex, 0, movedItem);

    saveStudyPlanOrder(updatedPlans, movedItem._id);
  };

  const handlePositionChange = (item: StudyPlanItem, nextIndex: number) => {
    const currentIndex = studyPlans.findIndex((plan) => plan._id === item._id);
    moveStudyPlan(currentIndex, nextIndex);
  };

  const handleDrop = (targetItem: StudyPlanItem) => {
    const currentIndex = studyPlans.findIndex(
      (plan) => plan.study_plan_number === draggedPlanNumber,
    );
    const nextIndex = studyPlans.findIndex((plan) => plan._id === targetItem._id);

    moveStudyPlan(currentIndex, nextIndex);
  };

  useEffect(() => {
    fetchStudyPlans();
  }, [page, limit, searchTerm]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < meta.totalPage) setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-emerald-50 p-6">
      <div className="mb-6 rounded-2xl bg-linear-to-r from-teal-600 to-emerald-600 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">All Study Plans</h1>
        <p className="text-teal-100">Browse and manage study plans</p>
      </div>

      <div className="space-y-4 rounded-xl bg-white p-5 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border px-3 md:col-span-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by title"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full py-3 outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700"
          >
            Search
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-teal-700"
          >
            <Filter size={18} />
            Pagination
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-xl border bg-gray-50 p-4 md:grid-cols-3">
            <div>
              <label className="font-semibold">Page</label>
              <input
                type="number"
                min={1}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="font-semibold">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border p-3"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">Plan No</th>
                <th className="py-3 px-4 text-left">Study Plan</th>
                <th className="py-3 px-4 text-center">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">File</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10">
                    <div className="flex items-center justify-center gap-2 text-teal-600">
                      <Loader2 className="animate-spin" size={20} />
                      Loading study plans...
                    </div>
                  </td>
                </tr>
              ) : studyPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No study plans found
                  </td>
                </tr>
              ) : (
                studyPlans.map((item, index) => (
                  <tr
                    key={item._id}
                    draggable={!reorderingId}
                    onDragStart={() =>
                      setDraggedPlanNumber(item.study_plan_number)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(item)}
                    onDragEnd={() => setDraggedPlanNumber(null)}
                    className={`border-b align-top transition-colors ${
                      draggedPlanNumber === item.study_plan_number
                        ? "bg-teal-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <GripVertical size={16} className="text-gray-400" />
                        <select
                          value={index}
                          disabled={!!reorderingId}
                          onChange={(e) =>
                            handlePositionChange(item, Number(e.target.value))
                          }
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none transition focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {studyPlans.map((plan, optionIndex) => (
                            <option key={plan._id} value={optionIndex}>
                              {(page - 1) * limit + optionIndex + 1}
                            </option>
                          ))}
                        </select>
                        {reorderingId === item._id && (
                          <Loader2
                            className="animate-spin text-teal-600"
                            size={16}
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-semibold text-gray-700">
                      #{item.study_plan_number}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-24 overflow-hidden rounded-lg border bg-gray-100 shrink-0">
                          {item.thumbnail_url?.trim() &&
                          !brokenImages[item._id] ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={() =>
                                setBrokenImages((prev) => ({
                                  ...prev,
                                  [item._id]: true,
                                }))
                              }
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                              <ImageOff size={18} />
                              <span className="mt-1 text-[10px] font-medium">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 leading-snug">
                          <h3 className="text-sm font-semibold text-gray-800">
                            {item.title.split(" ").slice(0, 4).join(" ")}
                            {item.title.split(" ").length > 10 && "..."}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {decodeHtml(stripHtml(item.description))
                              .split(" ")
                              .slice(0, 6)
                              .join(" ")}
                            ...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex max-w-[180px] items-center justify-center rounded-full px-3 py-1 text-sm font-medium wrap-break-word ${categoryBadgeClass(
                          item.category,
                        )}`}
                      >
                        {formatStudyPlanCategory(item.category)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                          item.status,
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <a
                        href={item.study_plan_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sky-700 hover:bg-sky-200"
                      >
                        <ExternalLink size={16} />
                        Open
                      </a>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/sturdy-plan/${item.study_plan_number}`,
                            )
                          }
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Eye size={18} />
                        </button>

                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={item.status === "active"}
                            onChange={() => handleToggleStatus(item)}
                            className="peer sr-only"
                          />

                          <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-teal-600 peer-checked:after:translate-x-full"></div>
                        </label>

                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/sturdy-plan/edit/${item.study_plan_number}`,
                            )
                          }
                          className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.study_plan_number)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-gray-600">
            Showing {studyPlans.length} of {meta.total} results
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="rounded-lg border p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="rounded-lg bg-teal-600 px-4 py-2 text-white">
              {meta.page}
            </span>

            <button
              onClick={handleNextPage}
              disabled={page >= meta.totalPage}
              className="rounded-lg border p-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
