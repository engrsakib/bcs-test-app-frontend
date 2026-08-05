"use client";

import React, { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { useStudyTopicTypes } from "@/hooks/useStudyTopicTypes";

type StudyTopicTypeSelectProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function StudyTopicTypeSelect({
  name = "type",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
}: StudyTopicTypeSelectProps) {
  const { options, loading, syncing, addType } = useStudyTopicTypes();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddType = async () => {
    setAdding(true);

    try {
      const created = await addType(newTypeLabel);
      if (created) {
        onChange(created.value);
        setNewTypeLabel("");
        setShowAddForm(false);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddType();
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || loading}
            required={required}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 appearance-none pr-10"
          >
            <option value="">
              {loading ? "Loading types..." : "Select type"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {(loading || syncing) && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-500"
              size={16}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          disabled={disabled || loading}
          title="Add new type"
          className="shrink-0 inline-flex items-center justify-center w-12 h-12 border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-60 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAddForm && (
        <div className="mt-3 p-4 border border-indigo-100 rounded-xl bg-indigo-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Add new type</p>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewTypeLabel("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <input
            type="text"
            value={newTypeLabel}
            onChange={(e) => setNewTypeLabel(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder='e.g. "Phonetics", "Essay Writing"'
            className="w-full border rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />

          <button
            type="button"
            onClick={handleAddType}
            disabled={adding || !newTypeLabel.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {adding ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Type
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
