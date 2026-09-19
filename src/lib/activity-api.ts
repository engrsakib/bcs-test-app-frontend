import { apiUrl } from "@/config/env";
import getCookie from "@/util/GetCookie";

export type ActivityAction =
  | "login"
  | "logout"
  | "created"
  | "updated"
  | "deleted"
  | "registered"
  | "submitted"
  | "proctoring_violation"
  | "exam_started"
  | "exam_submitted"
  | "exam_submitted_offline"
  | "exam_submitted_cheated";

export type ActivitySeverity = "normal" | "danger";

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
  severity?: ActivitySeverity;
  examNumber?: number;
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

/** Virtual filter (not stored on log rows); maps to proctoring / cheated actions. */
export const ACTIVITY_MODULE_CHEATED = "cheated" as const;

export type ActivityModuleFilter =
  | ActivityModule
  | typeof ACTIVITY_MODULE_CHEATED
  | "";

export const ACTIVITY_MODULES: {
  value: ActivityModuleFilter;
  label: string;
}[] = [
    { value: "", label: "All modules" },
    { value: ACTIVITY_MODULE_CHEATED, label: "Cheated" },
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
    { value: "proctoring_violation", label: "Exam proctoring" },
    { value: "exam_started", label: "Exam started" },
    { value: "exam_submitted", label: "Exam submitted" },
    { value: "exam_submitted_offline", label: "Offline submit" },
    { value: "exam_submitted_cheated", label: "Cheated submit" },
  ];

export function isDangerActivity(log: Pick<ActivityLogEntry, "action" | "severity">) {
  if (log.severity === "danger") return true;
  return (
    log.action === "proctoring_violation" ||
    log.action === "exam_submitted_offline" ||
    log.action === "exam_submitted_cheated"
  );
}

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
