import { ENV } from "@/config/env";
import getCookie from "@/util/GetCookie";

export interface ExamParticipation {
  exam_number: number;
  exam_name: string;
  participants: number;
  participationRate: number;
}

export interface DashboardStats {
  totalExams: number;
  completedExams: number;
  totalStudents: number;
  totalQuestions: number;
  totalGuidelines: number;
  totalYoutubeVideos: number;
  rokomariBooks: number;
  totalResults: number;
  examParticipation: ExamParticipation[];
}

const defaultStats: DashboardStats = {
  totalExams: 0,
  completedExams: 0,
  totalStudents: 0,
  totalQuestions: 0,
  totalGuidelines: 0,
  totalYoutubeVideos: 0,
  rokomariBooks: 0,
  totalResults: 0,
  examParticipation: [],
};

function authHeaders(): HeadersInit {
  return { Authorization: getCookie("access_token") || "" };
}

async function fetchMetaTotal(
  path: string,
  metaKey: "total" | "totalResult" = "total"
): Promise<number> {
  const res = await fetch(`${ENV.BASE_URL}${path}`, { headers: authHeaders() });
  const result = await res.json();

  if (!result.success || !result.data?.meta) {
    return 0;
  }

  return result.data.meta[metaKey] ?? 0;
}

async function fetchAllPaginated<T>(
  basePath: string,
  predicate?: (item: T) => boolean
): Promise<number> {
  let page = 1;
  let totalPages = 1;
  let count = 0;
  const limit = 100;

  while (page <= totalPages) {
    const separator = basePath.includes("?") ? "&" : "?";
    const res = await fetch(
      `${ENV.BASE_URL}${basePath}${separator}page=${page}&limit=${limit}`,
      { headers: authHeaders() }
    );
    const result = await res.json();

    if (!result.success || !Array.isArray(result.data?.data)) {
      break;
    }

    const items = result.data.data as T[];
    count += predicate ? items.filter(predicate).length : items.length;
    totalPages = result.data.meta?.totalPage ?? 1;
    page += 1;
  }

  return count;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const statsRes = await fetch(`${ENV.BASE_URL}/dashboard/stats`, {
      headers: authHeaders(),
    });

    if (statsRes.ok) {
      const statsJson = await statsRes.json();
      if (statsJson.success && statsJson.data) {
        const data = statsJson.data as DashboardStats;
        return {
          ...data,
          examParticipation: data.examParticipation ?? [],
        };
      }
    }
  } catch {
    // Fall back to individual list endpoints when stats API is unavailable.
  }

  const [
    totalExams,
    completedExams,
    totalStudents,
    totalQuestions,
    totalGuidelines,
    totalYoutubeVideos,
    totalBooks,
    totalResults,
  ] = await Promise.all([
    fetchMetaTotal("/exam?page=1&limit=1"),
    fetchAllPaginated<{ is_completed?: boolean }>(
      "/exam",
      (exam) => Boolean(exam.is_completed)
    ),
    fetchMetaTotal("/user?page=1&limit=1"),
    fetchMetaTotal("/question?page=1&limit=1"),
    fetchMetaTotal("/guideline?page=1&limit=1"),
    fetchMetaTotal("/youtube?page=1&limit=1"),
    fetchAllPaginated<{ sold_platform?: string }>(
      "/books",
      (book) => book.sold_platform === "rokomari"
    ),
    fetchMetaTotal("/results?page=1&limit=1", "totalResult"),
  ]);

  return {
    totalExams,
    completedExams,
    totalStudents,
    totalQuestions,
    totalGuidelines,
    totalYoutubeVideos,
    rokomariBooks: totalBooks,
    totalResults,
    examParticipation: [],
  };
}

export { defaultStats };
