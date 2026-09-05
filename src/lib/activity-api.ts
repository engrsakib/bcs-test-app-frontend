import { apiUrl } from "@/config/env";
import getCookie from "@/util/GetCookie";

export type ActivityAction =
  | "login"
  | "logout"
  | "created"
  | "updated"
  | "deleted"
  | "registered"
  | "submitted";

export type ActivityModule =
  | "study-plan"
  | "exam-solution"
  | "exam-routine"
  | "youtube"
  | "result"
  | "books"
  | "exam"
  | "guideline"
  | "announcement"
  | "question"
  | "user"
  | "admin"
  | "question-study-topic"
  | "auth";

export type ActivityLogEntry = {
  _id: string;
  actorId: string;
  actorName: string;
  action: ActivityAction;
  module: ActivityModule;
  title: string;
  description: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
};

export type ActivityListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ActivityListData = {
  data: ActivityLogEntry[];
  meta: ActivityListMeta;
};

export type ActivityApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: ActivityListData;
};

export type ActivityQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  action?: string;
  sortBy?: "createdAt" | "actorName";
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
};

export const ACTIVITY_MODULES: { value: ActivityModule | ""; label: string }[] =
  [
    { value: "", label: "All modules" },
    { value: "auth", label: "Auth" },
    { value: "admin", label: "Staff" },
    { value: "question", label: "Question" },
    { value: "exam", label: "Exam" },
    { value: "user", label: "Student" },
    { value: "books", label: "Books" },
    { value: "guideline", label: "Guideline" },
    { value: "announcement", label: "Announcement" },
    { value: "youtube", label: "Youtube" },
    { value: "result", label: "Result" },
    { value: "study-plan", label: "Study Plan" },
    { value: "exam-solution", label: "Exam Solution" },
    { value: "exam-routine", label: "Exam Routine" },
    { value: "question-study-topic", label: "Study Topic" },
  ];

export const ACTIVITY_ACTIONS: { value: ActivityAction | ""; label: string }[] =
  [
    { value: "", label: "All actions" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "created", label: "Created" },
    { value: "updated", label: "Updated" },
    { value: "deleted", label: "Deleted" },
    { value: "registered", label: "Registered" },
    { value: "submitted", label: "Submitted" },
  ];

function buildActivityQuery(params: ActivityQueryParams): string {
  const query = new URLSearchParams();

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));
  query.set("sortBy", params.sortBy ?? "createdAt");
  query.set("sortOrder", params.sortOrder ?? "desc");

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.module?.trim()) {
    query.set("module", params.module.trim());
  }

  if (params.action?.trim()) {
    query.set("action", params.action.trim());
  }

  if (params.dateFrom?.trim()) {
    query.set("dateFrom", params.dateFrom.trim());
  }

  if (params.dateTo?.trim()) {
    query.set("dateTo", params.dateTo.trim());
  }

  return query.toString();
}

export async function fetchActivityLogs(params: ActivityQueryParams = {}) {
  const accessToken = getCookie("access_token");
  const query = buildActivityQuery(params);

  const res = await fetch(`${apiUrl("/activity")}?${query}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: accessToken || "",
    },
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as ActivityApiResponse;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
