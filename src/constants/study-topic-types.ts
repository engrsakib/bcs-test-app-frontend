export const DEFAULT_STUDY_TOPIC_TYPE_OPTIONS = [
  { value: "grammar", label: "Grammar" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "comprehension", label: "Comprehension" },
  { value: "literature", label: "Literature" },
  { value: "general", label: "General" },
] as const;

export type StudyTopicTypeOption = {
  value: string;
  label: string;
};

export const formatStudyTopicType = (
  value: string,
  options: StudyTopicTypeOption[] = [...DEFAULT_STUDY_TOPIC_TYPE_OPTIONS]
) =>
  options.find((option) => option.value === value)?.label ??
  value.replace(/_/g, " ");
