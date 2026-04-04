


"use client";

import React, { useState } from "react";
import {
  FileText,
  Tag,
  Type,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { ENV } from "@/config/env";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReusableQuillEditor = dynamic(() => import("@/editor/ReactQuilEditor"), {
  ssr: false,
});

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const BOOK_PLATFORM_ENUMS = {
  ROKOMARI: "rokomari",
  WAFI_LIFE: "wafi_life",
  OTHERS: "others",
};

export default function CreateBook() {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    thumbnail_url: "",
    buy_url: "",
    sold_platform: "",
    price: "",
    is_published: "true",
    description: "",
  });

  const handleThumbnailUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();

      if (cloudData?.secure_url) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: cloudData.secure_url,
        }));
      }
    } finally {
      setUploading(false);
    }

    event.target.value = "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  const title = formData.title.trim();
  const buyUrl = formData.buy_url.trim();

  if (!title) {
    return Swal.fire("Title Missing!", "Please enter a title.", "warning");
  }

  if (!buyUrl) {
    return Swal.fire("Buy URL Missing!", "Please enter buy URL.", "warning");
  }

  const token = getCookie("access_token");

  try {
    setSubmitting(true);

    const res = await fetch(`${ENV.BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? token : "",
      },
      body: JSON.stringify({
        title,
        thumbnail_url: formData.thumbnail_url || "",
        buy_url: buyUrl,
        sold_platform: formData.sold_platform || "",
        price: Number(formData.price || 0),
        is_published: formData.is_published === "true",
        description: formData.description || "",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Book Created!",
        text: `"${title}" added successfully.`,
        confirmButtonColor: "#0d9488",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard/my-book/view-book");

      setFormData({
        title: "",
        thumbnail_url: "",
        buy_url: "",
        sold_platform: "",
        price: "",
        is_published: "true",
        description: "",
      });
    } else {
      const errorText =
        Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
          ? data.errorMessages.map((err: any) => err.message).join("\n")
          : data?.message || "Failed to create book";

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorText,
        confirmButtonColor: "#ef4444",
      });
    }
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.message || "Network or server error",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl shadow-lg">
          <h1 className="text-white text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8" /> Create Book
          </h1>
        </div>

        <div className="bg-white p-6 rounded-b-2xl shadow-xl space-y-6">
          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Type className="w-5 h-5 text-teal-600" /> Book Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mt-2"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600" /> Thumbnail Upload
            </label>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbUpload"
              />
              <label
                htmlFor="thumbUpload"
                className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-xl shadow hover:bg-teal-700 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Thumbnail
              </label>

              {uploading && <span className="text-teal-700">Uploading...</span>}
            </div>

            {formData.thumbnail_url && (
              <img
                src={formData.thumbnail_url}
                className="w-40 mt-3 rounded-xl shadow"
                alt="thumbnail"
              />
            )}
          </div>

          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Tag className="w-5 h-5 text-teal-600" /> Sold Platform
            </label>
            <select
              name="sold_platform"
              value={formData.sold_platform}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mt-2"
            >
              <option value="">Select Platform</option>
              <option value={BOOK_PLATFORM_ENUMS.ROKOMARI}>Rokomari</option>
              <option value={BOOK_PLATFORM_ENUMS.WAFI_LIFE}>Wafi Life</option>
              <option value={BOOK_PLATFORM_ENUMS.OTHERS}>Others</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Buy URL</label>
            <input
              name="buy_url"
              value={formData.buy_url}
              onChange={handleChange}
              placeholder="https://example.com/book"
              className="w-full px-4 py-3 border rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Price (৳)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mt-2"
              placeholder="Enter book price"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Status</label>
            <select
              name="is_published"
              value={formData.is_published}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mt-2"
            >
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <div className="mt-2">
              <ReusableQuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Enter book description..."
                height={220}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-teal-600 text-white rounded-xl mt-4 shadow hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Book"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}