"use client";

import React, { useState, useEffect } from "react";
import { Tag, Type, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { questionStudyTopicProxy } from "@/lib/question-study-topic-api";
import { STUDY_TOPIC_TYPE_OPTIONS } from "@/constants/study-topic-types";

export default function EditStudyTopic() {
  const { category_number } = useParams<{ category_number: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categoryNumber, setCategoryNumber] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const { ok, data: result } = await questionStudyTopicProxy<{
          message?: string;
          data?: {
            category_number: number;
            name: string;
            type: string;
          };
        }>(`/${category_number}`, { method: "GET" });

        if (!ok || !result.data) {
          throw new Error(result?.message || "Failed to load study topic");
        }

        setCategoryNumber(result.data.category_number);
        setFormData({
          name: result.data.name,
          type: result.data.type,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        notify.error("Load Failed", message);
      } finally {
        setLoading(false);
      }
    };

    if (category_number) {
      fetchTopic();
    }
  }, [category_number]);

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

    if (!formData.type) {
      return notify.warning("Missing Type", "Please select a topic type");
    }

    setSubmitting(true);

    try {
      const { ok, data: result } = await questionStudyTopicProxy<{
        message?: string;
      }>(`/${category_number}`, {
        method: "PATCH",
        body: JSON.stringify({ name, type: formData.type }),
      });

      if (!ok) {
        throw new Error(result?.message || "Failed to update study topic");
      }

      notify.success(
        "Updated!",
        result?.message || "Study topic updated successfully"
      );

      router.push("/dashboard/question/question-study-topic");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Update Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Edit Study Topic</h1>
        {categoryNumber !== null && (
          <p className="text-indigo-100 mt-1">
            Category Number:{" "}
            <span className="font-mono font-semibold">{categoryNumber}</span>{" "}
            (immutable)
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 max-w-xl space-y-6"
      >
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Tag size={16} />
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Type size={16} />
            Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select type</option>
            {STUDY_TOPIC_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
