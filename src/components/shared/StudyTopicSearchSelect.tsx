"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type StudyTopicOption = {
  _id: string;
  name: string;
  category_number: number | string;
};

type StudyTopicSearchSelectProps = {
  label?: string;
  value: string;
  onChange: (id: string) => void;
  topics: StudyTopicOption[];
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Match value to Mongo _id or category_number (for filters). */
  valueKey?: "id" | "category_number";
  placeholder?: string;
  hideLabel?: boolean;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  /** Pin “all topics” control in the panel header (filter dropdowns). */
  allOptionInHeader?: boolean;
  searchPlaceholder?: string;
  getTopicLabel?: (topic: StudyTopicOption) => string;
  listMaxHeightClass?: string;
  buttonClassName?: string;
  focusRingClassName?: string;
  accent?: "blue" | "emerald";
};

function getTopicValue(
  topic: StudyTopicOption,
  valueKey: "id" | "category_number"
) {
  return valueKey === "category_number"
    ? String(topic.category_number)
    : topic._id;
}

function formatTopicLabel(topic: StudyTopicOption) {
  return `${topic.name} (${topic.category_number})`;
}

function topicMatchesQuery(topic: StudyTopicOption, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const name = topic.name.toLowerCase();
  const num = String(topic.category_number).toLowerCase();
  return name.includes(q) || num.includes(q);
}

export default function StudyTopicSearchSelect({
  label = "Study Topic",
  value,
  onChange,
  topics,
  loading = false,
  required = false,
  disabled = false,
  valueKey = "id",
  placeholder: placeholderProp,
  hideLabel = false,
  includeAllOption = false,
  allOptionLabel = "All topics",
  allOptionInHeader = false,
  searchPlaceholder = "Search by name or number...",
  getTopicLabel = formatTopicLabel,
  listMaxHeightClass = "max-h-60",
  buttonClassName = "",
  focusRingClassName = "focus:ring-blue-500 focus:border-blue-500",
  accent = "blue",
}: StudyTopicSearchSelectProps) {
  const itemHover = accent === "emerald" ? "hover:bg-emerald-50" : "hover:bg-blue-50";
  const itemSelected =
    accent === "emerald"
      ? "bg-emerald-50 font-medium text-emerald-900"
      : "bg-blue-50 font-medium text-blue-900";
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => topics.find((t) => getTopicValue(t, valueKey) === value),
    [topics, value, valueKey],
  );

  const filtered = useMemo(
    () => topics.filter((t) => topicMatchesQuery(t, search)),
    [topics, search],
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    const t = window.setTimeout(() => searchRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(t);
    };
  }, [open]);

  const isDisabled = disabled || loading;
  const placeholder =
    placeholderProp ?? (loading ? "Loading topics..." : "Select topic");

  const selectAllTopics = () => {
    onChange("");
    setOpen(false);
    setSearch("");
  };

  const showAllOptionInList = includeAllOption && !allOptionInHeader;

  const defaultButtonClass =
    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed bg-white";

  return (
    <div ref={rootRef} className={open ? "relative z-[100]" : "relative"}>
      {!hideLabel ? (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      ) : null}
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required || undefined}
        aria-label={hideLabel ? label : undefined}
        onClick={() => {
          if (isDisabled) return;
          setOpen((prev) => !prev);
          if (open) setSearch("");
        }}
        className={`${defaultButtonClass} ${focusRingClassName} ${buttonClassName}`.trim()}
      >
        <span className={selected ? "text-gray-900 truncate block" : "text-gray-500 truncate block"}>
          {selected ? getTopicLabel(selected) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-[100] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100 space-y-2">
            {includeAllOption && allOptionInHeader ? (
              <button
                type="button"
                className={`w-full text-left px-3 py-2 text-sm rounded-md border border-gray-200 ${itemHover} ${
                  !value ? itemSelected : "text-gray-900 bg-gray-50/80"
                }`}
                onClick={selectAllTopics}
              >
                {allOptionLabel}
              </button>
            ) : null}
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm ${focusRingClassName}`}
              autoComplete="off"
            />
            {search.trim() ? (
              <button
                type="button"
                className={`text-xs font-medium ${
                  accent === "emerald"
                    ? "text-emerald-700 hover:text-emerald-800"
                    : "text-blue-700 hover:text-blue-800"
                }`}
                onClick={() => setSearch("")}
              >
                Show all topics ({topics.length})
              </button>
            ) : null}
          </div>
          <ul
            role="listbox"
            className={`${listMaxHeightClass} overflow-y-auto py-1`}
            aria-label={label}
          >
            {showAllOptionInList ? (
              <li role="option" aria-selected={!value}>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm ${itemHover} ${
                    !value ? itemSelected : "text-gray-900"
                  }`}
                  onClick={selectAllTopics}
                >
                  {allOptionLabel}
                </button>
              </li>
            ) : null}
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
            ) : (
              filtered.map((topic) => {
                const topicValue = getTopicValue(topic, valueKey);
                const isSelected = topicValue === value;
                return (
                  <li key={topic._id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm ${itemHover} ${
                        isSelected ? itemSelected : "text-gray-900"
                      }`}
                      onClick={() => {
                        onChange(topicValue);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      {getTopicLabel(topic)}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
