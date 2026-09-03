import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

const studyTopicTypeProxy = createCachedProxy(
  "/api/proxy/study-topic-type",
  "study-topic-type",
  CACHE_TTL.default
);

export type StudyTopicTypeItem = {
  _id?: string;
  value: string;
  label: string;
  position?: number;
  isDefault?: boolean;
  isPending?: boolean;
  pendingId?: string;
};

export async function fetchStudyTopicTypes(): Promise<StudyTopicTypeItem[]> {
  const { ok, data } = await studyTopicTypeProxy<{
    data?: StudyTopicTypeItem[];
    message?: string;
  }>("", { method: "GET" });

  if (!ok) {
    throw new Error(data?.message || "Failed to fetch study topic types");
  }

  return data?.data ?? [];
}

export async function createStudyTopicType(payload: {
  label: string;
  value?: string;
}): Promise<StudyTopicTypeItem> {
  const res = await fetch("/api/proxy/study-topic-type", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as {
    data?: StudyTopicTypeItem;
    message?: string;
  };

  if (!res.ok) {
    const error = new Error(data?.message || "Failed to create study topic type");
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }

  if (!data?.data) {
    throw new Error("Invalid response from server");
  }

  return data.data;
}

export async function deleteStudyTopicType(value: string): Promise<void> {
  const res = await fetch(`/api/proxy/study-topic-type/${encodeURIComponent(value)}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = (await res.json()) as { message?: string };

  if (!res.ok) {
    const error = new Error(data?.message || "Failed to delete study topic type");
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }
}
