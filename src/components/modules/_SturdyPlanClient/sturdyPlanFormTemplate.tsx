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
} from "lucide-react";
import { notify } from "@/lib/toast";
import { studyPlanProxy } from "@/lib/study-plan-api";
import { useRouter } from "next/navigation";

const QuillEditor = dynamic(() => import("@/editor/QuilEditor"), {
  ssr: false,
});

const categoryOptions = [
  "general",
  "technical",
  "exam",
  "bcs_preparation",
  "primary_teacher_preparation",
  "teacher_nibondhon_preparation",
];

const statusOptions = ["inactive", "active", "admin_approval"];

type StudyPlanFormData = {
  title: string;
  description: string;
  thumbnail_url: string;
  study_plan_url: string;
  category: string;

};

const inputClassName =
  "w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition";

const labelClassName =
  "flex items-center gap-2 text-sm font-semibold text-gray-700";

const CreateStudyPlan = () => {
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<StudyPlanFormData>({
    title: "",
    description: "",
    thumbnail_url: "",
    study_plan_url: "",
    category: ""

  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnail_url: "",
      study_plan_url: "",
      category: "",

    });
  };





  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const handleImageUpload = async (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formDataUpload,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: data.secure_url,
      }));
    } else {
      notify.error("Upload Failed", "Invalid image response");
    }

  } catch (error) {
    notify.error("Error", "Image upload failed");
  } finally {
    setUploading(false);
  }
};






const handleSubmit = async () => {
  const title = formData.title.trim();
  const studyUrl = formData.study_plan_url.trim();

  if (!title) {
    return notify.warning("Missing Title", "Please enter study plan title");
  }

  if (!studyUrl) {
    return notify.warning("Missing Study Plan URL", "Please enter study plan file URL");
  }

  try {
    setSubmitting(true);

    const { ok, data } = await studyPlanProxy<{
      message?: string;
      errorMessages?: { message: string }[];
    }>("", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        thumbnail_url: formData.thumbnail_url || "",
        category: formData.category || "",
        description: formData.description || "",
        study_plan_url: studyUrl,
        title,
      }),
    });

    if (ok) {
      notify.success(
        "Study Plan Created",
        data?.message || "Study plan created successfully",
        {
          onAutoClose: () => {
            resetForm();
            router.push("/dashboard/sturdy-plan/view-plan");
          },
        }
      );
    } else {
      const errorText =
        Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
          ? data.errorMessages.map((err: any) => err.message).join("\n")
          : data?.message || "Failed to create study plan";

      notify.error("Error", errorText);
    }
  } catch (error: any) {
    notify.error("Error", error?.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <FileText className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Create Study Plan
              </h1>
              <p className="text-sm md:text-base text-teal-100 mt-1">
                MCQ Application Study Plan Setup
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white p-6 md:p-8 rounded-b-2xl shadow-xl space-y-6">
          {/* Title */}
          <div>
            <label className={labelClassName}>
              <Type className="text-teal-600" size={18} />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter study plan title"
              className={inputClassName}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClassName}>
              <Tag className="text-teal-600" size={18} />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="">Select category</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

     

          {/* Thumbnail (optional) */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold items-center">
              <ImageIcon className="text-teal-600" size={18} />
              Thumbnail Image
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>

            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2">
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
                <span className="flex items-center gap-2 text-teal-600 font-medium">
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

          {/* Study Plan URL */}
          <div>
            <label className={labelClassName}>
              <LinkIcon className="text-teal-600" size={18} />
              Study Plan URL
            </label>
            <input
              type="text"
              name="study_plan_url"
              value={formData.study_plan_url}
              onChange={handleChange}
              placeholder="Enter study plan PDF/file URL"
              className={inputClassName}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClassName}>
              <AlignLeft className="text-teal-600" size={18} />
              Description
            </label>

            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
              <QuillEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              submitting
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </span>
            ) : (
              "Create Study Plan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStudyPlan;








