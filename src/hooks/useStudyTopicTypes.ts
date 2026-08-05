"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_STUDY_TOPIC_TYPE_OPTIONS } from "@/constants/study-topic-types";
import {
  createStudyTopicType,
  deleteStudyTopicType,
  fetchStudyTopicTypes,
  type StudyTopicTypeItem,
} from "@/lib/study-topic-type-api";
import {
  addPendingStudyTopicType,
  loadPendingStudyTopicTypes,
  mergeStudyTopicTypeOptions,
  removePendingStudyTopicType,
  removePendingStudyTopicTypeByValue,
  slugifyStudyTopicTypeLabel,
  syncPendingStudyTopicTypesToServer,
} from "@/lib/study-topic-type-storage";
import { notify } from "@/lib/toast";

const FALLBACK_TYPES: StudyTopicTypeItem[] = DEFAULT_STUDY_TOPIC_TYPE_OPTIONS.map(
  (option) => ({
    ...option,
    isDefault: true,
  })
);

function isNetworkOrServerError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;

  const status = (error as Error & { status?: number }).status;
  if (status && status >= 500) return true;

  return (
    error.message.includes("Failed to fetch") ||
    error.message.includes("NetworkError") ||
    error.message.includes("fetch")
  );
}

export function isCustomStudyTopicType(option: StudyTopicTypeItem): boolean {
  return option.isDefault === false || option.isPending === true;
}

export function useStudyTopicTypes() {
  const [options, setOptions] = useState<StudyTopicTypeItem[]>(FALLBACK_TYPES);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const remote = await fetchStudyTopicTypes();
      const pending = loadPendingStudyTopicTypes();
      const merged = mergeStudyTopicTypeOptions(
        remote.length ? remote : FALLBACK_TYPES,
        pending
      );
      setOptions(merged);
      return merged;
    } catch {
      const pending = loadPendingStudyTopicTypes();
      const merged = mergeStudyTopicTypeOptions(FALLBACK_TYPES, pending);
      setOptions(merged);
      return merged;
    }
  }, []);

  const syncPendingTypes = useCallback(async () => {
    setSyncing(true);

    try {
      await syncPendingStudyTopicTypesToServer();
      await refresh();
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);

      try {
        await syncPendingTypes();
        if (!active) return;
      } catch {
        if (!active) return;
        setOptions(
          mergeStudyTopicTypeOptions(FALLBACK_TYPES, loadPendingStudyTopicTypes())
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    const handleOnline = () => {
      syncPendingTypes();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      active = false;
      window.removeEventListener("online", handleOnline);
    };
  }, [syncPendingTypes]);

  const addType = useCallback(
    async (label: string): Promise<StudyTopicTypeItem | null> => {
      const trimmed = label.trim();

      if (!trimmed) {
        notify.warning("Missing Name", "Please enter a type name");
        return null;
      }

      const value = slugifyStudyTopicTypeLabel(trimmed);
      const duplicate = options.some(
        (option) =>
          option.value === value ||
          option.label.toLowerCase() === trimmed.toLowerCase()
      );

      if (duplicate) {
        notify.warning("Duplicate Type", "This type already exists");
        return null;
      }

      try {
        const created = await createStudyTopicType({ label: trimmed, value });
        await refresh();
        notify.success("Type Added", `"${created.label}" saved to database`);
        return created;
      } catch (error) {
        if (!isNetworkOrServerError(error)) {
          const message =
            error instanceof Error ? error.message : "Failed to add type";
          notify.error("Add Failed", message);
          return null;
        }

        const pending = addPendingStudyTopicType(trimmed, value);
        const localType: StudyTopicTypeItem = {
          label: trimmed,
          value,
          isDefault: false,
          isPending: true,
          pendingId: pending.id,
        };
        setOptions((prev) => mergeStudyTopicTypeOptions([...prev, localType]));
        notify.info(
          "Saved Locally",
          "Server is unavailable. Type saved locally and will sync when the server is back."
        );
        return localType;
      }
    },
    [options, refresh]
  );

  const deleteType = useCallback(
    async (option: StudyTopicTypeItem): Promise<boolean> => {
      if (!isCustomStudyTopicType(option)) {
        notify.warning("Cannot Delete", "Default types cannot be removed");
        return false;
      }

      try {
        if (option.isPending && option.pendingId) {
          removePendingStudyTopicType(option.pendingId);
        } else if (option.isPending) {
          removePendingStudyTopicTypeByValue(option.value);
        } else {
          await deleteStudyTopicType(option.value);
        }

        await refresh();
        notify.success("Type Deleted", `"${option.label}" removed`);
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete type";
        notify.error("Delete Failed", message);
        return false;
      }
    },
    [refresh]
  );

  const getLabel = useCallback(
    (value: string) =>
      options.find((option) => option.value === value)?.label ??
      value.replace(/_/g, " "),
    [options]
  );

  const optionList = useMemo(() => options, [options]);

  return {
    options: optionList,
    loading,
    syncing,
    addType,
    deleteType,
    refresh,
    syncPendingTypes,
    getLabel,
  };
}
