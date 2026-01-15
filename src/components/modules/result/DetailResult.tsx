

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import getCookie from "@/util/GetCookie";

export default function SingleResult() {
  const params = useSearchParams();
  const examNumber = params.get("exam");
  const phone = params.get("phone");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examNumber || !phone) {
      setError("Invalid exam or phone number");
      setLoading(false);
      return;
    }

    const fetchSingleResult = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/results/${examNumber}?phone=${phone}`,
          {
            headers: {
              Authorization: getCookie("access_token") || "",
            },
          }
        );

        const json = await res.json();
        console.log("DETAIL RESULT RESPONSE:", json);

        if (json.success && json.data) {
          setResult(json.data);
        } else {
          setError("No result found");
        }
      } catch (err) {
        console.error("Result fetch failed", err);
        setError("Failed to load result");
      }

      setLoading(false);
    };

    fetchSingleResult();
  }, [examNumber, phone]);

  /* -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-teal-600 border-r-teal-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-teal-700 mb-2 animate-pulse">
            Loading Result...
          </h3>
          <p className="text-teal-600">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  /* -------------------- ERROR STATE -------------------- */
  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all animate-fadeIn">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 font-semibold mb-6">{error || "No result found"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto space-y-6 animate-fadeIn">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exam Result Details
              </h1>
              <p className="text-teal-100 flex items-center gap-2">
                <span className="font-semibold">Exam Number:</span>
                <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">{result.exam_number}</span>
              </p>
            </div>
          </div>
        </div>

        {/* SCORE SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            title="Score" 
            value={result.score} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            gradient="from-teal-500 to-emerald-500"
          />
          <StatCard 
            title="Correct" 
            value={result.correctAnswers} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard 
            title="Wrong" 
            value={result.wrongAnswers} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
            gradient="from-red-500 to-orange-500"
          />
          <StatCard 
            title="Unanswered" 
            value={result.unanswered} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            gradient="from-amber-500 to-yellow-500"
          />
        </div>

        {/* STUDENT INFO */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transform hover:shadow-2xl transition-all">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Student Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <InfoCard label="Student Name" value={result.student_name} icon="👤" />
            <InfoCard label="Phone Number" value={result.student_phone} icon="📱" />
            <InfoCard 
              label="On Time" 
              value={result.is_on_time ? "Yes ✓" : "No ✗"} 
              icon="⏰"
              valueColor={result.is_on_time ? "text-green-600" : "text-red-600"}
            />
            <InfoCard 
              label="Cheated" 
              value={result.is_cheated ? "Yes ✗" : "No ✓"} 
              icon="🛡️"
              valueColor={result.is_cheated ? "text-red-600" : "text-green-600"}
            />
          </div>
        </div>

        {/* QUESTION SUMMARY */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transform hover:shadow-2xl transition-all">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Question Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            <InfoCard label="Total Questions" value={result.totalQuestions} icon="📊" />
            <InfoCard label="Correct Answers" value={result.correctAnswers} icon="✅" valueColor="text-green-600" />
            <InfoCard label="Wrong Answers" value={result.wrongAnswers} icon="❌" valueColor="text-red-600" />
          </div>
        </div>

        {/* WRITTEN EXAM */}
        {result.writtenExam?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transform hover:shadow-2xl transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              Written Exam Answers
            </h2>

            <div className="space-y-4">
              {result.writtenExam.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className="border-2 border-teal-100 rounded-xl p-5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:shadow-lg hover:border-teal-300 transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">
                        {item.question}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-teal-700">Answer:</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">
                          {item.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTON */}
        <div className="text-center pb-8">
          <button
            onClick={() => window.history.back()}
            className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Results
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

/* -------------------- COMPONENTS -------------------- */

function StatCard({ title, value, icon, gradient }: any) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 hover:shadow-2xl transition-all cursor-pointer`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

function InfoCard({ label, value, icon, valueColor = "text-gray-800" }: any) {
  return (
    <div className="group border-2 border-teal-100 rounded-xl p-5 bg-gradient-to-br from-white to-teal-50 hover:shadow-lg hover:border-teal-300 transition-all transform hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className={`text-xl font-bold ${valueColor} ml-9`}>{value}</p>
    </div>
  );
}