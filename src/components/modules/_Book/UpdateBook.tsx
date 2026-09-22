"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Tag,
  AlignLeft,
  Type,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { bookProxy } from "@/lib/book-api";
import { uploadImageToCloudinary } from "@/lib/cloudinary-upload";

import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/editor/QuilEditor"), {
  ssr: false,
});

type BookResponse = {
  message?: string;
  data?: {
    title?: string;
    thumbnail_url?: string;
    buy_url?: string;
    sold_platform?: string;
    price?: number;
    is_published?: boolean;
    description?: string;
  };
};

export default function UpdateBook({ bookId }: { bookId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    thumbnail_url: "",
    buy_url: "",
    sold_platform: "",
    price: "",
    is_published: true,
    description: "",
  });

  const fetchBookDetails = async () => {
    try {
      const { ok, data: result } = await bookProxy<BookResponse>(`/${bookId}`, {
        method: "GET",
      });
      const book = result?.data;

      if (!ok || !book) {
        notify.error("Error", result?.message || "Book not found");
        return;
      }

      setFormData({
        title: book.title || "",
        thumbnail_url: book.thumbnail_url || "",
        buy_url: book.buy_url || "",
        sold_platform: book.sold_platform || "",
        price: book.price != null ? String(book.price) : "",
        is_published: Boolean(book.is_published),
        description: book.description || "",
      });
    } catch (err) {
      console.log("❌ Fetch Error:", err);
      notify.error("Error", "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchBookDetails();
  }, [bookId]);

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Invalid File", "Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error("File Too Large", "Image size should be less than 5MB.");
      return;
    }

    setUploading(true);
    try {
      const secureUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, thumbnail_url: secureUrl }));
      notify.success("Upload Success", "Thumbnail uploaded successfully.");
    } catch (error) {
      notify.error(
        "Upload Failed",
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    const toastId = notify.loading("Updating Book...");

    try {
      const payload = {
        title: formData.title,
        thumbnail_url: formData.thumbnail_url?.trim() || "",
        buy_url: formData.buy_url,
        sold_platform: formData.sold_platform,
        price: Number(formData.price),
        is_published: Boolean(formData.is_published),
        description: formData.description,
      };

      const { ok, data: result } = await bookProxy<BookResponse>(
        `/${bookId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      notify.dismiss(toastId);

      if (!ok || !result?.data) {
        return notify.error(
          "Error",
          result?.message || "Book not found or update failed!",
        );
      }

      notify.success("Success!", "Book updated successfully!", {
        onAutoClose: () => router.push("/dashboard/my-book/view-book"),
      });
    } catch (error) {
      notify.dismiss(toastId);
      notify.error("Error", "Something went wrong!");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-green-600">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl shadow-lg">
          <h1 className="text-white text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8" /> Update Book
          </h1>
        </div>

        <div className="bg-white p-6 rounded-b-2xl shadow-xl space-y-6">
          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Type className="w-5 h-5 text-teal-600" /> Book Title
            </label>
            <input
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 flex gap-2 items-center">
              <ImageIcon className="w-5 h-5 text-teal-600" /> Thumbnail Image
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleThumbnailUpload}
              className="hidden"
              id="book-thumb-upload"
              disabled={uploading}
            />

            {formData.thumbnail_url ? (
              <div className="relative mt-3 inline-block">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="w-56 h-36 object-cover rounded-xl shadow-md border"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                    <Loader2 className="w-7 h-7 animate-spin text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, thumbnail_url: "" }))
                  }
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
                  title="Remove thumbnail"
                  disabled={uploading}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <label
                  htmlFor="book-thumb-upload"
                  className={`absolute bottom-2 left-2 cursor-pointer rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-teal-700 ${
                    uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Change
                </label>
              </div>
            ) : (
              <label
                htmlFor="book-thumb-upload"
                className={`mt-2 flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-all hover:border-teal-500 ${
                  uploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-teal-600" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload thumbnail
                    </span>
                    <span className="mt-1 text-xs text-gray-400">
                      PNG, JPG, WEBP, GIF up to 5MB
                    </span>
                  </>
                )}
              </label>
            )}
          </div>

          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Tag className="w-5 h-5 text-teal-600" /> Sold Platform
            </label>

            <select
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.sold_platform}
              onChange={(e) =>
                setFormData({ ...formData, sold_platform: e.target.value })
              }
            >
              <option value="">Select Platform</option>
              <option value="rokomari">Rokomari</option>
              <option value="wafi_life">Wafi Life</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Buy URL</label>
            <input
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.buy_url}
              onChange={(e) => setFormData({ ...formData, buy_url: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Price (৳)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Status</label>
            <select
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.is_published ? "published" : "unpublished"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published: e.target.value === "published",
                })
              }
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 flex gap-2 mb-2">
              <AlignLeft className="w-5 h-5 text-teal-600" /> Description
            </label>

            <QuillEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, description: html }))
              }
            />
          </div>

          <button
            className="w-full py-3 bg-teal-600 text-white rounded-xl mt-4 shadow hover:bg-teal-700 transition"
            onClick={handleUpdate}
          >
            Update Book
          </button>
        </div>
      </div>
    </div>
  );
}
