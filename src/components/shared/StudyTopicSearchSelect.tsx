"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type StudyTopicOption = {
  _id: string;
  name: string;
  category_number: number | string;
};

type StudyTopicSearchSelectProps = {
  label: string;
  value: string;
  onChange: (id: string) => void;
  topics: StudyTopicOption[];
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
};

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
  label,
  value,
  onChange,
  topics,
  loading = false,
  required = false,
  disabled = false,
}: StudyTopicSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => topics.find((t) => t._id === value),
    [topics, value],
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
  const placeholder = loading ? "Loading topics..." : "Select topic";

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required || undefined}
        onClick={() => {
          if (isDisabled) return;
          setOpen((prev) => !prev);
          if (open) setSearch("");
        }}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed bg-white"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {selected ? formatTopicLabel(selected) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or number..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              autoComplete="off"
            />
          </div>
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto py-1"
            aria-label={label}
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
            ) : (
              filtered.map((topic) => {
                const isSelected = topic._id === value;
                return (
                  <li key={topic._id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        isSelected ? "bg-blue-50 font-medium text-blue-900" : "text-gray-900"
                      }`}
                      onClick={() => {
                        onChange(topic._id);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      {formatTopicLabel(topic)}
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
