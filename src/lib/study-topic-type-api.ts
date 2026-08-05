const PROXY_BASE = "/api/proxy/study-topic-type";

type ProxyResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

export type StudyTopicTypeItem = {
  _id?: string;
  value: string;
  label: string;
  position?: number;
  isDefault?: boolean;
};

export async function studyTopicTypeProxy<T = unknown>(
  suffix = "",
  options: RequestInit = {}
): Promise<ProxyResult<T>> {
  const path = suffix.startsWith("?")
    ? suffix
    : suffix
      ? suffix.startsWith("/")
        ? suffix
        : `/${suffix}`
      : "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${PROXY_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as T;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}

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
  const { ok, data, status } = await studyTopicTypeProxy<{
    data?: StudyTopicTypeItem;
    message?: string;
  }>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!ok) {
    const error = new Error(data?.message || "Failed to create study topic type");
    (error as Error & { status?: number }).status = status;
    throw error;
  }

  if (!data?.data) {
    throw new Error("Invalid response from server");
  }

  return data.data;
}
