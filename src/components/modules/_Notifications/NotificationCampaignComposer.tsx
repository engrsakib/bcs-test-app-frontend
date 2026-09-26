"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Loader2,
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
  fetchCampaignRecipients,
  fetchNotificationCampaigns,
  type CampaignListFilters,
  type CampaignListMeta,
  type CampaignRecipientRow,
  type CampaignRecipientSegment,
  type CampaignStatus,
  type NotificationCampaign,
  type CampaignAudienceMode,
} from "@/lib/notification-campaign-api";
import { confirmAction } from "@/components/ui/confirm-dialog";

type StudentPick = {
  _id: string;
  name: string;
  phone_number: string;
};

type ExamOption = {
  exam_number: number;
  exam_name: string;
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

function rowToStudent(row: CampaignRecipientRow): StudentPick {
  const id = row.userId ?? `phone:${row.phone_number}`;
  return {
    _id: id,
    name: row.name,
    phone_number: row.phone_number,
  };
}

function audienceLabel(c: NotificationCampaign): string {
  if (c.audienceMode === "all") return "All users";
  const n = c.selectedPhoneNumbers?.length ?? 0;
  return n > 0 ? `${n} selected` : "Selected";
}

export default function NotificationCampaignComposer() {
  const [audienceMode, setAudienceMode] =
    useState<CampaignAudienceMode>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<StudentPick[]>([]);
  const [manualPhone, setManualPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [recipientSource, setRecipientSource] = useState<"browse" | "exam">(
    "browse"
  );
  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseSearch, setBrowseSearch] = useState("");
  const [browseDebounced, setBrowseDebounced] = useState("");
  const [browsePage, setBrowsePage] = useState(1);
  const [browseRows, setBrowseRows] = useState<CampaignRecipientRow[]>([]);
  const [browseMeta, setBrowseMeta] = useState<CampaignListMeta | null>(null);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseChecked, setBrowseChecked] = useState<Set<string>>(new Set());

  const [allExams, setAllExams] = useState<ExamOption[]>([]);
  const [examSearch, setExamSearch] = useState("");
  const [filteredExams, setFilteredExams] = useState<ExamOption[]>([]);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamOption | null>(null);
  const [examSegment, setExamSegment] = useState<
    "top_by_exam" | "not_attended"
  >("top_by_exam");
  const [topN, setTopN] = useState(50);
  const [examPage, setExamPage] = useState(1);
  const [examRows, setExamRows] = useState<CampaignRecipientRow[]>([]);
  const [examMeta, setExamMeta] = useState<CampaignListMeta | null>(null);
  const [examLoading, setExamLoading] = useState(false);
  const [examChecked, setExamChecked] = useState<Set<string>>(new Set());

  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [historyMeta, setHistoryMeta] = useState<CampaignListMeta | null>(
    null
  );
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  const [historySubjectInput, setHistorySubjectInput] = useState("");
  const [historySubject, setHistorySubject] = useState("");
  const [historyFilters, setHistoryFilters] = useState<CampaignListFilters>({
    status: "",
    audienceMode: "",
    dateFrom: "",
    dateTo: "",
  });

  const pickerRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(() => countWords(body), [body]);
  const canSubmit =
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    isBodyWithinWordLimit(body) &&
    (audienceMode === "all" || selected.length > 0) &&
    !submitting;

  useEffect(() => {
    const t = setTimeout(() => setBrowseDebounced(browseSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [browseSearch]);

  useEffect(() => {
    const t = setTimeout(() => setHistorySubject(historySubjectInput.trim()), 300);
    return () => clearTimeout(t);
  }, [historySubjectInput]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historySubject, historyFilters, historyLimit]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchNotificationCampaigns(
        historyPage,
        historyLimit,
        { ...historyFilters, search: historySubject }
      );
      if (res.success && res.data?.data) {
        setCampaigns(res.data.data);
        setHistoryMeta(res.data.meta);
      }
    } catch {
      notify.error("Failed to load campaign history");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyPage, historyLimit, historyFilters, historySubject]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const loadBrowse = useCallback(async () => {
    setBrowseLoading(true);
    try {
      const res = await fetchCampaignRecipients({
        segment: "browse",
        page: browsePage,
        limit: 20,
        search: browseDebounced || undefined,
      });
      if (res.success && res.data) {
        setBrowseRows(res.data.data);
        setBrowseMeta(res.data.meta);
      } else {
        notify.error(res.message || "Failed to load students");
      }
    } catch {
      notify.error("Failed to load students");
    } finally {
      setBrowseLoading(false);
    }
  }, [browsePage, browseDebounced]);

  useEffect(() => {
    if (
      audienceMode !== "selected" ||
      recipientSource !== "browse" ||
      !browseOpen
    ) {
      return;
    }
    void loadBrowse();
  }, [audienceMode, recipientSource, browseOpen, loadBrowse]);

  useEffect(() => {
    setBrowsePage(1);
  }, [browseDebounced]);

  const loadExams = useCallback(async () => {
    const token = getCookie("access_token");
    if (!token) return;
    try {
      const response = await fetch(
        `${ENV.BASE_URL}/exam/exam-search?exam_name=`,
        { headers: { Authorization: token } }
      );
      const json = await response.json();
      if (json.success && json.data) {
        setAllExams(json.data);
        setFilteredExams(json.data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (recipientSource === "exam" && audienceMode === "selected") {
      void loadExams();
    }
  }, [recipientSource, audienceMode, loadExams]);

  useEffect(() => {
    if (!examSearch.trim()) {
      setFilteredExams(allExams);
      return;
    }
    const q = examSearch.toLowerCase();
    setFilteredExams(
      allExams.filter(
        (e) =>
          e.exam_name.toLowerCase().includes(q) ||
          String(e.exam_number).includes(q)
      )
    );
  }, [examSearch, allExams]);

  const loadExamRecipients = useCallback(async () => {
    if (!selectedExam) return;
    setExamLoading(true);
    try {
      const segment: CampaignRecipientSegment =
        examSegment === "top_by_exam" ? "top_by_exam" : "not_attended";
      const res = await fetchCampaignRecipients({
        segment,
        page: examPage,
        limit: 20,
        examNumber: selectedExam.exam_number,
        topN: examSegment === "top_by_exam" ? topN : undefined,
        search:
          examSegment === "not_attended" ? browseDebounced || undefined : undefined,
      });
      if (res.success && res.data) {
        setExamRows(res.data.data);
        setExamMeta(res.data.meta);
      } else {
        notify.error(res.message || "Failed to load exam recipients");
      }
    } catch {
      notify.error("Failed to load exam recipients");
    } finally {
      setExamLoading(false);
    }
  }, [selectedExam, examSegment, examPage, topN, browseDebounced]);

  useEffect(() => {
    if (
      audienceMode !== "selected" ||
      recipientSource !== "exam" ||
      !selectedExam
    ) {
      return;
    }
    void loadExamRecipients();
  }, [audienceMode, recipientSource, selectedExam, loadExamRecipients]);

  useEffect(() => {
    setExamPage(1);
  }, [selectedExam, examSegment, topN, browseDebounced]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node)
      ) {
        setBrowseOpen(false);
      }
      const target = e.target as HTMLElement;
      if (!target.closest(".campaign-exam-search")) {
        setShowExamDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const addMany = (rows: CampaignRecipientRow[]) => {
    setSelected((prev) => {
      const phones = new Set(prev.map((s) => s.phone_number));
      const next = [...prev];
      for (const row of rows) {
        if (phones.has(row.phone_number)) continue;
        phones.add(row.phone_number);
        next.push(rowToStudent(row));
      }
      return next;
    });
  };

  const toggleChecked = (
    set: React.Dispatch<React.SetStateAction<Set<string>>>,
    phone: string
  ) => {
    set((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) next.delete(phone);
      else next.add(phone);
      return next;
    });
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

  const resetHistoryFilters = () => {
    setHistorySubjectInput("");
    setHistorySubject("");
    setHistoryFilters({
      status: "",
      audienceMode: "",
      dateFrom: "",
      dateTo: "",
    });
    setHistoryPage(1);
  };

  const historyTotalPages = historyMeta?.totalPage ?? 1;
  const historyFrom = historyMeta
    ? (historyMeta.page - 1) * historyMeta.limit + 1
    : 0;
  const historyTo = historyMeta
    ? Math.min(historyMeta.page * historyMeta.limit, historyMeta.total)
    : 0;

  const renderRecipientList = (
    rows: CampaignRecipientRow[],
    checked: Set<string>,
    setChecked: React.Dispatch<React.SetStateAction<Set<string>>>,
    showScore: boolean
  ) => (
    <ul className="max-h-52 overflow-y-auto divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {rows.map((row) => (
        <li
          key={row.phone_number}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
        >
          <input
            type="checkbox"
            checked={checked.has(row.phone_number)}
            onChange={() => toggleChecked(setChecked, row.phone_number)}
            className="rounded border-slate-300"
          />
          <span className="flex-1 min-w-0">
            <span className="font-medium text-slate-800">{row.name}</span>{" "}
            <span className="text-slate-500">{row.phone_number}</span>
          </span>
          {showScore && row.rank != null && (
            <span className="text-xs text-slate-500 shrink-0">
              #{row.rank} · {row.score ?? "—"}
            </span>
          )}
        </li>
      ))}
      {rows.length === 0 && (
        <li className="px-3 py-4 text-sm text-slate-500 text-center">
          No students found
        </li>
      )}
    </ul>
  );

  const renderListToolbar = (
    rows: CampaignRecipientRow[],
    checked: Set<string>,
    setChecked: React.Dispatch<React.SetStateAction<Set<string>>>,
    meta: CampaignListMeta | null,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    loading: boolean
  ) => (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        className="rounded-md border border-slate-200 px-2 py-1 hover:bg-white"
        onClick={() => {
          setChecked(new Set(rows.map((r) => r.phone_number)));
        }}
      >
        Select page
      </button>
      <button
        type="button"
        className="rounded-md bg-emerald-700 text-white px-2 py-1 font-medium disabled:opacity-50"
        disabled={checked.size === 0}
        onClick={() => {
          const picked = rows.filter((r) => checked.has(r.phone_number));
          addMany(picked);
          setChecked(new Set());
          notify.success(`Added ${picked.length} recipient(s)`);
        }}
      >
        Add selected ({checked.size})
      </button>
      <button
        type="button"
        className="rounded-md border border-emerald-600 text-emerald-800 px-2 py-1 font-medium disabled:opacity-50"
        disabled={rows.length === 0}
        onClick={() => {
          addMany(rows);
          notify.success(`Added ${rows.length} on this page`);
        }}
      >
        Add all on page
      </button>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          disabled={loading || page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="p-1 rounded border border-slate-200 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-slate-500">
          {meta ? `${meta.page} / ${meta.totalPage}` : "—"}
        </span>
        <button
          type="button"
          disabled={loading || !meta?.hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="p-1 rounded border border-slate-200 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

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
            <div
              ref={pickerRef}
              className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-100"
            >
              <div className="flex gap-2 p-1 rounded-lg bg-white border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setRecipientSource("browse");
                    setBrowseOpen(true);
                  }}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold ${
                    recipientSource === "browse"
                      ? "bg-emerald-700 text-white"
                      : "text-slate-600"
                  }`}
                >
                  All students (A–Z)
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientSource("exam")}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold ${
                    recipientSource === "exam"
                      ? "bg-emerald-700 text-white"
                      : "text-slate-600"
                  }`}
                >
                  By exam
                </button>
              </div>

              {recipientSource === "browse" && (
                <>
                  <input
                    value={browseSearch}
                    onChange={(e) => setBrowseSearch(e.target.value)}
                    onFocus={() => setBrowseOpen(true)}
                    placeholder="Search by name or phone…"
                    aria-expanded={browseOpen}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                  />
                  {browseOpen && (
                    <div className="space-y-2">
                      {browseLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
                        </div>
                      ) : (
                        <>
                          {renderListToolbar(
                            browseRows,
                            browseChecked,
                            setBrowseChecked,
                            browseMeta,
                            browsePage,
                            setBrowsePage,
                            browseLoading
                          )}
                          {renderRecipientList(
                            browseRows,
                            browseChecked,
                            setBrowseChecked,
                            false
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {recipientSource === "exam" && (
                <div className="space-y-3">
                  <div className="relative campaign-exam-search">
                    <input
                      value={examSearch}
                      onChange={(e) => {
                        setExamSearch(e.target.value);
                        setShowExamDropdown(true);
                      }}
                      onFocus={() => setShowExamDropdown(true)}
                      placeholder="Search exam by name or number…"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    />
                    {showExamDropdown && filteredExams.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                        {filteredExams.slice(0, 15).map((exam) => (
                          <li key={exam.exam_number}>
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-emerald-50"
                              onClick={() => {
                                setSelectedExam(exam);
                                setExamSearch(
                                  `#${exam.exam_number} · ${exam.exam_name}`
                                );
                                setShowExamDropdown(false);
                              }}
                            >
                              #{exam.exam_number} · {exam.exam_name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {selectedExam && (
                    <>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={examSegment === "top_by_exam"}
                            onChange={() => setExamSegment("top_by_exam")}
                          />
                          Top students
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={examSegment === "not_attended"}
                            onChange={() => setExamSegment("not_attended")}
                          />
                          Not attended yet
                        </label>
                        {examSegment === "top_by_exam" && (
                          <label className="flex items-center gap-2 ml-auto">
                            Top
                            <input
                              type="number"
                              min={1}
                              max={200}
                              value={topN}
                              onChange={(e) =>
                                setTopN(Number(e.target.value) || 50)
                              }
                              className="w-16 rounded border border-slate-200 px-2 py-1 text-sm"
                            />
                          </label>
                        )}
                      </div>
                      {examSegment === "not_attended" && (
                        <input
                          value={browseSearch}
                          onChange={(e) => setBrowseSearch(e.target.value)}
                          placeholder="Filter not-attended by name or phone…"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                        />
                      )}
                      {examLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
                        </div>
                      ) : (
                        <>
                          {renderListToolbar(
                            examRows,
                            examChecked,
                            setExamChecked,
                            examMeta,
                            examPage,
                            setExamPage,
                            examLoading
                          )}
                          {renderRecipientList(
                            examRows,
                            examChecked,
                            setExamChecked,
                            examSegment === "top_by_exam"
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Or type phone 01XXXXXXXXX"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent campaigns</h2>
          <button
            type="button"
            onClick={() => setShowHistoryFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showHistoryFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {showHistoryFilters && (
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">
                Subject search
              </label>
              <input
                value={historySubjectInput}
                onChange={(e) => setHistorySubjectInput(e.target.value)}
                placeholder="Search subject…"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Status
              </label>
              <select
                value={historyFilters.status ?? ""}
                onChange={(e) =>
                  setHistoryFilters((f) => ({
                    ...f,
                    status: e.target.value as CampaignStatus | "",
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option value="">All statuses</option>
                <option value="queued">Queued</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Audience
              </label>
              <select
                value={historyFilters.audienceMode ?? ""}
                onChange={(e) =>
                  setHistoryFilters((f) => ({
                    ...f,
                    audienceMode: e.target.value as CampaignAudienceMode | "",
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option value="">All audiences</option>
                <option value="all">All users</option>
                <option value="selected">Selected users</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                From date
              </label>
              <input
                type="date"
                value={historyFilters.dateFrom ?? ""}
                onChange={(e) =>
                  setHistoryFilters((f) => ({
                    ...f,
                    dateFrom: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                To date
              </label>
              <input
                type="date"
                value={historyFilters.dateTo ?? ""}
                onChange={(e) =>
                  setHistoryFilters((f) => ({
                    ...f,
                    dateTo: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetHistoryFilters}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}

        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No campaigns match your filters.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 bg-slate-50 border-b">
                    <th className="py-3 px-4 font-semibold">Subject</th>
                    <th className="py-3 px-4 font-semibold">Audience</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Delivered</th>
                    <th className="py-3 px-4 font-semibold">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-slate-100 hover:bg-slate-50/80"
                    >
                      <td
                        className="py-3 px-4 font-medium text-slate-800 max-w-[220px] truncate"
                        title={c.subject}
                      >
                        {c.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {audienceLabel(c)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
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
                      <td className="py-3 px-4 text-slate-600">
                        {c.stats?.inboxCreated ?? 0} inbox /{" "}
                        {c.stats?.pushSent ?? 0} push
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
              <p className="text-slate-600">
                Showing {historyFrom}–{historyTo} of {historyMeta?.total ?? 0}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-slate-600">
                  Per page
                  <select
                    value={historyLimit}
                    onChange={(e) => setHistoryLimit(Number(e.target.value))}
                    className="rounded-lg border border-slate-200 px-2 py-1 bg-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
                <button
                  type="button"
                  disabled={historyPage <= 1}
                  onClick={() => setHistoryPage((p) => p - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="text-slate-500">
                  Page {historyPage} of {historyTotalPages}
                </span>
                <button
                  type="button"
                  disabled={historyPage >= historyTotalPages}
                  onClick={() => setHistoryPage((p) => p + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
