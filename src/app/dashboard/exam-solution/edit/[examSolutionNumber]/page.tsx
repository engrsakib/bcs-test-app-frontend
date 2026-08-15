"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Type,
  Image as ImageIcon,
  Upload,
  Loader2,
  Link as LinkIcon,
  ArrowLeft,
  X,
} from "lucide-react";
import { notify } from "@/lib/toast";
import { confirmAction } from "@/components/ui/confirm-dialog";
import { useParams, useRouter } from "next/navigation";
import { examSolutionProxy } from "@/lib/exam-solution-api";
import ReusableQuillEditor from "@/editor/ReactQuilEditor";

type ExamSolutionDetails = {
  _id: string;
  id: string;
  exam_solution_number: number;
  title: string;
  description: string;
  status: "active" | "inactive" | "admin_approval";
  thumbnail_url: string;
  exam_solution_url: string;
  createdAt: string;
  updatedAt: string;
};

type ExamSolutionDetailsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: ExamSolutionDetails;
};

const statusOptions = ["inactive", "active", "admin_approval"];

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const inputClassName =
  "w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition";

const labelClassName =
  "flex items-center gap-2 text-sm font-semibold text-gray-700";

export default function EditStudyPlanPage() {
  const router = useRouter();
  const params = useParams();
  const examSolutionNumber = params?.examSolutionNumber as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "inactive",
    thumbnail_url: "",
    exam_solution_url: "",
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

  const fetchExamSolutionDetails = async () => {
    try {
      setLoading(true);

      const { ok, data: result } =
        await examSolutionProxy<ExamSolutionDetailsResponse>(`/${examSolutionNumber}`, {
          method: "GET",
        });

      if (!ok) {
        throw new Error(result?.message || "Failed to fetch exam solution");
      }

      setFormData({
        title: result.data.title || "",
        description: result.data.description || "",
        status: result.data.status || "inactive",
        thumbnail_url: result.data.thumbnail_url || "",
        exam_solution_url: result.data.exam_solution_url || "",
      });
    } catch (error: any) {
      notify.error("Error", error?.message || "Failed to load exam solution");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examSolutionNumber) {
      fetchExamSolutionDetails();
    }
  }, [examSolutionNumber]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
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

        notify.success("Image Uploaded", "Thumbnail uploaded successfully");
      } else {
        throw new Error("Cloudinary did not return image URL");
      }
    } catch (error: any) {
      notify.error("Error", error?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      return notify.warning("Missing Title", "Please enter title");
    }

    if (!formData.exam_solution_url.trim()) {
      return notify.warning("Missing Exam Solution URL", "Please enter exam solution URL");
    }

    if (!formData.description.trim()) {
      return notify.warning("Missing Description", "Please write description");
    }

    const confirmed = await confirmAction({
      title: "Update Exam Solution?",
      description: "Do you want to save these changes?",
      confirmText: "Yes, Update",
    });

    if (!confirmed) return;

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url?.trim() || "",
        exam_solution_url: formData.exam_solution_url,
      };

      const { ok, data: result } = await examSolutionProxy<{ message?: string }>(
        `/${examSolutionNumber}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update exam solution");
      }

      notify.success(
        "Updated Successfully",
        result?.message || "Study plan updated successfully",
        {
          onAutoClose: () => router.push(`/dashboard/exam-solution/view-solution`),
        }
      );
    } catch (error: any) {
      notify.error("Error", error?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg text-teal-700">
          <Loader2 className="animate-spin" size={22} />
          <span className="font-semibold">Loading exam solution...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Edit Exam Solution</h1>
              <p className="text-teal-100">
                Update and manage exam solution information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-b-2xl shadow-xl space-y-6">
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
              placeholder="Enter exam solution title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              <ImageIcon className="text-teal-600" size={18} />
              Thumbnail Image
              <span className="ml-1 text-xs font-normal text-gray-500">(optional)</span>
            </label>

            <div className="mt-2 flex items-center gap-4 flex-wrap">
              <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
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
                  className="w-56 h-36 object-cover rounded-xl shadow-md border"
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
              <LinkIcon className="text-teal-600" size={18} />
              Exam Solution URL
            </label>
            <input
              type="text"
              name="exam_solution_url"
              value={formData.exam_solution_url}
              onChange={handleChange}
              placeholder="Enter exam solution URL"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              <FileText className="text-teal-600" size={18} />
              Description
            </label>

            <div className="mt-2">
              <ReusableQuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                placeholder="Write exam solution description..."
                height={280}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdate}
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
                Updating...
              </span>
            ) : (
              "Update Exam Solution"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}