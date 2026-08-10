"use client";

import React, { useState } from "react";
import { Tag, Type, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { questionStudyTopicProxy } from "@/lib/question-study-topic-api";
import { syncPendingStudyTopicTypesToServer } from "@/lib/study-topic-type-storage";
import StudyTopicTypeSelect from "./StudyTopicTypeSelect";

export default function CreateStudyTopic() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      return notify.warning("Missing Name", "Please enter a topic name");
    }

    setSubmitting(true);

    try {
      await syncPendingStudyTopicTypesToServer();

      const payload: { name: string; type?: string } = { name };
      const subjectName = formData.type.trim();
      if (subjectName) {
        payload.type = subjectName;
      }

      const { ok, data: result } = await questionStudyTopicProxy<{
        message?: string;
        data?: { category_number: number };
      }>("", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!ok) {
        throw new Error(result?.message || "Failed to create study topic");
      }

      notify.success(
        "Created!",
        result?.message || "Study topic created successfully"
      );

      router.push("/dashboard/question/question-study-topic");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Create Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <Link
          href="/dashboard/question/question-study-topic"
          className="inline-flex items-center gap-1 text-indigo-100 hover:text-white mb-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to topics
        </Link>
        <h1 className="text-3xl font-bold">Create Study Topic</h1>
        <p className="text-indigo-100">
          Category number will be auto-generated and cannot be changed later.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 max-w-xl space-y-6"
      >
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Tag size={16} />
            Topic Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder='e.g. "কারক", "সমাস"'
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Type size={16} />
            Subject Name
          </label>
          <StudyTopicTypeSelect
            value={formData.type}
            onChange={(type) => setFormData((prev) => ({ ...prev, type }))}
            placeholder="Select subject (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating...
            </>
          ) : (
            "Create Topic"
          )}
        </button>
      </form>
    </div>
  );
}
