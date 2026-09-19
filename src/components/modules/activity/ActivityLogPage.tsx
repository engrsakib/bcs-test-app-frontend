"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  ACTIVITY_ACTIONS,
  ACTIVITY_MODULES,
  fetchActivityLogs,
  isDangerActivity,
  type ActivityLogEntry,
  type ActivityQueryParams,
} from "@/lib/activity-api";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const ACTIVITY_CLOCK_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

const ISO_STAMP =
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g;

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-US", ACTIVITY_CLOCK_OPTIONS);
}

function formatDescription(text: string) {
  return text.replace(ISO_STAMP, (iso) => formatDateTime(iso));
}

function actionBadgeClass(action: ActivityLogEntry["action"]) {
  switch (action) {
    case "login":
      return "bg-blue-100 text-blue-800";
    case "logout":
      return "bg-slate-100 text-slate-700";
    case "created":
      return "bg-emerald-100 text-emerald-800";
    case "updated":
      return "bg-amber-100 text-amber-800";
    case "deleted":
      return "bg-red-100 text-red-800";
    case "registered":
      return "bg-violet-100 text-violet-800";
    case "submitted":
      return "bg-cyan-100 text-cyan-800";
    case "proctoring_violation":
    case "exam_submitted_offline":
    case "exam_submitted_cheated":
      return "bg-rose-100 text-rose-900";
    case "exam_started":
      return "bg-indigo-100 text-indigo-900";
    case "exam_submitted":
      return "bg-teal-100 text-teal-900";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatActionLabel(action: string) {
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function formatModuleLabel(module: string) {
  if (module === "cheated") {
    return "Cheated";
  }
  return module
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ActivityLogPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<ActivityQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    module: "",
    action: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const loadLogs = useCallback(
    async (params: ActivityQueryParams, showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const { ok, data } = await fetchActivityLogs(params);

        if (ok && data.success && data.data) {
          setLogs(data.data.data);
          setMeta(data.data.meta);
        } else {
          setLogs([]);
          setMeta((prev) => ({ ...prev, total: 0, totalPages: 1 }));
        }
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadLogs(filters);
  }, [filters, loadLogs]);

  const handleFilterChange = (patch: Partial<ActivityQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-700" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Activity
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Audit log for staff actions and student exam lifecycle (start,
            submit, offline sync, proctoring violations).
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs(filters, true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, phone (student/admin), title..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={filters.module || ""}
            onChange={(e) =>
              handleFilterChange({ module: e.target.value, page: 1 })
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {ACTIVITY_MODULES.map((option) => (
              <option
                key={option.value || "all-modules"}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.action || ""}
            onChange={(e) =>
              handleFilterChange({ action: e.target.value, page: 1 })
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {ACTIVITY_ACTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={filters.sortBy || "createdAt"}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as ActivityQueryParams["sortBy"],
                  page: 1,
                })
              }
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="createdAt">Sort by Time</option>
              <option value="actorName">Sort by Admin</option>
            </select>

            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              title={
                filters.sortOrder === "asc"
                  ? "Ascending order"
                  : "Descending order"
              }
            >
              {filters.sortOrder === "asc" ? (
                <ArrowUpAZ className="h-4 w-4" />
              ) : (
                <ArrowDownAZ className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) =>
              handleFilterChange({ dateFrom: e.target.value, page: 1 })
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) =>
              handleFilterChange({ dateTo: e.target.value, page: 1 })
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Admin
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Module
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading activity logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const danger = isDangerActivity(log);
                  return (
                  <tr
                    key={log._id}
                    className={
                      danger
                        ? "bg-rose-50/90 hover:bg-rose-50"
                        : "hover:bg-gray-50/80"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {log.actorName}
                      {log.examNumber != null && (
                        <div className="mt-0.5 text-xs font-normal text-gray-500">
                          Exam #{log.examNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${actionBadgeClass(log.action)}`}
                      >
                        {formatActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatModuleLabel(log.module)}
                    </td>
                    <td className="max-w-md px-4 py-3 text-gray-700">
                      <div className="font-medium text-gray-900">{log.title}</div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {formatDescription(log.description)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {formatDateTime(log.createdAt)}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            Showing {startItem}-{endItem} of {meta.total}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange({
                  limit: Number(e.target.value),
                  page: 1,
                })
              }
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={meta.page <= 1 || loading}
              onClick={() =>
                handleFilterChange({ page: Math.max(1, meta.page - 1) })
              }
              className="inline-flex items-center rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              type="button"
              disabled={meta.page >= meta.totalPages || loading}
              onClick={() =>
                handleFilterChange({
                  page: Math.min(meta.totalPages, meta.page + 1),
                })
              }
              className="inline-flex items-center rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
