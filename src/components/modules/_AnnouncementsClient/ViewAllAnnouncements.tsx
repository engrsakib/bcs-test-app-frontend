"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  Megaphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { announcementsProxy } from "@/lib/announcements-api";
import { confirmAction } from "@/components/ui/confirm-dialog";

type AnnouncementItem = {
  _id: string;
  announcement_number: number;
  title: string;
  body: string;
  link?: string;
  is_published: boolean;
  createdAt: string;
};

type AnnouncementApiResponse = {
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
    data: AnnouncementItem[];
  };
};

function stripHtml(html: string): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

export default function ViewAllAnnouncements() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        searchTerm,
      });

      const { ok, data: result } = await announcementsProxy<AnnouncementApiResponse>(
        `?${params.toString()}`,
        { method: "GET" }
      );

      if (!ok) {
        throw new Error(result.message || "Failed to fetch announcements");
      }

      setAnnouncements(result.data.data);
      setMeta(result.data.meta);
    } catch (error) {
      console.error("Fetch announcements error:", error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, limit, searchTerm]);

  const handleDelete = async (id: string | number) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      description: "This announcement will be deleted permanently.",
      variant: "destructive",
      confirmText: "Yes, delete it",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await announcementsProxy<{ message?: string }>(
        `/${id}`,
        { method: "DELETE" }
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to delete announcement");
      }

      notify.success("Deleted", result?.message || "Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Delete Failed", message);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 p-6">
      <div className="mb-6 rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">All Announcements</h1>
            <p className="text-amber-100">Browse and manage app announcements</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl bg-white p-5 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border px-3 md:col-span-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or body"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full py-3 outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-700"
          >
            Search
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-amber-700"
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
                onClick={() => setPage(1)}
                className="w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center">No.</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Published</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10">
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                      <Loader2 className="animate-spin" size={20} />
                      Loading announcements...
                    </div>
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No announcements found
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-semibold text-gray-700">
                      #{item.announcement_number}
                    </td>

                    <td className="px-4 py-4">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {stripHtml(item.body).slice(0, 80)}
                        {stripHtml(item.body).length > 80 ? "..." : ""}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          item.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/announcements/edit/${item.announcement_number}`
                            )
                          }
                          className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.announcement_number)
                          }
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
            Showing {announcements.length} of {meta.total} results
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-lg border p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="rounded-lg bg-amber-600 px-4 py-2 text-white">
              {meta.page}
            </span>

            <button
              onClick={() =>
                setPage((prev) => Math.min(meta.totalPage, prev + 1))
              }
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
