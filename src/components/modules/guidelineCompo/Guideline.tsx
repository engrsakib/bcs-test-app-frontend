




"use client";

import React, { useState } from 'react';
import { 
  FileText, Tag, AlignLeft, Type,
  Bold, Italic, Underline, Image as ImageIcon, Upload, Loader2, X
} from 'lucide-react';
import { notify } from '@/lib/toast';
import { ENV } from '@/config/env';
import getCookie from '@/util/GetCookie';

import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/editor/QuilEditor"), {
  ssr: false,
});


// BACKEND ENUMS
const GUIDELINE_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  ADMIN_APPROVAL: "admin_approval",
};

const GUIDELINE_CATEGORY = {
  GENERAL: "general",
  TECHNICAL: "technical",
  EXAM: "exam",
  BCS_PREPARATION: "bcs_preparation",
  PRIMARY_TEACHER: "primary_teacher_preparation",
  TEACHER_NIBONDHON: "teacher_nibondhon_preparation",
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const CreateGuideline = () => {

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: GUIDELINE_STATUS.ACTIVE,
    description: "",
    thumbnail_url: "",
  });



  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 



  // ============================================================
  // 🔥 CLOUDINARY UPLOADER
  // ============================================================
  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData(prev => ({ ...prev, thumbnail_url: data.secure_url }));

        notify.success(
          "Image Uploaded!",
          "Thumbnail image uploaded successfully."
        );
      } else {
        notify.error("Upload Failed", "Cloudinary didn't return a valid image URL");
      }

    } catch (error) {
      notify.error("Error", "Cloudinary upload failed");
    }

    setUploading(false);
  };

const handleSubmit = async () => {
  const title = formData.title.trim();
  const description = formData.description.trim();

  if (!title) {
    return notify.warning("Missing Title", "Please enter guideline title");
  }

  if (!description || description === "<p><br></p>") {
    return notify.warning("Missing Description", "Please enter description");
  }

  setSubmitting(true);

  try {
    const payload = {
      ...formData,
      thumbnail_url: formData.thumbnail_url || "",
      category: formData.category || "",
    };

    const res = await fetch(`${ENV.BASE_URL}/guideline/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("access_token") || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      notify.success("Guideline Created Successfully!");

      setFormData({
        title: "",
        category: "",
        status: GUIDELINE_STATUS.ACTIVE,
        description: "",
        thumbnail_url: "",
      });
    } else {
      const errorText =
        Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
          ? data.errorMessages.map((err: any) => err.message).join("\n")
          : data?.message || "Failed to create guideline";

      notify.error("Error", errorText);
    }
  } catch (error: any) {
    notify.error("Error", error?.message || "Network or server error");
  } finally {
    setSubmitting(false);
  }
};

  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FileText className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Guideline</h1>
              <p className="text-teal-100">MCQ Application Guidelines Setup</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="bg-white p-8 rounded-b-2xl shadow-xl space-y-6">

          {/* TITLE */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <Type className="text-teal-600" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter guideline title"
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <Tag className="text-teal-600" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            >
              <option value="">Select category</option>
              {Object.entries(GUIDELINE_CATEGORY).map(([key, value]) => (
                <option key={value} value={value}>{value.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <FileText className="text-teal-600" /> Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            >
              {Object.entries(GUIDELINE_STATUS).map(([k, v]) => (
                <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          {/* THUMBNAIL UPLOADER (optional) */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold items-center">
              <ImageIcon className="text-teal-600" /> Thumbnail Image
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>

            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2">
                <Upload size={18} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {uploading && (
                <span className="flex items-center gap-2 text-teal-600 font-medium">
                  <Loader2 className="animate-spin" size={18} /> Uploading...
                </span>
              )}
            </div>

            {formData.thumbnail_url ? (
              <div className="relative mt-4 inline-block">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail Preview"
                  className="w-48 h-32 object-cover rounded-xl shadow-md border"
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

          {/* DESCRIPTION */}



          {/* DESCRIPTION */}
<div>
  <label className="flex gap-2 text-gray-700 font-semibold">
    <AlignLeft className="text-teal-600" /> Description
  </label>

  <div className="mt-2">
    <QuillEditor
      value={formData.description}
      onChange={(html) =>
        setFormData((prev) => ({ ...prev, description: html }))
      }
    />
  </div>
</div>

    

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold text-white 
              ${submitting ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}
            `}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Creating...
              </span>
            ) : (
              "Create Guideline"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreateGuideline;



