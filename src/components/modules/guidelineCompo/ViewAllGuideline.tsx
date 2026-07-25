"use client";

import React, { useState, useEffect } from "react";
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
  GripVertical,
  Loader2,
} from "lucide-react";

import { notify } from "@/lib/toast";
import { confirmAction } from "@/components/ui/confirm-dialog";
import { guidelineProxy } from "@/lib/guideline-api";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

type GuidelineItem = {
  _id: string;
  guideline_number: number;
  title: string;
  category: string;
  description: string;
  status: "active" | "inactive" | "admin_approval";
  position?: number;
  thumbnail_url?: string;
};

type GuidelineApiResponse = {
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
    data: GuidelineItem[];
  };
};

export default function ViewAllGuideline() {
  const router = useRouter();

  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [draggedGuidelineNumber, setDraggedGuidelineNumber] = useState<
    number | null
  >(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        searchTerm,
      });

      const { ok, data: result } = await guidelineProxy<GuidelineApiResponse>(
        `?${params.toString()}`,
        { method: "GET" },
      );

      if (!ok) {
        throw new Error(result.message || "Failed to fetch guidelines");
      }

      setGuidelines(result.data.data);
      setMeta(result.data.meta);
    } catch (err) {
      console.error(err);
      setGuidelines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidelines();
  }, [page, limit, searchTerm]);

  const handleSearchClick = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const buildReorderPayload = (items: GuidelineItem[]) => {
    const pageOffset = (page - 1) * limit;

    return items.map((item, index) => ({
      id: item.guideline_number,
      position: pageOffset + index,
    }));
  };

  const saveGuidelineOrder = async (
    updatedGuidelines: GuidelineItem[],
    activeItemId: string,
  ) => {
    const previousGuidelines = guidelines;

    setGuidelines(updatedGuidelines);
    setReorderingId(activeItemId);

    try {
      const { ok, data: result } = await guidelineProxy<{ message?: string }>(
        "/reorder",
        {
          method: "PATCH",
          body: JSON.stringify({
            items: buildReorderPayload(updatedGuidelines),
          }),
        },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      notify.success(
        "Order updated successfully",
        result?.message || "Guideline sequence saved",
      );

      fetchGuidelines();
    } catch (error: unknown) {
      setGuidelines(previousGuidelines);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Order Update Failed", message);
    } finally {
      setReorderingId(null);
      setDraggedGuidelineNumber(null);
    }
  };

  const moveGuideline = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const updatedGuidelines = [...guidelines];
    const [movedItem] = updatedGuidelines.splice(fromIndex, 1);
    updatedGuidelines.splice(toIndex, 0, movedItem);

    saveGuidelineOrder(updatedGuidelines, movedItem._id);
  };

  const handlePositionChange = (item: GuidelineItem, nextIndex: number) => {
    const currentIndex = guidelines.findIndex(
      (guideline) => guideline._id === item._id,
    );
    moveGuideline(currentIndex, nextIndex);
  };

  const handleDrop = (targetItem: GuidelineItem) => {
    const currentIndex = guidelines.findIndex(
      (guideline) => guideline.guideline_number === draggedGuidelineNumber,
    );
    const nextIndex = guidelines.findIndex(
      (guideline) => guideline._id === targetItem._id,
    );

    moveGuideline(currentIndex, nextIndex);
  };

  const deleteGuideline = async (guidelineNumber: number) => {
    const confirmed = await confirmAction({
      title: "Delete?",
      description: "Do you want to delete this guideline?",
      variant: "destructive",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await guidelineProxy<{ message?: string }>(
        `/${guidelineNumber}`,
        { method: "DELETE" },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to delete guideline");
      }

      notify.success("Deleted!", result?.message || "Guideline deleted");
      fetchGuidelines();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Delete Failed", message);
    }
  };

  const toggleStatus = async (guidelineNumber: number) => {
    try {
      const { ok, data: result } = await guidelineProxy<{
        message?: string;
        data?: { status: GuidelineItem["status"] };
      }>(`/${guidelineNumber}`, { method: "PATCH" });

      if (!ok) {
        throw new Error(result?.message || "Failed to update status");
      }

      notify.success("Updated!", result?.message || "Status updated");
      fetchGuidelines();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Update Failed", message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">All Guidelines</h1>
        <p className="text-teal-100">
          Drag rows or use the order dropdown to set display sequence
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 border rounded-xl px-3 md:col-span-2">
            <Search />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="py-3 outline-none w-full"
            />
          </div>

          <button
            onClick={handleSearchClick}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-3 font-semibold"
          >
            Search
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-teal-700 font-semibold"
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
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full border rounded-xl p-3 mt-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setPage(1)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-3 font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-center">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="text-center py-10" colSpan={6}>
                    <div className="flex items-center justify-center gap-2 text-teal-600">
                      <Loader2 className="animate-spin" size={20} />
                      Loading guidelines...
                    </div>
                  </td>
                </tr>
              ) : guidelines.length === 0 ? (
                <tr>
                  <td className="text-center py-6 text-gray-500" colSpan={6}>
                    No guidelines found
                  </td>
                </tr>
              ) : (
                guidelines.map((item, index) => (
                  <tr
                    key={item._id}
                    draggable={!reorderingId}
                    onDragStart={() =>
                      setDraggedGuidelineNumber(item.guideline_number)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(item)}
                    onDragEnd={() => setDraggedGuidelineNumber(null)}
                    className={`border-b transition-colors ${
                      draggedGuidelineNumber === item.guideline_number
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
                          {guidelines.map((guideline, optionIndex) => (
                            <option key={guideline._id} value={optionIndex}>
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

                    <td className="text-center py-4 font-semibold">
                      #{item.guideline_number}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold">
                        {item.title
                          ? item.title.split(" ").slice(0, 3).join(" ") +
                            (item.title.split(" ").length > 3 ? "..." : "")
                          : ""}
                      </div>
                      <div
                        className="text-gray-500 text-sm prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            const clean = DOMPurify.sanitize(
                              item.description || "",
                            );
                            const text = clean.replace(/<[^>]+>/g, "");
                            const words = text.split(" ");

                            return (
                              words.slice(0, 3).join(" ") +
                              (words.length > 3 ? "..." : "")
                            );
                          })(),
                        }}
                      />
                    </td>

                    <td className="text-center px-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
                        {item.category.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>

                    <td className="text-center px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
                      </span>
                    </td>

                    <td className="text-center px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/guideline/view-guideline/${item.guideline_number}`,
                            )
                          }
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/guideline/edit/${item.guideline_number}`,
                            )
                          }
                          className="p-2 bg-green-100 text-green-600 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => toggleStatus(item.guideline_number)}
                          className="p-2 bg-teal-100 text-teal-600 rounded-lg"
                        >
                          ✓
                        </button>

                        <button
                          onClick={() => deleteGuideline(item.guideline_number)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg"
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

        <div className="flex justify-between items-center p-4">
          <span className="text-gray-600 text-sm">
            Showing {guidelines.length} of {meta.total} results
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="px-4 py-2 bg-teal-600 text-white rounded-lg">
              {meta.page}
            </span>

            <button
              disabled={page >= meta.totalPage}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
