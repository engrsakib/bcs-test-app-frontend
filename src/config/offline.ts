export const OFFLINE_ENABLED =
  process.env.NEXT_PUBLIC_OFFLINE_ENABLED !== "false";

export const CACHE_TTL = {
  books: 24 * 60 * 60 * 1000,
  guidelines: 24 * 60 * 60 * 1000,
  studyPlans: 12 * 60 * 60 * 1000,
  announcements: 60 * 60 * 1000,
  examRoutine: 12 * 60 * 60 * 1000,
  examSolution: 12 * 60 * 60 * 1000,
  exams: 6 * 60 * 60 * 1000,
  questions: 6 * 60 * 60 * 1000,
  students: 60 * 60 * 1000,
  default: 60 * 60 * 1000,
} as const;

export const NOTIFICATION_CACHE_LIMIT = 200;
