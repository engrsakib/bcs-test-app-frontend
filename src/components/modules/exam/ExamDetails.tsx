"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBook,
  FaCalendarAlt,
  FaCheckDouble,
  FaClock,
} from "react-icons/fa";
import { BlockMath } from "react-katex";
import { formatExamDate, formatExamTime } from "@/lib/exam-datetime";
import MathPreview from "@/components/shared/MathPreview";

interface ExamQuestion {
  _id: string;
  title: string;
  description?: string;
  marks: number;
  questionId: string | number;
  type?: string;
  answerType?: string;
  mathFormula?: string;
  answer?: {
    options?: string[];
    correctAnswer?: string | number;
  };
  blanks?: string[];
}

interface ExamDetails {
  exam_name: string;
  exam_number: number;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  questions: ExamQuestion[];
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function QuestionMetaRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-sm font-semibold text-green-700">
        {label}
      </span>
      <span className="text-sm text-gray-700 break-words [overflow-wrap:anywhere] sm:text-right">
        {value}
      </span>
    </div>
  );
}

function QuestionViewer({
  question,
  index,
  total,
}: {
  question: ExamQuestion;
  index: number;
  total: number;
}) {
  const options = question.answer?.options ?? [];
  const correctAnswer = String(question.answer?.correctAnswer ?? "");

  return (
    <article
      id={`exam-question-${index + 1}`}
      className="flex min-h-[min(100vh,860px)] flex-col rounded-2xl border border-green-100 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-lg sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md">
          Question {index + 1} of {total}
        </span>
        <span className="rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-2 text-sm font-bold text-white shadow-md">
          {question.marks} Mark{question.marks === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex-1 space-y-5">
        <section>
          <h4 className="text-xl font-bold leading-relaxed text-gray-900 sm:text-2xl [overflow-wrap:anywhere] [word-break:keep-all]">
            {question.title}
          </h4>
          {question.description ? (
            <p className="mt-3 text-base leading-8 text-gray-600 [overflow-wrap:anywhere] [word-break:keep-all]">
              {question.description}
            </p>
          ) : null}
        </section>

        {question.mathFormula ? (
          <section className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-5">
            <h5 className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Math Formula
            </h5>
            <div className="overflow-x-auto text-center">
              <BlockMath math={question.mathFormula} />
            </div>
          </section>
        ) : null}

        <section className="space-y-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5">
          <QuestionMetaRow label="Question ID" value={question.questionId} />
          <QuestionMetaRow label="Type" value={question.type || "—"} />
          <QuestionMetaRow
            label="Answer Type"
            value={question.answerType || "—"}
          />
        </section>

        <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-5">
          <h5 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Answer Options
          </h5>

          {options.length > 0 ? (
            <ul className="space-y-3">
              {options.map((option, optionIndex) => {
                const optionNumber = String(optionIndex + 1);
                const isCorrect =
                  correctAnswer === optionNumber ||
                  correctAnswer === option;

                return (
                  <li
                    key={`${question._id}-option-${optionIndex}`}
                    className={`rounded-xl border px-4 py-3 text-sm leading-7 sm:text-base ${
                      isCorrect
                        ? "border-emerald-400 bg-emerald-100/80 text-emerald-900"
                        : "border-emerald-100 bg-white text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {OPTION_LABELS[optionIndex] ?? optionIndex + 1}
                      </span>
                      <span className="flex-1 [overflow-wrap:anywhere] [word-break:keep-all]">
                        {question.type === "math" ? (
                          <MathPreview value={option} />
                        ) : (
                          option
                        )}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm italic text-gray-500">No options available</p>
          )}

          <div className="mt-4 border-t border-emerald-200 pt-4">
            <p className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-emerald-800">
                Correct Answer:
              </span>
              <span className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                {correctAnswer || "—"}
              </span>
            </p>
          </div>
        </section>

        {question.blanks && question.blanks.length > 0 ? (
          <section className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5">
            <h5 className="mb-3 text-sm font-bold text-purple-800">Blanks</h5>
            <ul className="space-y-2 text-sm leading-7 text-gray-700">
              {question.blanks.map((blank, blankIndex) => (
                <li
                  key={`${question._id}-blank-${blankIndex}`}
                  className="flex items-start gap-2 [overflow-wrap:anywhere] [word-break:keep-all]"
                >
                  <span className="font-bold text-purple-600">•</span>
                  <span>{blank}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

export default function ExamDetailsClient() {
  const params = useSearchParams();
  const examNumber = params.get("exam");

  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const questionRefs = useRef<Array<HTMLElement | null>>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchExam = useCallback(async () => {
    if (!examNumber) return;

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/exam/${examNumber}`);
      const json = await res.json();
      if (json.success) {
        setExam(json.data);
        setActiveQuestionIndex(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, examNumber]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  const questions = exam?.questions ?? [];
  const totalQuestions = questions.length;

  const scrollToQuestion = useCallback((index: number) => {
    const target = questionRefs.current[index];
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveQuestionIndex(index);
  }, []);

  useEffect(() => {
    if (!totalQuestions) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible?.target) return;

        const index = Number(
          mostVisible.target.getAttribute("data-question-index"),
        );

        if (!Number.isNaN(index)) {
          setActiveQuestionIndex(index);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.5, 0.8],
      },
    );

    questionRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [totalQuestions, questions]);

  const scrollProgress =
    totalQuestions > 0
      ? ((activeQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  if (!examNumber) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="rounded-2xl bg-white p-10 text-center shadow-2xl">
          <p className="text-xl font-semibold text-gray-700">
            Invalid Exam Number
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-green-200" />
          <div className="absolute top-0 h-20 w-20 animate-spin rounded-full border-t-4 border-green-600" />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="rounded-2xl bg-white p-10 text-center shadow-2xl">
          <p className="text-xl font-semibold text-gray-700">Exam not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard/exam/view-exam";
            }}
            className="group rounded-xl bg-white p-3 shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:shadow-xl"
          >
            <FaArrowLeft
              size={20}
              className="text-gray-700 transition-colors group-hover:text-white"
            />
          </button>
          <h1 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Exam Details
          </h1>
        </div>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white shadow-2xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="mb-2 text-2xl font-bold leading-snug [overflow-wrap:anywhere] [word-break:keep-all] sm:text-3xl">
                {exam.exam_name}
              </h2>
              <p className="font-mono text-lg text-green-100">
                #{exam.exam_number}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <FaCalendarAlt className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">
                    Exam Date & Time
                  </p>
                  <p className="text-base font-bold text-white">
                    {formatExamDate(exam.exam_date_time)}
                  </p>
                  <p className="text-sm text-green-100">
                    {formatExamTime(exam.exam_date_time)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <FaClock className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">
                    Duration
                  </p>
                  <p className="text-xl font-bold text-white">
                    {exam.duration_minutes}
                  </p>
                  <p className="text-sm text-green-100">minutes</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <FaCheckDouble className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">
                    Total Marks
                  </p>
                  <p className="text-xl font-bold text-white">
                    {exam.total_marks}
                  </p>
                  <p className="text-sm text-green-100">points</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <FaBook className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">
                    Total Questions
                  </p>
                  <p className="text-xl font-bold text-white">
                    {totalQuestions}
                  </p>
                  <p className="text-sm text-green-100">questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-2xl backdrop-blur-lg sm:p-8">
          <div className="sticky top-4 z-10 mb-6 rounded-xl border border-emerald-100 bg-white/95 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-600 to-emerald-600" />
                <div>
                  <h3 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    Questions
                  </h3>
                  {totalQuestions > 0 ? (
                    <p className="text-sm text-gray-500">
                      Scroll down to view each question
                    </p>
                  ) : null}
                </div>
              </div>

              {totalQuestions > 0 ? (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Jump to</span>
                  <select
                    value={activeQuestionIndex}
                    onChange={(event) =>
                      scrollToQuestion(Number(event.target.value))
                    }
                    className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-emerald-500"
                  >
                    {questions.map((question, index) => (
                      <option key={question._id} value={index}>
                        Question {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

            {totalQuestions > 0 ? (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
                  <span>
                    Viewing question {activeQuestionIndex + 1} of{" "}
                    {totalQuestions}
                  </span>
                  <span>{Math.round(scrollProgress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {totalQuestions > 0 ? (
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  ref={(element) => {
                    questionRefs.current[index] = element;
                  }}
                  data-question-index={index}
                  className="scroll-mt-28 snap-start snap-always"
                >
                  <QuestionViewer
                    question={question}
                    index={index}
                    total={totalQuestions}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-block rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-inner">
                <FaBook className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-500">
                  No questions found
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
