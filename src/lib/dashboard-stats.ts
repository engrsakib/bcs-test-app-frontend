import { ENV } from "@/config/env";
import getCookie from "@/util/GetCookie";

export interface ExamParticipation {
  exam_number: number;
  exam_name: string;
  participants: number;
  participationRate: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
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

type ExamListItem = {
  exam_number?: number;
  exam_name?: string;
  exam_date_time?: string;
};

const RECENT_EXAM_LIMIT = 10;

async function fetchSubmissionTiming(examNumber: number): Promise<{
  onTimeSubmissions: number;
  lateSubmissions: number;
}> {
  let page = 1;
  let totalPages = 1;
  let onTimeSubmissions = 0;
  let lateSubmissions = 0;
  const limit = 100;

  while (page <= totalPages) {
    const res = await fetch(
      `${ENV.BASE_URL}/results?examNum=${examNumber}&page=${page}&limit=${limit}`,
      { headers: authHeaders() }
    );
    const result = await res.json();

    if (!result.success || !Array.isArray(result.data?.data)) {
      break;
    }

    for (const row of result.data.data as { is_on_time?: boolean }[]) {
      if (row.is_on_time === false) {
        lateSubmissions += 1;
      } else {
        onTimeSubmissions += 1;
      }
    }

    totalPages = result.data.meta?.totalPage ?? 1;
    page += 1;
  }

  return { onTimeSubmissions, lateSubmissions };
}

async function fetchParticipantCount(examNumber: number): Promise<number> {
  try {
    const leaderboardRes = await fetch(
      `${ENV.BASE_URL}/results/${examNumber}/leaderboard?page=1&limit=1`,
      { headers: authHeaders() }
    );
    const leaderboardJson = await leaderboardRes.json();

    if (leaderboardJson.success && leaderboardJson.data?.meta) {
      return leaderboardJson.data.meta.totalResult ?? 0;
    }
  } catch {
    // Try the results search endpoint next.
  }

  try {
    const resultsRes = await fetch(
      `${ENV.BASE_URL}/results?examNum=${examNumber}&page=1&limit=1`,
      { headers: authHeaders() }
    );
    const resultsJson = await resultsRes.json();

    if (resultsJson.success && resultsJson.data?.meta) {
      return resultsJson.data.meta.totalResult ?? 0;
    }
  } catch {
    // Ignore per-exam fetch failures and treat as zero participants.
  }

  return 0;
}

async function fetchExamParticipationFallback(
  totalStudents: number
): Promise<ExamParticipation[]> {
  const res = await fetch(
    `${ENV.BASE_URL}/exam?page=1&limit=${RECENT_EXAM_LIMIT}`,
    { headers: authHeaders() }
  );
  const result = await res.json();

  if (!result.success || !Array.isArray(result.data?.data)) {
    return [];
  }

  const exams = (result.data.data as ExamListItem[])
    .map((exam) => {
      const examNumber = Number(exam.exam_number);
      if (!Number.isFinite(examNumber) || !exam.exam_name) {
        return null;
      }

      return {
        exam_number: examNumber,
        exam_name: exam.exam_name,
        exam_date_time: exam.exam_date_time,
      };
    })
    .filter((exam): exam is NonNullable<typeof exam> => exam !== null)
    .sort((a, b) => {
      const aTime = a.exam_date_time
        ? new Date(a.exam_date_time).getTime()
        : 0;
      const bTime = b.exam_date_time
        ? new Date(b.exam_date_time).getTime()
        : 0;
      return bTime - aTime;
    })
    .slice(0, RECENT_EXAM_LIMIT);

  return Promise.all(
    exams.map(async (exam) => {
      const [participants, timing] = await Promise.all([
        fetchParticipantCount(exam.exam_number),
        fetchSubmissionTiming(exam.exam_number),
      ]);
      const participationRate =
        totalStudents > 0 ? (participants / totalStudents) * 100 : 0;

      return {
        exam_number: exam.exam_number,
        exam_name: exam.exam_name,
        participants,
        participationRate: Math.round(participationRate * 100) / 100,
        onTimeSubmissions: timing.onTimeSubmissions,
        lateSubmissions: timing.lateSubmissions,
      };
    })
  );
}

function normalizeExamParticipation(item: ExamParticipation): ExamParticipation {
  return {
    ...item,
    onTimeSubmissions: item.onTimeSubmissions ?? 0,
    lateSubmissions: item.lateSubmissions ?? 0,
  };
}

async function enrichParticipationTiming(
  items: ExamParticipation[]
): Promise<ExamParticipation[]> {
  const needsTiming = items.some(
    (item) =>
      item.participants > 0 &&
      item.onTimeSubmissions === 0 &&
      item.lateSubmissions === 0
  );

  if (!needsTiming) {
    return items;
  }

  return Promise.all(
    items.map(async (item) => {
      if (item.participants === 0) {
        return item;
      }

      const timing = await fetchSubmissionTiming(item.exam_number);
      return {
        ...item,
        onTimeSubmissions: timing.onTimeSubmissions,
        lateSubmissions: timing.lateSubmissions,
      };
    })
  );
}

async function resolveExamParticipation(
  stats: DashboardStats
): Promise<ExamParticipation[]> {
  if (stats.examParticipation.length > 0) {
    const normalized = stats.examParticipation.map(normalizeExamParticipation);
    return enrichParticipationTiming(normalized);
  }

  if (stats.totalExams <= 0) {
    return [];
  }

  return fetchExamParticipationFallback(stats.totalStudents);
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
        const stats: DashboardStats = {
          ...data,
          examParticipation: data.examParticipation ?? [],
        };

        stats.examParticipation = await resolveExamParticipation(stats);
        return stats;
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
    examParticipation: await fetchExamParticipationFallback(totalStudents),
  };
}

export { defaultStats };
