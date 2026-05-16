



"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaClock,
  FaCheckDouble, FaBook, FaToggleOn, FaToggleOff
} from "react-icons/fa";

import { BlockMath } from "react-katex";


export default function ExamDetailsClient() {
  const params = useSearchParams();
  const examNumber = params.get("exam");

  const [exam, setExam] = useState<any>(null);

  console.log("Exam Check Data", exam)
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (examNumber) fetchExam();
  }, [examNumber]);

  const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
  async function fetchExam() {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/exam/${examNumber}`
      );
      const json = await res.json();
      if (json.success) setExam(json.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }





    


  if (!examNumber)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="p-10 text-center bg-white shadow-2xl rounded-2xl">
          <p className="text-xl font-semibold text-gray-700">Invalid Exam Number</p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-200 rounded-full"></div>
          <div className="absolute top-0 w-20 h-20 border-t-4 border-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (window.location.href = "/dashboard/exam/list")}
            className="p-3 transition-all duration-300 bg-white shadow-lg hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white rounded-xl hover:shadow-xl group"
          >
            <FaArrowLeft size={20} className="text-gray-700 transition-colors group-hover:text-white" />
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
            Exam Details
          </h1>
        </div>

        {/* EXAM HEADER CARD */}
        <div className="p-8 mb-8 text-white shadow-2xl bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="mb-2 text-3xl font-bold">{exam.exam_name}</h2>
              <p className="font-mono text-lg text-green-100">#{exam.exam_number}</p>
            </div>

          
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">

            <div className="p-5 transition-all duration-300 transform border bg-white/10 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:scale-105">
              <div className="flex gap-3">
                <div className="p-3 rounded-lg bg-white/20">
                  <FaCalendarAlt className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">Exam Date & Time</p>
                  <p className="text-base font-bold text-white">
                    {new Date(exam.exam_date_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-100">
                    {new Date(exam.exam_date_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-all duration-300 transform border bg-white/10 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:scale-105">
              <div className="flex gap-3">
                <div className="p-3 rounded-lg bg-white/20">
                  <FaClock className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">Duration</p>
                  <p className="text-xl font-bold text-white">{exam.duration_minutes}</p>
                  <p className="text-sm text-green-100">minutes</p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-all duration-300 transform border bg-white/10 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:scale-105">
              <div className="flex gap-3">
                <div className="p-3 rounded-lg bg-white/20">
                  <FaCheckDouble className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">Total Marks</p>
                  <p className="text-xl font-bold text-white">{exam.total_marks}</p>
                  <p className="text-sm text-green-100">points</p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-all duration-300 transform border bg-white/10 backdrop-blur-md rounded-xl border-white/20 hover:bg-white/20 hover:scale-105">
              <div className="flex gap-3">
                <div className="p-3 rounded-lg bg-white/20">
                  <FaBook className="text-white" size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-100">Total Questions</p>
                  <p className="text-xl font-bold text-white">{exam.questions.length}</p>
                  <p className="text-sm text-green-100">questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="p-8 mb-8 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-green-600 to-emerald-600"></div>
            <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
              Questions
            </h3>
          </div>

          {exam.questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">

              {exam.questions.map((q: any, index: number) => (
                <div
                  key={q._id}
                  className="p-6 transition-all duration-300 transform border border-green-100 shadow-lg bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* TOP HEADER */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-md bg-gradient-to-r from-green-500 to-emerald-600">
                      Q{index + 1}
                    </span>

                    <span className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-md bg-gradient-to-r from-emerald-400 to-green-500">
                      {q.marks} Marks
                    </span>
                  </div>

                  {/* TITLE */}
                  <h4 className="mb-2 text-xl font-bold text-gray-800">
                    {q.title}
                  </h4>

                  {/* DESCRIPTION */}
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {q.description}
                  </p>

                  {/* 🔥 MATH FORMULA (if exists) */}
                  {q.mathFormula && (
                    <div className="p-4 my-4 border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <h5 className="flex items-center gap-2 mb-2 text-sm font-bold text-blue-800">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Math Formula
                      </h5>

                      {/* Centered KaTeX */}
                      <div className="text-center">
                        <BlockMath math={q.mathFormula} />
                      </div>
                    </div>
                  )}

                  {/* BASIC DETAILS */}
                  <div className="p-4 mb-4 space-y-2 text-sm text-gray-700 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                    <p className="flex justify-between">
                      <span className="font-semibold text-green-700">Question ID:</span>
                      <span className="text-gray-600">{q.questionId}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-green-700">Type:</span>
                      <span className="text-gray-600">{q.type}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-green-700">Answer Type:</span>
                      <span className="text-gray-600">{q.answerType}</span>
                    </p>
                  </div>

                  {/* ANSWER DETAILS */}
                  <div className="p-4 mt-4 border bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-emerald-200">
                    <h5 className="flex items-center gap-2 mb-3 text-sm font-bold text-emerald-800">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Answer Details
                    </h5>

                    {q.answer?.options?.length > 0 ? (
                      <ul className="mb-3 space-y-1 text-sm text-gray-700">
                        {q.answer.options.map((opt: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">•</span>
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mb-3 text-sm italic text-gray-500">No options available</p>
                    )}

                    <div className="pt-2 border-t border-emerald-200">
                      <p className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-emerald-800">Correct Answer:</span>
                        <span className="px-3 py-1 text-xs font-bold text-white rounded-lg bg-emerald-500">
                          {q.answer?.correctAnswer}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* BLANKS */}
                  {q.blanks && q.blanks.length > 0 && (
                    <div className="p-4 mt-4 border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <h5 className="mb-2 text-sm font-bold text-purple-800">Blanks</h5>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {q.blanks.map((b: any, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-purple-600">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              ))}

            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-block p-6 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <FaBook className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-500">No questions found</p>
              </div>
            </div>
          )}
        </div>



      </div>
    </div>
  );
}
