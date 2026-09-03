import { CACHE_TTL } from "@/config/offline";
import { ENV } from "@/config/env";
import { fetchWithOfflineCache } from "./cached-proxy";

type StudentsListPayload = {
  data: unknown[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

type StudentsListResult = {
  success: boolean;
  data?: StudentsListPayload;
  message?: string;
};

export async function fetchStudentsList(
  url: string,
  accessToken: string
): Promise<{
  result: StudentsListResult;
  fromCache: boolean;
  isStale: boolean;
  fetchedAt: number;
}> {
  const cacheKey = `students:list:${url}`;

  const cached = await fetchWithOfflineCache(cacheKey, CACHE_TTL.students, async () => {
    const res = await fetch(url, {
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return (await res.json()) as StudentsListResult;
  });

  return {
    result: cached.data,
    fromCache: cached.fromCache,
    isStale: cached.isStale,
    fetchedAt: cached.fetchedAt,
  };
}

export async function fetchExamsList(
  url: string,
  accessToken: string
): Promise<{
  result: unknown;
  fromCache: boolean;
  isStale: boolean;
  fetchedAt: number;
}> {
  const fullUrl = url.startsWith("http") ? url : `${ENV.BASE_URL}${url}`;
  const cacheKey = `exams:list:${fullUrl}`;

  const cached = await fetchWithOfflineCache(cacheKey, CACHE_TTL.exams, async () => {
    const res = await fetch(fullUrl, {
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return res.json();
  });

  return {
    result: cached.data,
    fromCache: cached.fromCache,
    isStale: cached.isStale,
    fetchedAt: cached.fetchedAt,
  };
}

export async function fetchQuestionsList(
  url: string,
  accessToken: string
): Promise<{
  result: {
    success?: boolean;
    data?: { data: unknown[]; meta: Record<string, unknown> };
    message?: string;
  };
  fromCache: boolean;
  isStale: boolean;
  fetchedAt: number;
}> {
  const fullUrl = url.startsWith("http") ? url : url;
  const cacheKey = `questions:list:${fullUrl}`;

  const cached = await fetchWithOfflineCache(cacheKey, CACHE_TTL.questions, async () => {
    const res = await fetch(fullUrl, {
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return res.json();
  });

  return {
    result: cached.data,
    fromCache: cached.fromCache,
    isStale: cached.isStale,
    fetchedAt: cached.fetchedAt,
  };
}
