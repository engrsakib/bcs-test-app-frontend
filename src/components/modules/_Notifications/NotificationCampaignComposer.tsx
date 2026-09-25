"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Loader2,
  Search,
  Send,
  Users,
  X,
  UserPlus,
} from "lucide-react";
import { ENV } from "@/config/env";
import { notify } from "@/lib/toast";
import {
  countWords,
  isBodyWithinWordLimit,
  MAX_CAMPAIGN_BODY_WORDS,
} from "@/lib/count-words";
import {
  createNotificationCampaign,
  fetchNotificationCampaigns,
  type NotificationCampaign,
  type CampaignAudienceMode,
} from "@/lib/notification-campaign-api";
import { confirmAction } from "@/components/ui/confirm-dialog";

type StudentPick = {
  _id: string;
  name: string;
  phone_number: string;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const BD_PHONE = /^01[0-9]{9}$/;

function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length >= 13) digits = digits.slice(3);
  if (digits.length === 10 && digits.startsWith("1")) digits = `0${digits}`;
  return BD_PHONE.test(digits) ? digits : null;
}

export default function NotificationCampaignComposer() {
  const [audienceMode, setAudienceMode] =
    useState<CampaignAudienceMode>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<StudentPick[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentPick[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [manualPhone, setManualPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const wordCount = useMemo(() => countWords(body), [body]);
  const canSubmit =
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    isBodyWithinWordLimit(body) &&
    (audienceMode === "all" || selected.length > 0) &&
    !submitting;

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchNotificationCampaigns(1, 10);
      if (res.success && res.data?.data) {
        setCampaigns(res.data.data);
      }
    } catch {
      notify.error("Failed to load campaign history");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const runSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    const token = getCookie("access_token");
    if (!token) {
      notify.error("Not authenticated");
      return;
    }
    setSearchLoading(true);
    try {
      const url = `${ENV.BASE_URL}/user?page=1&limit=20&search_query=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      const rows = (json?.data?.data ?? json?.data ?? []) as StudentPick[];
      setSearchResults(Array.isArray(rows) ? rows : []);
    } catch {
      notify.error("Student search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const addStudent = (student: StudentPick) => {
    if (selected.some((s) => s._id === student._id)) return;
    setSelected((prev) => [...prev, student]);
  };

  const addManualPhone = () => {
    const phone = normalizePhone(manualPhone);
    if (!phone) {
      notify.warning("Enter a valid Bangladesh phone (01XXXXXXXXX)");
      return;
    }
    if (selected.some((s) => s.phone_number === phone)) return;
    setSelected((prev) => [
      ...prev,
      { _id: `phone:${phone}`, name: phone, phone_number: phone },
    ]);
    setManualPhone("");
  };

  const removeSelected = (id: string) => {
    setSelected((prev) => prev.filter((s) => s._id !== id));
  };

  const handleSend = async () => {
    setSubmitting(true);
    try {
      const res = await createNotificationCampaign({
        subject: subject.trim(),
        body: body.trim(),
        audienceMode,
        phoneNumbers:
          audienceMode === "selected"
            ? selected.map((s) => s.phone_number)
            : undefined,
      });

      if (!res.success) {
        const extra = res.data as
          | { unresolvedPhones?: string[]; invalidPhones?: string[] }
          | undefined;
        const unresolved = extra?.unresolvedPhones ?? extra?.invalidPhones;
        if (unresolved?.length) {
          notify.error(`${res.message}: ${unresolved.join(", ")}`);
        } else {
          notify.error(res.message || "Failed to send notification");
        }
        return;
      }

      notify.success(res.message || "Campaign queued");
      setSubject("");
      setBody("");
      setSelected([]);
      void loadHistory();
    } catch {
      notify.error("Failed to send notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Send app notification
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Delivers push notification, in-app popup, and inbox entry. Message
            body limit: {MAX_CAMPAIGN_BODY_WORDS} words.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Audience
            </label>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setAudienceMode("all")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  audienceMode === "all"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Users className="inline h-4 w-4 mr-2" />
                All users
              </button>
              <button
                type="button"
                onClick={() => setAudienceMode("selected")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  audienceMode === "selected"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <UserPlus className="inline h-4 w-4 mr-2" />
                Specific users
              </button>
            </div>
          </div>

          {audienceMode === "selected" && (
            <div className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void runSearch()}
                  placeholder="Search by name or phone…"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void runSearch()}
                  disabled={searchLoading}
                  className="rounded-lg bg-emerald-700 text-white px-3 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul className="max-h-40 overflow-y-auto divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                  {searchResults.map((s) => (
                    <li
                      key={s._id}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span>
                        {s.name}{" "}
                        <span className="text-slate-500">{s.phone_number}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => addStudent(s)}
                        className="text-emerald-700 font-medium text-xs"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Or type phone 01XXXXXXXXX"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={addManualPhone}
                  className="rounded-lg border border-emerald-600 text-emerald-800 px-3 py-2 text-sm font-medium"
                >
                  Add phone
                </button>
              </div>
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.map((s) => (
                    <span
                      key={s._id}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-900"
                    >
                      {s.name !== s.phone_number ? `${s.name} · ` : ""}
                      {s.phone_number}
                      <button
                        type="button"
                        onClick={() => removeSelected(s._id)}
                        aria-label="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="text-xs text-slate-500 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Notification title"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <span
                className={`text-xs font-medium ${
                  wordCount > MAX_CAMPAIGN_BODY_WORDS
                    ? "text-red-600"
                    : "text-slate-500"
                }`}
              >
                {wordCount}/{MAX_CAMPAIGN_BODY_WORDS} words
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-y min-h-[140px]"
              placeholder="Write your message…"
            />
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={async () => {
              const ok = await confirmAction({
                title: "Send notification?",
                description:
                  audienceMode === "all"
                    ? `This will notify all app users with subject "${subject.trim()}".`
                    : `This will notify ${selected.length} user(s) with subject "${subject.trim()}".`,
                confirmText: "Send now",
              });
              if (ok) void handleSend();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Send notification
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">Preview</p>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-800 px-4 py-2 text-white text-xs font-semibold">
              MCQ Analysis · Push & popup
            </div>
            <div className="p-4 space-y-2">
              <p className="font-bold text-slate-900">
                {subject.trim() || "Subject preview"}
              </p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {body.trim() || "Message preview will appear here."}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Recipients:{" "}
            {audienceMode === "all"
              ? "All registered app users"
              : `${selected.length} selected user(s)`}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Recent campaigns
        </h2>
        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-slate-500">No campaigns yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Audience</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Delivered</th>
                  <th className="py-2">Sent</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-800 max-w-[200px] truncate">
                      {c.subject}
                    </td>
                    <td className="py-3 pr-4 capitalize">{c.audienceMode}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : c.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {c.stats?.inboxCreated ?? 0} inbox /{" "}
                      {c.stats?.pushSent ?? 0} push
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
