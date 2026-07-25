"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Loader2,
  AlertCircle,
  ChevronDown,
  ImageOff,
  GripVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { youtubeProxy } from "@/lib/youtube-api";
import { confirmAction } from "@/components/ui/confirm-dialog";

type VideoItem = {
  _id: string;
  video_number: number;
  title?: string;
  description?: string;
  is_published: boolean;
  position?: number;
  thumbnail_url?: string;
  video_url: string;
};

type VideoApiResponse = {
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
    data: VideoItem[];
  };
};

export default function ViewAllYouTubeVideos() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [draggedVideoNumber, setDraggedVideoNumber] = useState<number | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(searchTerm && { searchTerm }),
      });

      const { ok, data: result } = await youtubeProxy<VideoApiResponse>(
        `?${params.toString()}`,
        { method: "GET" },
      );

      if (!ok) {
        throw new Error(result.message || "Failed to fetch videos");
      }

      setVideos(result.data.data);
      setMeta(result.data.meta);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, limit, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const buildReorderPayload = (items: VideoItem[]) => {
    const pageOffset = (page - 1) * limit;

    return items.map((item, index) => ({
      id: item.video_number,
      position: pageOffset + index,
    }));
  };

  const saveVideoOrder = async (
    updatedVideos: VideoItem[],
    activeItemId: string,
  ) => {
    const previousVideos = videos;

    setVideos(updatedVideos);
    setReorderingId(activeItemId);

    try {
      const { ok, data: result } = await youtubeProxy<{ message?: string }>(
        "/reorder",
        {
          method: "PATCH",
          body: JSON.stringify({
            items: buildReorderPayload(updatedVideos),
          }),
        },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      notify.success(
        "Order updated successfully",
        result?.message || "Video sequence saved",
      );

      fetchVideos();
    } catch (error: unknown) {
      setVideos(previousVideos);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Order Update Failed", message);
    } finally {
      setReorderingId(null);
      setDraggedVideoNumber(null);
    }
  };

  const moveVideo = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const updatedVideos = [...videos];
    const [movedItem] = updatedVideos.splice(fromIndex, 1);
    updatedVideos.splice(toIndex, 0, movedItem);

    saveVideoOrder(updatedVideos, movedItem._id);
  };

  const handlePositionChange = (item: VideoItem, nextIndex: number) => {
    const currentIndex = videos.findIndex((video) => video._id === item._id);
    moveVideo(currentIndex, nextIndex);
  };

  const handleDrop = (targetItem: VideoItem) => {
    const currentIndex = videos.findIndex(
      (video) => video.video_number === draggedVideoNumber,
    );
    const nextIndex = videos.findIndex((video) => video._id === targetItem._id);

    moveVideo(currentIndex, nextIndex);
  };

  const updatePublishStatus = async (video_number: number, newValue: string) => {
    try {
      const { ok, data: result } = await youtubeProxy<{ message?: string }>(
        `/${video_number}`,
        { method: "PATCH" },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update publish status");
      }

      notify.success(
        "Success",
        newValue === "true"
          ? "Video published successfully"
          : "Video unpublished successfully",
        { duration: 1500 },
      );

      fetchVideos();
    } catch {
      notify.error("Error", "Failed to update publish status");
    }
  };

  const deleteVideo = async (video_number: number, title: string) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      description: `Delete "${title}"?`,
      variant: "destructive",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      const { ok } = await youtubeProxy(`/${video_number}`, {
        method: "DELETE",
      });

      if (!ok) throw new Error("Delete failed");

      notify.success("Deleted!", "Video deleted successfully", {
        duration: 1500,
      });

      fetchVideos();
    } catch {
      notify.error("Error", "Failed to delete video");
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-full mx-auto">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-2xl text-white mb-6 shadow-lg flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <FileText className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">All YouTube Videos</h1>
              <p className="opacity-90">
                Drag rows or use the order dropdown to set display sequence
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700"
          >
            <span>Advanced Filters</span>
            <ChevronDown
              className={`transition-transform ${showFilter ? "rotate-180" : ""}`}
            />
          </button>

          {showFilter && (
            <div className="p-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-gray-600">Page</label>
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  className="w-full mt-1 border p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600">Limit</label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full mt-1 border p-2 rounded-xl"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-600">Search</label>
                <div className="flex items-center gap-2 mt-1 border rounded-xl px-3">
                  <Search size={18} className="text-gray-500" />
                  <input
                    type="text"
                    className="w-full py-2 outline-none"
                    placeholder="Search videos..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="mt-2 w-full bg-teal-600 text-white p-2 rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6 flex gap-2 items-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] hidden lg:table">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Play</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {videos.map((video, index) => (
                  <tr
                    key={video._id}
                    draggable={!reorderingId}
                    onDragStart={() => setDraggedVideoNumber(video.video_number)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(video)}
                    onDragEnd={() => setDraggedVideoNumber(null)}
                    className={`border-b transition-colors ${
                      draggedVideoNumber === video.video_number
                        ? "bg-teal-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <GripVertical size={16} className="text-gray-400" />
                        <select
                          value={index}
                          disabled={!!reorderingId}
                          onChange={(e) =>
                            handlePositionChange(video, Number(e.target.value))
                          }
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none transition focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {videos.map((item, optionIndex) => (
                            <option key={item._id} value={optionIndex}>
                              {(page - 1) * limit + optionIndex + 1}
                            </option>
                          ))}
                        </select>
                        {reorderingId === video._id && (
                          <Loader2
                            className="animate-spin text-teal-600"
                            size={16}
                          />
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title || "Video thumbnail"}
                          className="w-24 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-16 rounded-lg bg-gray-100 border flex items-center justify-center">
                          <ImageOff className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">{video.title}</p>
                      <p
                        className="text-gray-600 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: video.description || "",
                        }}
                      />
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => window.open(video.video_url, "_blank")}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
                      >
                        <Play className="w-4 h-4 inline" /> Play
                      </button>
                    </td>

                    <td className="p-4">
                      <select
                        value={video.is_published ? "true" : "false"}
                        onChange={(e) =>
                          updatePublishStatus(video.video_number, e.target.value)
                        }
                        className="border p-2 rounded-lg bg-white"
                      >
                        <option value="true">Published</option>
                        <option value="false">Unpublished</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/youtube/update?video=${video.video_number}`,
                            )
                          }
                          className="p-2 bg-green-100 text-green-600 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            deleteVideo(video.video_number, video.title || "")
                          }
                          className="p-2 bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50">
            <span className="text-sm text-gray-600">
              Showing {videos.length} of {meta.total} results
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 bg-white border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft />
              </button>

              <span className="rounded-lg bg-teal-600 px-4 py-2 text-white">
                {meta.page}
              </span>

              <button
                disabled={page >= meta.totalPage}
                onClick={() => setPage(page + 1)}
                className="p-2 bg-white border rounded-lg disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
