export const STUDY_TOPIC_TYPE_OPTIONS = [
  { value: "grammar", label: "Grammar" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "comprehension", label: "Comprehension" },
  { value: "literature", label: "Literature" },
  { value: "general", label: "General" },
] as const;

export const formatStudyTopicType = (value: string) =>
  STUDY_TOPIC_TYPE_OPTIONS.find((o) => o.value === value)?.label ??
  value.replace(/_/g, " ");
