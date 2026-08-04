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
}

export interface ExamDraftSession {
  formData?: ExamFormDraft;
  selectedQuestions: ExamQuestion[];
  examNumber?: string;
}

const STORAGE_KEY = "exam-draft-session";
const PENDING_QUESTION_KEY = "exam-pending-question";

export function saveExamDraft(session: ExamDraftSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadExamDraft(): ExamDraftSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamDraftSession;
  } catch {
    return null;
  }
}

export function updateSelectedQuestions(questions: ExamQuestion[]): void {
  const draft = loadExamDraft() ?? { selectedQuestions: [] };
  saveExamDraft({ ...draft, selectedQuestions: questions });
}

export function clearExamDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function setPendingExamQuestion(question: ExamQuestion): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_QUESTION_KEY, JSON.stringify(question));
}

export function consumePendingExamQuestion(): ExamQuestion | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_QUESTION_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_QUESTION_KEY);
  try {
    return JSON.parse(raw) as ExamQuestion;
  } catch {
    return null;
  }
}
