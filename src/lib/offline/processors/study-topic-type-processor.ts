import {
  createStudyTopicType,
  fetchStudyTopicTypes,
} from "@/lib/study-topic-type-api";
import {
  loadPendingStudyTopicTypes,
  removePendingStudyTopicType,
} from "@/lib/study-topic-type-storage";

export async function syncPendingStudyTopicTypesFromQueue(): Promise<void> {
  const pending = loadPendingStudyTopicTypes();
  if (!pending.length) return;

  try {
    const remote = await fetchStudyTopicTypes();
    const remoteValues = new Set(remote.map((item) => item.value));

    for (const item of pending) {
      if (remoteValues.has(item.value)) {
        removePendingStudyTopicType(item.id);
        continue;
      }

      try {
        await createStudyTopicType({ label: item.label, value: item.value });
        removePendingStudyTopicType(item.id);
      } catch {
        // Keep pending until server accepts it.
      }
    }
  } catch {
    // Server still unavailable.
  }
}
