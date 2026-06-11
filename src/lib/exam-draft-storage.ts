export interface ExamQuestion {
  _id: string;
  title: string;
  description?: string;
  type: string;
  answerType: string;
  marks: number;
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
