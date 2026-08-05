"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createStudyTopicType,
  fetchStudyTopicTypes,
  type StudyTopicTypeItem,
} from "@/lib/study-topic-type-api";
import {
  addPendingStudyTopicType,
  loadPendingStudyTopicTypes,
  mergeStudyTopicTypeOptions,
  slugifyStudyTopicTypeLabel,
  syncPendingStudyTopicTypesToServer,
} from "@/lib/study-topic-type-storage";
import { notify } from "@/lib/toast";

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

export function useStudyTopicTypes() {
  const [options, setOptions] = useState<StudyTopicTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    const remote = await fetchStudyTopicTypes();
    const pending = loadPendingStudyTopicTypes();
    setOptions(mergeStudyTopicTypeOptions(remote, pending));
    return remote;
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
        await refresh();
      } catch {
        if (!active) return;
        setOptions(mergeStudyTopicTypeOptions([], loadPendingStudyTopicTypes()));
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
  }, [refresh, syncPendingTypes]);

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
        notify.warning("Duplicate Type", "This study topic type already exists");
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

        addPendingStudyTopicType(trimmed, value);
        const localType = { label: trimmed, value };
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
    refresh,
    syncPendingTypes,
    getLabel,
  };
}
