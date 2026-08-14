"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Megaphone,
  Type,
  AlignLeft,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { announcementsProxy } from "@/lib/announcements-api";

const QuillEditor = dynamic(() => import("@/editor/QuilEditor"), {
  ssr: false,
});

type AnnouncementFormData = {
  title: string;
  body: string;
  link: string;
  is_published: boolean;
};

type AnnouncementFormTemplateProps = {
  mode: "create" | "edit";
  announcementId?: string;
};

const inputClassName =
  "w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition";

const labelClassName =
  "flex items-center gap-2 text-sm font-semibold text-gray-700";

export default function AnnouncementFormTemplate({
  mode,
  announcementId,
}: AnnouncementFormTemplateProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    body: "",
    link: "",
    is_published: true,
  });

  useEffect(() => {
    if (!isEdit || !announcementId) return;

    const fetchAnnouncement = async () => {
      try {
        const { ok, data: result } = await announcementsProxy<{
          success: boolean;
          message?: string;
          data?: AnnouncementFormData;
        }>(`/${announcementId}`, { method: "GET" });

        if (!ok || !result.data) {
          throw new Error(result.message || "Failed to load announcement");
        }

        setFormData({
          title: result.data.title || "",
          body: result.data.body || "",
          link: result.data.link || "",
          is_published: result.data.is_published ?? true,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load announcement";
        notify.error("Error", message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [isEdit, announcementId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBodyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, body: value }));
  };

  const handleSubmit = async () => {
    const title = formData.title.trim();
    const body = formData.body.trim();
    const link = formData.link.trim();

    if (!title) {
      return notify.warning("Missing Title", "Please enter announcement title");
    }

    if (!body || body === "<p><br></p>") {
      return notify.warning("Missing Body", "Please enter announcement body");
    }

    try {
      setSubmitting(true);

      const payload = {
        title,
        body,
        link: link || "",
        is_published: formData.is_published,
      };

      const { ok, data } = await announcementsProxy<{
        message?: string;
        errorMessages?: { message: string }[];
      }>(isEdit ? `/${announcementId}` : "", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (ok) {
        notify.success(
          isEdit ? "Announcement Updated" : "Announcement Created",
          data?.message ||
            (isEdit
              ? "Announcement updated successfully"
              : "Announcement created successfully"),
          {
            onAutoClose: () =>
              router.push("/dashboard/announcements/view-announcements"),
          }
        );
      } else {
        const errorText =
          Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
            ? data.errorMessages.map((err) => err.message).join("\n")
            : data?.message || "Failed to save announcement";
        notify.error("Error", errorText);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="flex items-center gap-2 text-amber-600">
          <Loader2 className="animate-spin" size={24} />
          Loading announcement...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-t-2xl bg-linear-to-r from-amber-600 to-orange-600 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-3">
              <Megaphone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                {isEdit ? "Edit Announcement" : "Create Announcement"}
              </h1>
              <p className="mt-1 text-sm text-amber-100 md:text-base">
                {isEdit
                  ? "Update the selected announcement"
                  : "Publish a new app announcement"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-b-2xl bg-white p-6 shadow-xl md:p-8">
          <div>
            <label className={labelClassName}>
              <Type className="text-amber-600" size={18} />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              <AlignLeft className="text-amber-600" size={18} />
              Body
            </label>
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
              <QuillEditor value={formData.body} onChange={handleBodyChange} />
            </div>
          </div>

          <div>
            <label className={labelClassName}>
              <LinkIcon className="text-amber-600" size={18} />
              Link
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className={inputClassName}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="is_published" className="font-semibold text-gray-700">
              Published (visible to users)
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              submitting
                ? "cursor-not-allowed bg-amber-400"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : isEdit ? (
              "Update Announcement"
            ) : (
              "Create Announcement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
