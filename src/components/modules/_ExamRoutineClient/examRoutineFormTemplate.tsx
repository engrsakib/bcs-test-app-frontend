"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Tag,
  AlignLeft,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Upload,
  X,
  CalendarDays,
} from "lucide-react";
import { notify } from "@/lib/toast";
import { examRoutineProxy } from "@/lib/exam-routine-api";
import {
  formatExamRoutineCategory,
  EXAM_ROUTINE_CATEGORY_OPTIONS,
} from "@/lib/exam-routine-categories";
import { useRouter } from "next/navigation";

const QuillEditor = dynamic(() => import("@/editor/QuilEditor"), {
  ssr: false,
});

type ExamRoutineFormData = {
  title: string;
  description: string;
  thumbnail_url: string;
  exam_routine_url: string;
  category: string;
  post_date: string;
};

const inputClassName =
  "w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

const labelClassName =
  "flex items-center gap-2 text-sm font-semibold text-gray-700";

const toDateTimeLocalValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const CreateExamRoutine = () => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<ExamRoutineFormData>({
    title: "",
    description: "",
    thumbnail_url: "",
    exam_routine_url: "",
    category: "",
    post_date: toDateTimeLocalValue(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnail_url: "",
      exam_routine_url: "",
      category: "",
      post_date: toDateTimeLocalValue(),
    });
  };

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataUpload }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, thumbnail_url: data.secure_url }));
      } else {
        notify.error("Upload Failed", "Invalid image response");
      }
    } catch {
      notify.error("Error", "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const title = formData.title.trim();
    const routineUrl = formData.exam_routine_url.trim();

    if (!title) {
      return notify.warning("Missing Title", "Please enter exam routine title");
    }
    if (!routineUrl) {
      return notify.warning(
        "Missing Routine URL",
        "Please enter exam routine file URL"
      );
    }
    if (!formData.category) {
      return notify.warning("Missing Category", "Please select a category");
    }
    if (!formData.post_date) {
      return notify.warning("Missing Post Date", "Please select post date");
    }

    try {
      setSubmitting(true);

      const { ok, data } = await examRoutineProxy<{
        message?: string;
        errorMessages?: { message: string }[];
      }>("", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: formData.description || "",
          thumbnail_url: formData.thumbnail_url || "",
          category: formData.category,
          exam_routine_url: routineUrl,
          post_date: new Date(formData.post_date).toISOString(),
        }),
      });

      if (ok) {
        notify.success(
          "Exam Routine Created",
          data?.message || "Exam routine created successfully",
          {
            onAutoClose: () => {
              resetForm();
              router.push("/dashboard/exam-routine/view-routine");
            },
          }
        );
      } else {
        const errorText =
          Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
            ? data.errorMessages.map((err) => err.message).join("\n")
            : data?.message || "Failed to create exam routine";
        notify.error("Error", errorText);
      }
    } catch (error: any) {
      notify.error("Error", error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Create Exam Routine
              </h1>
              <p className="text-sm md:text-base text-indigo-100 mt-1">
                MCQ Application Exam Routine Setup
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-b-2xl shadow-xl space-y-6">
          <div>
            <label className={labelClassName}>
              <Type className="text-indigo-600" size={18} />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter exam routine title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              <Tag className="text-indigo-600" size={18} />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="">Select category</option>
              {EXAM_ROUTINE_CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {formatExamRoutineCategory(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName}>
              <CalendarDays className="text-indigo-600" size={18} />
              Post Date
            </label>
            <input
              type="datetime-local"
              name="post_date"
              value={formData.post_date}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="flex gap-2 text-gray-700 font-semibold items-center">
              <ImageIcon className="text-indigo-600" size={18} />
              Thumbnail Image
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>
            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {uploading && (
                <span className="flex items-center gap-2 text-indigo-600 font-medium">
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </span>
              )}
            </div>
            {formData.thumbnail_url ? (
              <div className="relative mt-4 inline-block">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail Preview"
                  className="w-52 h-32 object-cover rounded-xl border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, thumbnail_url: "" }))
                  }
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
                  title="Remove thumbnail"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">No thumbnail selected</p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              <LinkIcon className="text-indigo-600" size={18} />
              Exam Routine URL
            </label>
            <input
              type="text"
              name="exam_routine_url"
              value={formData.exam_routine_url}
              onChange={handleChange}
              placeholder="Enter exam routine PDF/file URL"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              <AlignLeft className="text-indigo-600" size={18} />
              Description
            </label>
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
              <QuillEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              submitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </span>
            ) : (
              "Create Exam Routine"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamRoutine;
