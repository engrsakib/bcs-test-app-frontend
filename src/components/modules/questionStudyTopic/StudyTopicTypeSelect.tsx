"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { confirmAction } from "@/components/ui/confirm-dialog";
import {
  isCustomStudyTopicType,
  useStudyTopicTypes,
} from "@/hooks/useStudyTopicTypes";
import type { StudyTopicTypeItem } from "@/lib/study-topic-type-api";

type StudyTopicTypeSelectProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export default function StudyTopicTypeSelect({
  name = "type",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select subject (optional)",
}: StudyTopicTypeSelectProps) {
  const { options, loading, syncing, addType, deleteType } = useStudyTopicTypes();
  const [open, setOpen] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingValue, setDeletingValue] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ||
    (loading ? "Loading subjects..." : placeholder);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowAddInput(false);
        setNewTypeLabel("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddType = async () => {
    setAdding(true);

    try {
      const created = await addType(newTypeLabel);
      if (created) {
        onChange(created.value);
        setNewTypeLabel("");
        setShowAddInput(false);
        setOpen(false);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteType = async (
    event: React.MouseEvent,
    option: StudyTopicTypeItem
  ) => {
    event.stopPropagation();

    const confirmed = await confirmAction({
      title: "Delete type?",
      description: `Remove "${option.label}" from the type list?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingValue(option.value);

    try {
      const deleted = await deleteType(option);
      if (deleted && value === option.value) {
        onChange("");
      }
    } finally {
      setDeletingValue(null);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setShowAddInput(false);
    setNewTypeLabel("");
  };

  return (
    <div className={className} ref={containerRef}>
      <input type="hidden" name={name} value={value} required={required} />

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !loading && setOpen((prev) => !prev)}
          disabled={disabled || loading}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 bg-white text-left flex items-center justify-between gap-3"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {selectedLabel}
          </span>
          <span className="flex items-center gap-2 shrink-0">
            {(loading || syncing) && (
              <Loader2 className="animate-spin text-indigo-500" size={16} />
            )}
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center gap-2 px-3 py-2.5 hover:bg-indigo-50 ${
                    value === option.value ? "bg-indigo-50/70" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="flex-1 text-left text-sm text-gray-800"
                  >
                    {option.label}
                  </button>

                  {isCustomStudyTopicType(option) && (
                    <button
                      type="button"
                      onClick={(event) => handleDeleteType(event, option)}
                      disabled={deletingValue === option.value}
                      title="Delete type"
                      className="shrink-0 p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingValue === option.value ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-2">
              {showAddInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTypeLabel}
                    onChange={(e) => setNewTypeLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddType();
                      }
                    }}
                    placeholder='e.g. "Phonetics"'
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddType}
                      disabled={adding || !newTypeLabel.trim()}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60"
                    >
                      {adding ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddInput(false);
                        setNewTypeLabel("");
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddInput(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  <Plus size={16} />
                  Add new type
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
