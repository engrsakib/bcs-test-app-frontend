export const EXAM_ROUTINE_CATEGORY_OPTIONS = [
  "general",
  "technical",
  "exam",
  "bcs_preparation",
  "primary_teacher_preparation",
  "teacher_nibondhon_preparation",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  teacher_nibondhon_preparation: "NTRCA",
};

export const formatExamRoutineCategory = (value: string) =>
  CATEGORY_LABELS[value] ?? value.replace(/_/g, " ");
