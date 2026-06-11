import React, { Suspense } from "react";
import QuestionSelectorPage from "@/components/modules/exam/QuestionSelectorPage";

export default function SelectQuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading question selector...
        </div>
      }
    >
      <QuestionSelectorPage />
    </Suspense>
  );
}
