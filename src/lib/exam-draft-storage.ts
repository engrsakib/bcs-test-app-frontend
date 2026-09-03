import {
  deleteDraft,
  loadDraft,
  saveDraft,
  debounce,
} from "@/lib/offline/draft-store";

export interface ExamQuestion {
  _id: string;
  title: string;
  description?: string;
  type: string;
  answerType: string;
  marks: number;
  category_id?:
    | string
    | {
        _id: string;
        name: string;
        category_number?: number;
        type?: string;
      };
}

export interface ExamFormDraft {
  exam_name: string;
  exam_date_time: string;
  duration_minutes: string;
  negative_mark: number;
  subject: string;
}

export interface ExamDraftSession {
  formData?: ExamFormDraft;
  selectedQuestions: ExamQuestion[];
  examNumber?: string;
}

const DRAFT_ID = "exam-create";
const DRAFT_TYPE = "exam-create";
const PENDING_QUESTION_DRAFT_ID = "exam-pending-question";
const PENDING_QUESTION_TYPE = "pending-question";

const LEGACY_STORAGE_KEY = "exam-draft-session";
const LEGACY_PENDING_QUESTION_KEY = "exam-pending-question";

function isBrowser() {
  return typeof window !== "undefined";
}

function readLegacyDraft(): ExamDraftSession | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamDraftSession;
  } catch {
    return null;
  }
}

function writeLegacyDraft(session: ExamDraftSession): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(session));
}

function readLegacyPendingQuestion(): ExamQuestion | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(LEGACY_PENDING_QUESTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamQuestion;
  } catch {
    return null;
  }
}

function writeLegacyPendingQuestion(question: ExamQuestion): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(LEGACY_PENDING_QUESTION_KEY, JSON.stringify(question));
}

function clearLegacyPendingQuestion(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(LEGACY_PENDING_QUESTION_KEY);
}

const persistDraftDebounced = debounce((session: ExamDraftSession) => {
  void saveDraft(DRAFT_ID, DRAFT_TYPE, session);
}, 500);

export function saveExamDraft(session: ExamDraftSession): void {
  writeLegacyDraft(session);
  persistDraftDebounced(session);
  void saveDraft(DRAFT_ID, DRAFT_TYPE, session);
}

export function loadExamDraft(): ExamDraftSession | null {
  return readLegacyDraft();
}

export async function loadExamDraftAsync(): Promise<ExamDraftSession | null> {
  const indexed = await loadDraft<ExamDraftSession>(DRAFT_ID);
  if (indexed) {
    writeLegacyDraft(indexed);
    return indexed;
  }

  const legacy = readLegacyDraft();
  if (legacy) {
    await saveDraft(DRAFT_ID, DRAFT_TYPE, legacy);
  }

  return legacy;
}

export function updateSelectedQuestions(questions: ExamQuestion[]): void {
  const draft = loadExamDraft() ?? { selectedQuestions: [] };
  saveExamDraft({ ...draft, selectedQuestions: questions });
}

export async function clearExamDraft(): Promise<void> {
  if (isBrowser()) {
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  await deleteDraft(DRAFT_ID);
}

export function setPendingExamQuestion(question: ExamQuestion): void {
  writeLegacyPendingQuestion(question);
  void saveDraft(PENDING_QUESTION_DRAFT_ID, PENDING_QUESTION_TYPE, question);
}

export function consumePendingExamQuestion(): ExamQuestion | null {
  const legacy = readLegacyPendingQuestion();
  clearLegacyPendingQuestion();
  void deleteDraft(PENDING_QUESTION_DRAFT_ID);
  return legacy;
}

export async function consumePendingExamQuestionAsync(): Promise<ExamQuestion | null> {
  const indexed = await loadDraft<ExamQuestion>(PENDING_QUESTION_DRAFT_ID);
  if (indexed) {
    clearLegacyPendingQuestion();
    await deleteDraft(PENDING_QUESTION_DRAFT_ID);
    return indexed;
  }

  return consumePendingExamQuestion();
}

export async function hydrateExamDraftsFromIndexedDb(): Promise<void> {
  const draft = await loadExamDraftAsync();
  if (draft) {
    writeLegacyDraft(draft);
  }

  const pending = await loadDraft<ExamQuestion>(PENDING_QUESTION_DRAFT_ID);
  if (pending) {
    writeLegacyPendingQuestion(pending);
  }
}

if (isBrowser()) {
  void hydrateExamDraftsFromIndexedDb();
}
