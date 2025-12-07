














// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import {
//   ChevronDown,
//   Filter,
//   Loader2,
//   MoreVertical,
//   Search,
//   Eye,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import Link from "next/link";
// import Swal from "sweetalert2";
// import { ENV } from "@/config/env";




// function getCookie(name) {
//   if (typeof document === "undefined") return null;

//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

//   return null;
// }

// // ====================== MATH EDITOR COMPONENT ======================
// function MathEditor({ value, onChange, readOnly = false }) {
//   const mathEditorRef = useRef(null);

//   useEffect(() => {
//     const scriptId = "mathlive-script";
//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     script.onload = () => console.log("✅ MathLive loaded");
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const checkReady = setInterval(() => {
//       if ((window ).MathfieldElement && mathEditorRef.current) {
//         clearInterval(checkReady);

//         const mathField = mathEditorRef.current;

//         const handleChange = (evt) => {
//           const newValue = evt.target.getValue
//             ? evt.target.getValue()
//             : evt.target.value;
//           onChange(newValue);
//         };

//         mathField.addEventListener("input", handleChange);
//         mathField.addEventListener("change", handleChange);

//         return () => {
//           mathField.removeEventListener("input", handleChange);
//           mathField.removeEventListener("change", handleChange);
//         };
//       }
//     }, 200);

//     return () => clearInterval(checkReady);
//   }, [onChange]);

//   useEffect(() => {
//     if (mathEditorRef.current && mathEditorRef.current.getValue) {
//       const currentVal = mathEditorRef.current.getValue();
//       if (currentVal !== value) {
//         mathEditorRef.current.setValue(value);
//       }
//     }
//   }, [value]);

//   return (
//     <>
//       <math-field ref={mathEditorRef} readOnly={readOnly}>
//         {value}
//       </math-field>

//       <style jsx global>{`
//         math-field {
//           display: block;
//           border: 1px solid #d1d5db;
//           border-radius: 0.5rem;
//           padding: 0.5rem 1rem;
//           font-size: 1.25rem;
//           background: #ffffff;
//           width: 100%;
//           box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
//         }
//         math-field:focus-within {
//           border-color: #10b981;
//           box-shadow: 0 0 0 2px #d1fae5;
//           outline: none;
//         }
//       `}</style>
//     </>
//   );
// }

// export default function ViewAllQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });

//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Modal states
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   // ====================== FETCH QUESTIONS ======================
//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         page: String(filters.page),
//         limit: String(filters.limit),
//         sortBy: filters.sortBy,
//         sortOrder: filters.sortOrder,
//         searchTerm: filters.search_query,
//       }).toString();

//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//         cache: "force-cache",
//       });

//       const data = await res.json();

//       console.log("View All question", data);
//       setQuestions(data?.data?.data || []);
//       setMeta(data?.data?.meta || {});
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

//   // ====================== DELETE ======================
//   const handleDelete = async (id) => {
//     const confirmDelete = await Swal.fire({
//       title: "Are you sure?",
//       text: "You want to delete this question!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete",
//       cancelButtonText: "Cancel",
//     });

//     if (!confirmDelete.isConfirmed) return;

//     try {
//       const accessToken = getCookie("access_token");
//       const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const data = await res.json();

//       Swal.fire("Deleted!", "Question removed successfully.", "success");
//       fetchQuestions();
//     } catch (e) {
//       Swal.fire("Error!", "Something went wrong!", "error");
//     }
//   };

//   // ====================== VIEW QUESTION ======================
//   const handleViewQuestion = async (questionId) => {
//     try {
//       const accessToken = getCookie("access_token");
//       const res = await fetch(`${ENV.BASE_URL}/question/${questionId}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const data = await res.json();
//       setSelectedQuestion(data?.data);
//       setShowViewModal(true);
//     } catch (e) {
//       Swal.fire("Error!", "Failed to fetch question details", "error");
//     }
//   };

//   // ====================== UPDATE QUESTION ======================
//   const handleOpenUpdateModal = async (questionId) => {
//     try {
//       const accessToken = getCookie("access_token");
//       const res = await fetch(`${ENV.BASE_URL}/question/${questionId}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const data = await res.json();
//       setSelectedQuestion(data?.data);
//       setShowUpdateModal(true);
//     } catch (e) {
//       Swal.fire("Error!", "Failed to fetch question details", "error");
//     }
//   };

//   const handleUpdateQuestion = async () => {
//     if (!selectedQuestion) return;

//     try {
//       setUpdateLoading(true);
//       const accessToken = getCookie("access_token");

//       const payload = {
//         title: selectedQuestion.title,
//         description: selectedQuestion.description,
//         type: selectedQuestion.type,
//         mathFormula: selectedQuestion.mathFormula,
//         answerType: selectedQuestion.answerType,
//         marks: selectedQuestion.marks,
//         answer: selectedQuestion.answer,
//       };

//       const res = await fetch(
//         `${ENV.BASE_URL}/question/${selectedQuestion.questionId}`,
//         {
//           method: "PATCH",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: accessToken || "",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         Swal.fire("Success!", "Question updated successfully.", "success");
//         setShowUpdateModal(false);
//         fetchQuestions();
//       } else {
//         Swal.fire("Error!", data.message || "Failed to update", "error");
//       }
//     } catch (e) {
//       Swal.fire("Error!", "Something went wrong!", "error");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // ====================== TRUNCATE TEXT ======================
//   const truncateText = (text, maxLength = 10) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
//   };

//   // ====================== GET GRADIENT FOR TYPE ======================
//   const getTypeGradient = (type) => {
//     const gradients = {
//       math: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
//       general: "bg-gradient-to-r from-green-500 to-green-600 text-white",
//       science: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
//       english: "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
//     };
//     return gradients[type] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
//   };

//   // ====================== GET GRADIENT FOR ANSWER TYPE ======================
//   const getAnswerTypeGradient = (answerType) => {
//     const gradients = {
//       mcq: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
//       descriptive: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
//       "fill-blanks": "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
//     };
//     return gradients[answerType] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
//   };

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">
//           All Created Questions
//         </h1>

//         {/* ===================== FILTER HEADER ===================== */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex flex-col sm:flex-row gap-3 flex-1">
//               {/* Search */}
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search title, description, type..."
//                   className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={filters.search_query}
//                   onChange={(e) =>
//                     setFilters({ ...filters, search_query: e.target.value })
//                   }
//                   onKeyDown={(e) => e.key === "Enter" && fetchQuestions()}
//                 />
//               </div>

//               {/* Filter Toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50 transition"
//               >
//                 <Filter className="w-5" />
//                 Filters
//                 <ChevronDown
//                   className={`w-4 transition ${showFilters ? "rotate-180" : ""}`}
//                 />
//               </button>

//               {/* Search Button */}
//               <button
//                 onClick={fetchQuestions}
//                 className="px-6 py-2.5 bg-green-700 text-white rounded-lg flex items-center gap-2 hover:bg-green-800 transition"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Search className="w-5" />
//                 )}
//                 Search
//               </button>
//             </div>

//             <Link href="/dashboard/question/create-question">
//               <button className="px-6 py-2.5 bg-green-700 text-white rounded-lg flex items-center gap-2 hover:bg-green-800 transition">
//                 Create Question
//               </button>
//             </Link>
//           </div>

//           {/* Expanded Filters */}
//           {showFilters && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Page
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={filters.page}
//                   onChange={(e) =>
//                     setFilters({
//                       ...filters,
//                       page: Number(e.target.value),
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Limit
//                 </label>
//                 <select
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={filters.limit}
//                   onChange={(e) =>
//                     setFilters({ ...filters, limit: Number(e.target.value) })
//                   }
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort By
//                 </label>
//                 <select
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={filters.sortBy}
//                   onChange={(e) =>
//                     setFilters({ ...filters, sortBy: e.target.value })
//                   }
//                 >
//                   <option value="createdAt">Created At</option>
//                   <option value="updatedAt">Updated At</option>
//                   <option value="title">Title</option>
//                   <option value="marks">Marks</option>
//                   <option value="type">Type</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort Order
//                 </label>
//                 <select
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={filters.sortOrder}
//                   onChange={(e) =>
//                     setFilters({ ...filters, sortOrder: e.target.value })
//                   }
//                 >
//                   <option value="desc">Descending</option>
//                   <option value="asc">Ascending</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ===================== TABLE ===================== */}
//         <div className="bg-white rounded-lg shadow-sm overflow-x-auto border">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Student ID
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Question ID
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Title
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Answer
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Mark
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold text-gray-700">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-center font-semibold text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-10 text-gray-500">
//                     <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
//                     Loading questions...
//                   </td>
//                 </tr>
//               ) : questions.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-10 text-gray-500">
//                     No Questions Found
//                   </td>
//                 </tr>
//               ) : (
//                 questions.map((q, index) => (
//                   <tr key={q._id} className="border-t hover:bg-gray-50 transition">
//                     <td className="px-6 py-4">{index + 1}</td>
//                     <td className="px-6 py-4 font-medium text-gray-900">
//                       {q.questionId}
//                     </td>
//                     <td className="px-6 py-4" title={q.title}>
//                       {truncateText(q.title, 25)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(
//                           q.type
//                         )}`}
//                       >
//                         {q.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
//                           q.answerType
//                         )}`}
//                       >
//                         {q.answerType}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 font-semibold text-green-700">
//                       {q.marks}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600" title={q.description}>
//                       {truncateText(q.description, 10)}
//                     </td>

//                     <td className="px-6 py-4 text-center relative">
//                       <details className="relative inline-block">
//                         <summary className="cursor-pointer flex justify-center hover:bg-gray-100 rounded-full p-1 transition">
//                           <MoreVertical className="w-5 h-5 text-gray-600" />
//                         </summary>

//                         <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg w-40 z-50">
//                           <button
//                             onClick={() => handleViewQuestion(q.questionId)}
//                             className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left transition"
//                           >
//                             <Eye className="w-4" /> View Question
//                           </button>

//                           <button
//                             onClick={() => handleOpenUpdateModal(q.questionId)}
//                             className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition"
//                           >
//                             <Edit className="w-4" /> Update Question
//                           </button>

//                           <button
//                             onClick={() => handleDelete(q._id)}
//                             className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition"
//                           >
//                             <Trash2 className="w-4" /> Delete
//                           </button>
//                         </div>
//                       </details>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ===================== PAGINATION ===================== */}
//         <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-green-900">
//             Showing page {meta.page} of {Math.ceil(meta.total / meta.limit)} ({meta.total} total questions)
//           </p>

//           <div className="flex gap-3">
//             <button
//               disabled={filters.page <= 1}
//               onClick={() => {
//                 setFilters({ ...filters, page: filters.page - 1 });
//               }}
//               className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//             >
//               Previous
//             </button>

//             <button
//               disabled={filters.page >= Math.ceil(meta.total / meta.limit)}
//               onClick={() => {
//                 setFilters({ ...filters, page: filters.page + 1 });
//               }}
//               className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ===================== VIEW MODAL ===================== */}
//       {showViewModal && selectedQuestion && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Backdrop with blur */}
//           <div
//             className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//             onClick={() => setShowViewModal(false)}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
//               <h2 className="text-2xl font-bold">View Question Details</h2>
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="text-white hover:bg-white/20 rounded-full p-2 transition"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Question ID</label>
//                   <p className="text-lg font-medium text-gray-900">{selectedQuestion.questionId}</p>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Type</label>
//                   <p>
//                     <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
//                       {selectedQuestion.type}
//                     </span>
//                   </p>
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Answer Type</label>
//                   <p>
//                     <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
//                       {selectedQuestion.answerType}
//                     </span>
//                   </p>
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Marks</label>
//                   <p className="text-lg font-bold text-green-700">{selectedQuestion.marks}</p>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Title</label>
//                 <p className="text-lg text-gray-900">{selectedQuestion.title}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Description</label>
//                 <p className="text-gray-700">{selectedQuestion.description}</p>
//               </div>

//               {selectedQuestion.mathFormula && (
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Math Formula</label>
//                   <div className="mt-1">
//                     <MathEditor
//                       value={selectedQuestion.mathFormula}
//                       onChange={() => {}}
//                       readOnly={true}
//                     />
//                   </div>
//                 </div>
//               )}

//               {selectedQuestion.answer?.options && (
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600 mb-2 block">Answer Options</label>
//                   <div className="space-y-2">
//                     {selectedQuestion.answer.options.map((option, index) => (
//                       <div
//                         key={index}
//                         className={`p-3 rounded-lg border-2 ${
//                           selectedQuestion.answer.correctAnswer === String(index + 1)
//                             ? "border-green-500 bg-green-50"
//                             : "border-gray-200 bg-gray-50"
//                         }`}
//                       >
//                         <span className="font-medium">Option {index + 1}: </span>
//                         {option}
//                         {selectedQuestion.answer.correctAnswer === String(index + 1) && (
//                           <span className="ml-2 text-green-600 font-bold">✓ Correct Answer</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ===================== UPDATE MODAL ===================== */}
//       {showUpdateModal && selectedQuestion && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Backdrop with blur */}
//           <div
//             className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//             onClick={() => !updateLoading && setShowUpdateModal(false)}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
//               <h2 className="text-2xl font-bold">Update Question</h2>
//               <button
//                 onClick={() => !updateLoading && setShowUpdateModal(false)}
//                 className="text-white hover:bg-white/20 rounded-full p-2 transition"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     Question ID
//                   </label>
//                   <input
//                     type="text"
//                     disabled
//                     value={selectedQuestion.questionId}
//                     className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     Type
//                   </label>
//                   <select
//                     value={selectedQuestion.type}
//                     onChange={(e) =>
//                       setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="math">Math</option>
//                     <option value="general">General</option>
//                     <option value="science">Science</option>
//                     <option value="english">English</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     Answer Type
//                   </label>
//                   <select
//                     value={selectedQuestion.answerType}
//                     onChange={(e) =>
//                       setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="mcq">MCQ</option>
//                     <option value="descriptive">Descriptive</option>
//                     <option value="fill-blanks">Fill Blanks</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     Marks
//                   </label>
//                   <input
//                     type="number"
//                     value={selectedQuestion.marks}
//                     onChange={(e) =>
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         marks: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={selectedQuestion.title}
//                   onChange={(e) =>
//                     setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={selectedQuestion.description}
//                   onChange={(e) =>
//                     setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
//                   }
//                   rows={3}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Math Formula (Optional)
//                 </label>
//                 <MathEditor
//                   value={selectedQuestion.mathFormula || ""}
//                   onChange={(newValue) =>
//                     setSelectedQuestion({ ...selectedQuestion, mathFormula: newValue })
//                   }
//                   readOnly={false}
//                 />
//               </div>

//               {selectedQuestion.answer?.options && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Answer Options
//                   </label>
//                   {selectedQuestion.answer.options.map((option, index) => (
//                     <div key={index} className="flex gap-2 mb-2">
//                       <input
//                         type="text"
//                         value={option}
//                         onChange={(e) => {
//                           const newOptions = [...selectedQuestion.answer.options];
//                           newOptions[index] = e.target.value;
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: {
//                               ...selectedQuestion.answer,
//                               options: newOptions,
//                             },
//                           });
//                         }}
//                         className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder={`Option ${index + 1}`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const newOptions = selectedQuestion.answer.options.filter(
//                             (_, i) => i !== index
//                           );
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: {
//                               ...selectedQuestion.answer,
//                               options: newOptions,
//                             },
//                           });
//                         }}
//                         className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: {
//                           ...selectedQuestion.answer,
//                           options: [...selectedQuestion.answer.options, ""],
//                         },
//                       });
//                     }}
//                     className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
//                   >
//                     + Add Option
//                   </button>
//                 </div>
//               )}

//               {selectedQuestion.answer?.correctAnswer && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     Correct Answer (Option Number)
//                   </label>
//                   <input
//                     type="text"
//                     value={selectedQuestion.answer.correctAnswer}
//                     onChange={(e) =>
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: {
//                           ...selectedQuestion.answer,
//                           correctAnswer: e.target.value,
//                         },
//                       })
//                     }
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="e.g., 1, 2, 3, etc."
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
//               <button
//                 onClick={() => !updateLoading && setShowUpdateModal(false)}
//                 disabled={updateLoading}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateQuestion}
//                 disabled={updateLoading}
//                 className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
//               >
//                 {updateLoading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Question"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

























// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import {
//   ChevronDown,
//   Filter,
//   Loader2,
//   Search,
//   Eye,
//   Edit,
//   Trash2,
//   X,
//   Plus,
//   ArrowLeft,
// } from "lucide-react";
// import { ENV } from "@/config/env";


// function MathEditor({ value, onChange, readOnly = false }) {
//   const mathEditorRef = useRef(null);

//   useEffect(() => {
//     const scriptId = "mathlive-script";
//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const checkReady = setInterval(() => {
//       if (window.MathfieldElement && mathEditorRef.current) {
//         clearInterval(checkReady);

//         const mathField = mathEditorRef.current;

//         const handleChange = (evt) => {
//           const newValue = evt.target.getValue
//             ? evt.target.getValue()
//             : evt.target.value;
//           onChange(newValue);
//         };

//         mathField.addEventListener("input", handleChange);
//         mathField.addEventListener("change", handleChange);

//         return () => {
//           mathField.removeEventListener("input", handleChange);
//           mathField.removeEventListener("change", handleChange);
//         };
//       }
//     }, 200);

//     return () => clearInterval(checkReady);
//   }, [onChange]);

//   return (
//     <>
//       <math-field ref={mathEditorRef} readOnly={readOnly}>
//         {value}
//       </math-field>
//     </>
//   );
// }

// // ====================== COOKIE HELPER ======================
// function getCookie(name) {
//   if (typeof document === "undefined") return null;

//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

//   return null;
// }

// export default function ViewAllQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [viewMode, setViewMode] = useState("list");
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const dropdownRef = useRef(null);

//   // ====================== FETCH QUESTIONS FROM SERVER ======================
//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         page: filters.page,
//         limit: filters.limit,
//         sortBy: filters.sortBy,
//         sortOrder: filters.sortOrder,
//       }).toString();

//       const accessToken = getCookie("access_token");
//       console.log(accessToken)

//       const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();
//       console.log("question", result)

//       if (result.success) {
//         setQuestions(result.data.data);
//         setMeta(result.data.meta);
//       }
//     } catch (error) {
//       console.log("Fetch Failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

//   // ====================== DELETE QUESTION ======================
//   // const handleDelete = async (id) => {
//   //   if (!confirm("Are you sure you want to delete?")) return;

//   //   try {
//   //     const accessToken = getCookie("access_token");

//   //     const res = await fetch(`${ENV.BASE_URL}/question/${ selectedQuestion._id}`, {
//   //       method: "DELETE",
//   //       credentials: "include",
//   //       headers: {
//   //         Authorization: accessToken || "",
//   //       },
//   //     });

//   //     const result = await res.json();

//   //     console.log("Deleted Table", result)

//   //     if (result.success) {
//   //       alert("Deleted successfully!");
//   //       fetchQuestions();
//   //     }
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // };


//   const handleDelete = async (id) => {
//   if (!confirm("Are you sure you want to delete?")) return;

//   try {
//     const accessToken = getCookie("access_token");

//     const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//       method: "DELETE",
//       credentials: "include",
//       headers: {
//         Authorization: accessToken || "",
//       },
//     });

//     const result = await res.json();
//     console.log("Delete Response:", result);

//     if (result.success) {
//       alert("Deleted successfully!");
//       fetchQuestions(); // refresh
//     } else {
//       alert(result.message || "Delete failed!");
//     }
//   } catch (error) {
//     console.error("Delete Error:", error);
//   }
// };


//   // ====================== ACTION HANDLERS ======================
//   const handleViewQuestion = (q) => {
//     setSelectedQuestion(q);
//     setViewMode("view");
//   };

//   const handleEditQuestion = (q) => {
//     setSelectedQuestion({ ...q });
//     setViewMode("edit");
//   };

//   const handleUpdateQuestion = async () => {
//     try {
//       setUpdateLoading(true);
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${selectedQuestion.questionId}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: accessToken || "",
//         },
//         body: JSON.stringify(selectedQuestion),
//       });

//       const result = await res.json();

//       console.log(" Update question", result)

//       if (result.success) {
//         alert("Updated successfully!");
//         setViewMode("list");
//         fetchQuestions();
//       }
//     } catch (err) {
//       console.log("Update failed", err);
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // ====================== TRUNCATE ======================
//   const truncateText = (text, len = 40) =>
//     text?.length > len ? text.substring(0, len) + "..." : text;

//   // ====================== TYPE COLORS ======================
//   const getTypeGradient = (t) =>
//     ({
//       math: "bg-blue-50 text-blue-700 border border-blue-200",
//       general: "bg-green-50 text-green-700 border border-green-200",
//       science: "bg-purple-50 text-purple-700 border border-purple-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   const getAnswerTypeGradient = (t) =>
//     ({
//       mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
//       descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
//       "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   // ========================================================================
//   // ============================ LIST MODE ================================
//   // ========================================================================

//   if (viewMode === "list") {
//     return (
//       <div className="p-10">
//         <h1 className="text-3xl font-bold mb-6">All Created Questions</h1>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 mb-6">
//           <input
//             placeholder="Search by title, description..."
//             value={filters.search_query}
//             onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
//             className="border px-4 py-2 rounded-lg w-80"
//           />

//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg"
//           >
//             Search
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="border rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">ID</th>
//                 <th className="p-3 text-left">Title</th>
//                 <th className="p-3">Type</th>
//                 <th className="p-3">Answer Type</th>
//                 <th className="p-3">Marks</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10">
//                     <Loader2 className="mx-auto animate-spin text-green-600" />
//                   </td>
//                 </tr>
//               ) : (
//                 questions.map((q, index) => (
//                   <tr key={q._id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{q.questionId}</td>
//                     <td className="p-3">{truncateText(q.title, 40)}</td>
//                     <td className="p-3">
//                       <span className={`px-3 py-1 rounded-lg ${getTypeGradient(q.type)}`}>
//                         {q.type}
//                       </span>
//                     </td>
//                     <td className="p-3">
//                       <span
//                         className={`px-3 py-1 rounded-lg ${getAnswerTypeGradient(
//                           q.answerType
//                         )}`}
//                       >
//                         {q.answerType}
//                       </span>
//                     </td>
//                     <td className="p-3">{q.marks}</td>

//                     {/* ACTIONS DROPDOWN */}
//                     <td className="p-3 relative">
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(openDropdown === q._id ? null : q._id)
//                         }
//                         className="p-2 hover:bg-gray-200 rounded-lg"
//                       >
//                         <ChevronDown />
//                       </button>

//                       {openDropdown === q._id && (
//                         <div className="absolute right-0 top-12 bg-white shadow-md border rounded-lg w-40 z-20">
//                           <button
//                             onClick={() => handleViewQuestion(q)}
//                             className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                           >
//                             View Question
//                           </button>

//                           <button
//                             onClick={() => handleEditQuestion(q)}
//                             className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                           >
//                             Edit Question
//                           </button>

//                           <button
//                             onClick={() => handleDelete(q.questionId)}
//                             className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <p>
//             Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
//           </p>

//           <div className="flex gap-3">
//             <button
//               disabled={meta.page <= 1}
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               className="px-4 py-2 border rounded-lg disabled:opacity-40"
//             >
//               Prev
//             </button>
//             <button
//               disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               className="px-4 py-2 border rounded-lg disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ VIEW MODE ================================
//   // ========================================================================

//   if (viewMode === "view" && selectedQuestion) {
//     return (
//       <div className="p-10">
//         <button
//           onClick={() => setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-4 py-2 border rounded-lg"
//         >
//           <ArrowLeft /> Back
//         </button>

//         <h1 className="text-3xl font-bold mb-6">View Question</h1>

//         <div className="space-y-4 border p-6 rounded-lg bg-white">
//           <p><b>ID:</b> {selectedQuestion.questionId}</p>
//           <p><b>Title:</b> {selectedQuestion.title}</p>
//           <p><b>Description:</b> {selectedQuestion.description}</p>
//           <p><b>Marks:</b> {selectedQuestion.marks}</p>
//           <p><b>Type:</b> {selectedQuestion.type}</p>
//           <p><b>Answer Type:</b> {selectedQuestion.answerType}</p>

//           {selectedQuestion.mathFormula && (
//             <MathEditor value={selectedQuestion.mathFormula} readOnly />
//           )}

//           {selectedQuestion.answer?.options && (
//             <div>
//               <h2 className="font-bold mb-2">Options</h2>
//               {selectedQuestion.answer.options.map((opt, i) => (
//                 <div key={i} className="mb-1">
//                   {i + 1}. {opt}
//                   {String(i + 1) === selectedQuestion.answer.correctAnswer && (
//                     <span className="text-green-600 font-bold ml-2">(Correct)</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ EDIT MODE ================================
//   // ========================================================================

//   if (viewMode === "edit" && selectedQuestion) {
//     return (
//       <div className="p-10">
//         <button
//           onClick={() => !updateLoading && setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-4 py-2 border rounded-lg"
//         >
//           <ArrowLeft /> Back
//         </button>

//         <h1 className="text-3xl font-bold mb-6">Edit Question</h1>

//         {/* Edit Form */}
//         <div className="bg-white p-6 rounded-lg shadow space-y-6">

//           <input
//             type="text"
//             value={selectedQuestion.title}
//             onChange={(e) =>
//               setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
//             }
//             className="w-full border px-4 py-2 rounded-lg"
//             placeholder="Title"
//           />

//           <textarea
//             rows={4}
//             value={selectedQuestion.description}
//             onChange={(e) =>
//               setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
//             }
//             className="w-full border px-4 py-2 rounded-lg"
//             placeholder="Description"
//           />

//           <input
//             type="number"
//             value={selectedQuestion.marks}
//             onChange={(e) =>
//               setSelectedQuestion({
//                 ...selectedQuestion,
//                 marks: Number(e.target.value),
//               })
//             }
//             className="w-full border px-4 py-2 rounded-lg"
//             placeholder="Marks"
//           />

//           {/* Math Formula */}
//           <MathEditor
//             value={selectedQuestion.mathFormula || ""}
//             onChange={(v) =>
//               setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
//             }
//           />

//           {/* Options */}
//           {selectedQuestion.answer?.options && (
//             <div>
//               <h2 className="font-bold mb-2">Options</h2>

//               {selectedQuestion.answer.options.map((opt, i) => (
//                 <div key={i} className="flex gap-3 mb-3">
//                   <input
//                     value={opt}
//                     onChange={(e) => {
//                       const newOpt = [...selectedQuestion.answer.options];
//                       newOpt[i] = e.target.value;
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: { ...selectedQuestion.answer, options: newOpt },
//                       });
//                     }}
//                     className="flex-1 border px-4 py-2 rounded-lg"
//                   />
//                   <button
//                     onClick={() => {
//                       const newOpt = selectedQuestion.answer.options.filter(
//                         (_, idx) => idx !== i
//                       );
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: { ...selectedQuestion.answer, options: newOpt },
//                       });
//                     }}
//                     className="px-4 bg-red-100 text-red-600 rounded-lg"
//                   >
//                     <Trash2 />
//                   </button>
//                 </div>
//               ))}

//               <button
//                 onClick={() =>
//                   setSelectedQuestion({
//                     ...selectedQuestion,
//                     answer: {
//                       ...selectedQuestion.answer,
//                       options: [...selectedQuestion.answer.options, ""],
//                     },
//                   })
//                 }
//                 className="px-4 py-2 bg-green-100 rounded-lg"
//               >
//                 + Add Option
//               </button>

//               <input
//                 className="w-full border px-4 py-2 rounded-lg mt-4"
//                 placeholder="Correct Answer Number"
//                 value={selectedQuestion.answer.correctAnswer}
//                 onChange={(e) =>
//                   setSelectedQuestion({
//                     ...selectedQuestion,
//                     answer: {
//                       ...selectedQuestion.answer,
//                       correctAnswer: e.target.value,
//                     },
//                   })
//                 }
//               />
//             </div>
//           )}

//           {/* SAVE BUTTON */}
//           <button
//             onClick={handleUpdateQuestion}
//             disabled={updateLoading}
//             className="px-6 py-3 bg-green-600 text-white rounded-lg"
//           >
//             {updateLoading ? "Updating..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }











// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { 
//   ChevronDown, 
//   Loader2, 
//   Eye, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   ArrowLeft 
// } from "lucide-react";

// // Mock ENV for demo
// const ENV = {
//   // BASE_URL: "https://mcq-analysis.vercel.app/api/v1"
//   BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
// };

// function MathEditor({ value, onChange, readOnly = false }) {
//   const mathEditorRef = useRef(null);

//   useEffect(() => {
//     const scriptId = "mathlive-script";
//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const checkReady = setInterval(() => {
//       if (window.MathfieldElement && mathEditorRef.current) {
//         clearInterval(checkReady);

//         const mathField = mathEditorRef.current;

//         const handleChange = (evt) => {
//           const newValue = evt.target.getValue
//             ? evt.target.getValue()
//             : evt.target.value;
//           onChange(newValue);
//         };

//         mathField.addEventListener("input", handleChange);
//         mathField.addEventListener("change", handleChange);

//         return () => {
//           mathField.removeEventListener("input", handleChange);
//           mathField.removeEventListener("change", handleChange);
//         };
//       }
//     }, 200);

//     return () => clearInterval(checkReady);
//   }, [onChange]);

//   return (
//     <math-field ref={mathEditorRef} readOnly={readOnly}>
//       {value}
//     </math-field>
//   );
// }

// // ====================== COOKIE HELPER ======================
// function getCookie(name) {
//   if (typeof document === "undefined") return null;

//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

//   return null;
// }

// export default function ViewAllQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
//   const [loading, setLoading] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [viewMode, setViewMode] = useState("list");
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ====================== FETCH QUESTIONS FROM SERVER ======================
//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         page: filters.page,
//         limit: filters.limit,
//         sortBy: filters.sortBy,
//         sortOrder: filters.sortOrder,
//       }).toString();

//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         setQuestions(result.data.data);
//         setMeta(result.data.meta);
//       }
//     } catch (error) {
//       console.log("Fetch Failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

//   // ====================== DELETE QUESTION ======================
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete?")) return;

//     try {
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         alert("Deleted successfully!");
//         fetchQuestions();
//       } else {
//         alert(result.message || "Delete failed!");
//       }
//     } catch (error) {
//       console.error("Delete Error:", error);
//     }
//   };

//   // ====================== ACTION HANDLERS ======================
//   const handleViewQuestion = (q) => {
//     setSelectedQuestion(q);
//     setViewMode("view");
//   };

//   const handleEditQuestion = (q) => {
//     setSelectedQuestion({ ...q });
//     setViewMode("edit");
//   };

//   const handleUpdateQuestion = async () => {
//     try {
//       setUpdateLoading(true);
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${selectedQuestion.questionId}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: accessToken || "",
//         },
//         body: JSON.stringify(selectedQuestion),
//       });

//       const result = await res.json();

//       if (result.success) {
//         alert("Updated successfully!");
//         setViewMode("list");
//         fetchQuestions();
//       }
//     } catch (err) {
//       console.log("Update failed", err);
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // ====================== TRUNCATE ======================
//   const truncateText = (text, len = 40) =>
//     text?.length > len ? text.substring(0, len) + "..." : text;

//   // ====================== TYPE COLORS ======================
//   const getTypeGradient = (t) =>
//     ({
//       math: "bg-blue-50 text-blue-700 border border-blue-200",
//       general: "bg-green-50 text-green-700 border border-green-200",
//       science: "bg-purple-50 text-purple-700 border border-purple-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   const getAnswerTypeGradient = (t) =>
//     ({
//       mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
//       descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
//       "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
//       written: "bg-orange-50 text-orange-700 border border-orange-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   // ========================================================================
//   // ============================ LIST MODE ================================
//   // ========================================================================

//   if (viewMode === "list") {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen ">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">All Created Questions</h1>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 mb-6">
//           <input
//             placeholder="Search by title, description..."
//             value={filters.search_query}
//             onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
//           />

//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Search
//           </button>
//         </div>

//         {/* TABLE - Borderless */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Answer Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Marks</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10">
//                     <Loader2 className="mx-auto animate-spin text-green-600" size={32} />
//                   </td>
//                 </tr>
//               ) : (
//                 questions.map((q) => (
//                   <tr key={q._id} className="border-b hover:bg-gray-50 transition">
//                     <td className="p-4 text-gray-600">{q.questionId}</td>
//                     <td className="p-4 text-gray-800">{truncateText(q.title, 40)}</td>
//                     <td className="p-4 text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(q.type)}`}>
//                         {q.type}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
//                           q.answerType
//                         )}`}
//                       >
//                         {q.answerType}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center text-gray-700">{q.marks}</td>

//                     {/* ACTIONS DROPDOWN */}
//                     <td className="p-4 relative" ref={openDropdown === q._id ? dropdownRef : null}>
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(openDropdown === q._id ? null : q._id)
//                         }
//                         className="p-2 hover:bg-gray-200 rounded-lg transition"
//                       >
//                         <ChevronDown size={18} />
//                       </button>

//                       {openDropdown === q._id && (
//                         <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-lg w-44 z-20">
//                           <button
//                             onClick={() => {
//                               handleViewQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Eye size={16} />
//                             View Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleEditQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Edit size={16} />
//                             Edit Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleDelete(q.questionId);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition"
//                           >
//                             <Trash2 size={16} />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <p className="text-gray-600">
//             Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
//           </p>

//           <div className="flex gap-3">
//             <button
//               disabled={meta.page <= 1}
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Prev
//             </button>
//             <button
//               disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ VIEW MODE ================================
//   // ========================================================================

//   if (viewMode === "view" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <button
//           onClick={() => setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Question Details</h1>

//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Question ID</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.questionId}</p>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Marks</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.marks}</p>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Title</p>
//               <p className="text-lg text-gray-800">{selectedQuestion.title}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Description</p>
//               <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.description}</p>
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Question Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
//                   {selectedQuestion.type}
//                 </span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Answer Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
//                   {selectedQuestion.answerType}
//                 </span>
//               </div>
//             </div>

//             {selectedQuestion.mathFormula && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-2">Math Formula</p>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <MathEditor value={selectedQuestion.mathFormula} readOnly />
//                 </div>
//               </div>
//             )}

//             {selectedQuestion.answer?.options && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-3">Answer Options</p>
//                 <div className="space-y-2">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-lg flex items-center gap-3 ${
//                         String(i + 1) === selectedQuestion.answer.correctAnswer
//                           ? "bg-green-50 border-2 border-green-500"
//                           : "bg-gray-50 border border-gray-200"
//                       }`}
//                     >
//                       <span className="font-semibold text-gray-700">{i + 1}.</span>
//                       <span className="text-gray-800">{opt}</span>
//                       {String(i + 1) === selectedQuestion.answer.correctAnswer && (
//                         <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct Answer</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ EDIT MODE ================================
//   // ========================================================================

//   if (viewMode === "edit" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen ">
//         <button
//           onClick={() => !updateLoading && setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Question</h1>

//           {/* Edit Form */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
//               <input
//                 type="text"
//                 value={selectedQuestion.title}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question title"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Description</label>
//               <textarea
//                 rows={4}
//                 value={selectedQuestion.description}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question description"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
//                 <input
//                   type="number"
//                   value={selectedQuestion.marks}
//                   onChange={(e) =>
//                     setSelectedQuestion({
//                       ...selectedQuestion,
//                       marks: Number(e.target.value),
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Enter marks"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type</label>
//                 <select
//                   value={selectedQuestion.answerType}
//                   onChange={(e) =>
//                     setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="mcq">MCQ</option>
//                   <option value="written">Written</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
//               <select
//                 value={selectedQuestion.type}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="general">General</option>
//                 <option value="math">Math</option>
//               </select>
//             </div>

//             {/* Math Formula - Only show if type is "math" */}
//             {selectedQuestion.type === "math" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula</label>
//                 <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
//                   <MathEditor
//                     value={selectedQuestion.mathFormula || ""}
//                     onChange={(v) =>
//                       setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
//                     }
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Options - Only show if answerType is "mcq" */}
//             {selectedQuestion.answerType === "mcq" && selectedQuestion.answer?.options && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div key={i} className="flex gap-2">
//                       <input
//                         value={opt}
//                         onChange={(e) => {
//                           const newOpt = [...selectedQuestion.answer.options];
//                           newOpt[i] = e.target.value;
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder={`Option ${i + 1}`}
//                       />
//                       <button
//                         onClick={() => {
//                           const newOpt = selectedQuestion.answer.options.filter(
//                             (_, idx) => idx !== i
//                           );
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
//                   <select
//                     className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                     value={selectedQuestion.answer.correctAnswer}
//                     onChange={(e) =>
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: {
//                           ...selectedQuestion.answer,
//                           correctAnswer: e.target.value,
//                         },
//                       })
//                     }
//                   >
//                     <option value="">Choose correct answer</option>
//                     {selectedQuestion.answer.options.map((_, i) => (
//                       <option key={i} value={String(i + 1)}>
//                         Option {i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* SAVE BUTTON */}
//             <button
//               onClick={handleUpdateQuestion}
//               disabled={updateLoading}
//               className="w-full px-6 py-4 bg-green-800 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {updateLoading ? "Updating..." : "Confirm Update"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }




















// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { 
//   Loader2, 
//   Eye, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   ArrowLeft,
//   MoreVertical
// } from "lucide-react";

// // Mock ENV for demo
// const ENV = {
//   BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://mcq-analysis.vercel.app/api/v1"
// };

// function MathEditor({ value, onChange, readOnly = false }) {
//   const mathEditorRef = useRef(null);

//   useEffect(() => {
//     const scriptId = "mathlive-script";
//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const checkReady = setInterval(() => {
//       if (window.MathfieldElement && mathEditorRef.current) {
//         clearInterval(checkReady);

//         const mathField = mathEditorRef.current;

//         const handleChange = (evt) => {
//           const newValue = evt.target.getValue
//             ? evt.target.getValue()
//             : evt.target.value;
//           onChange(newValue);
//         };

//         mathField.addEventListener("input", handleChange);
//         mathField.addEventListener("change", handleChange);

//         return () => {
//           mathField.removeEventListener("input", handleChange);
//           mathField.removeEventListener("change", handleChange);
//         };
//       }
//     }, 200);

//     return () => clearInterval(checkReady);
//   }, [onChange]);

//   return (
//     <math-field ref={mathEditorRef} readOnly={readOnly}>
//       {value}
//     </math-field>
//   );
// }

// // ====================== COOKIE HELPER ======================
// function getCookie(name) {
//   if (typeof document === "undefined") return null;

//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

//   return null;
// }

// // ====================== SWEET ALERT ======================
// function showAlert(title, text, icon) {
//   // Simple custom alert since we can't use external libraries
//   const alertDiv = document.createElement("div");
//   alertDiv.innerHTML = `
//     <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
//       <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
//         <div style="font-size: 48px; margin-bottom: 20px;">
//           ${icon === "success" ? "✅" : icon === "error" ? "❌" : "ℹ️"}
//         </div>
//         <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #333;">${title}</h2>
//         <p style="color: #666; margin-bottom: 24px;">${text}</p>
//         <button id="alertOkBtn" style="background: #10b981; color: white; padding: 12px 32px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">OK</button>
//       </div>
//     </div>
//   `;
  
//   document.body.appendChild(alertDiv);
  
//   const okBtn = document.getElementById("alertOkBtn");
//   okBtn.onclick = () => {
//     document.body.removeChild(alertDiv);
//   };
// }

// export default function ViewAllQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
//   const [loading, setLoading] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [viewMode, setViewMode] = useState("list");
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ====================== FETCH QUESTIONS FROM SERVER ======================
//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         page: filters.page,
//         limit: filters.limit,
//         sortBy: filters.sortBy,
//         sortOrder: filters.sortOrder,
//       }).toString();

//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         setQuestions(result.data.data);
//         setMeta(result.data.meta);
//       }
//     } catch (error) {
//       console.log("Fetch Failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

//   // ====================== DELETE QUESTION ======================
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete?")) return;

//     try {
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         showAlert("Deleted!", "Question deleted successfully", "success");
//         fetchQuestions();
//       } else {
//         showAlert("Error", result.message || "Delete failed!", "error");
//       }
//     } catch (error) {
//       console.error("Delete Error:", error);
//       showAlert("Error", "Failed to delete question", "error");
//     }
//   };

//   // ====================== ACTION HANDLERS ======================
//   const handleViewQuestion = (q) => {
//     setSelectedQuestion(q);
//     setViewMode("view");
//   };

//   const handleEditQuestion = (q) => {
//     setSelectedQuestion({ ...q });
//     setViewMode("edit");
//   };

//   const handleUpdateQuestion = async () => {
//     try {
//       setUpdateLoading(true);
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${selectedQuestion.questionId}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: accessToken || "",
//         },
//         body: JSON.stringify(selectedQuestion),
//       });

//       const result = await res.json();

//       if (result.success) {
//         showAlert("Success!", "Question updated successfully", "success");
//         setTimeout(() => {
//           setViewMode("list");
//           fetchQuestions();
//         }, 1500);
//       } else {
//         showAlert("Error", result.message || "Update failed!", "error");
//       }
//     } catch (err) {
//       console.log("Update failed", err);
//       showAlert("Error", "Failed to update question", "error");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // ====================== TRUNCATE ======================
//   const truncateText = (text, len = 40) =>
//     text?.length > len ? text.substring(0, len) + "..." : text;

//   // ====================== TYPE COLORS ======================
//   const getTypeGradient = (t) =>
//     ({
//       math: "bg-blue-50 text-blue-700 border border-blue-200",
//       general: "bg-green-50 text-green-700 border border-green-200",
//       science: "bg-purple-50 text-purple-700 border border-purple-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   const getAnswerTypeGradient = (t) =>
//     ({
//       mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
//       descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
//       "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
//       written: "bg-orange-50 text-orange-700 border border-orange-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   // ========================================================================
//   // ============================ LIST MODE ================================
//   // ========================================================================

//   if (viewMode === "list") {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">All Created Questions</h1>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 mb-6">
//           <input
//             placeholder="Search by title, description..."
//             value={filters.search_query}
//             onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
//           />

//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Search
//           </button>
//         </div>

//         {/* TABLE - No borders except bottom row border */}
//         <div className="bg-white rounded-lg shadow-sm min-h-screen overflow-hidden">
//           <table className="w-full min-h-screen">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Answer Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Marks</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-10">
//                     <Loader2 className="mx-auto animate-spin text-green-600" size={32} />
//                   </td>
//                 </tr>
//               ) : (
//                 questions.map((q) => (
//                   <tr key={q._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-4 text-gray-600">{q.questionId}</td>
//                     <td className="p-4 text-gray-800">{truncateText(q.title, 40)}</td>
//                     <td className="p-4 text-gray-600 text-sm">{truncateText(q.description, 50)}</td>
//                     <td className="p-4 text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(q.type)}`}>
//                         {q.type}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
//                           q.answerType
//                         )}`}
//                       >
//                         {q.answerType}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center text-gray-700">{q.marks}</td>

//                     {/* ACTIONS THREE DOT MENU */}
//                     <td className="p-4 relative" ref={openDropdown === q._id ? dropdownRef : null}>
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(openDropdown === q._id ? null : q._id)
//                         }
//                         className="p-2 hover:bg-gray-200 rounded-lg transition"
//                       >
//                         <MoreVertical size={18} />
//                       </button>

//                       {openDropdown === q._id && (
//                         <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-lg w-44 z-20">
//                           <button
//                             onClick={() => {
//                               handleViewQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Eye size={16} />
//                             View Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleEditQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Edit size={16} />
//                             Edit Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleDelete(q.questionId);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition"
//                           >
//                             <Trash2 size={16} />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <p className="text-gray-600">
//             Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
//           </p>

//           <div className="flex gap-3">
//             <button
//               disabled={meta.page <= 1}
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Prev
//             </button>
//             <button
//               disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ VIEW MODE ================================
//   // ========================================================================

//   if (viewMode === "view" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <button
//           onClick={() => setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Question Details</h1>

//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Question ID</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.questionId}</p>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Marks</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.marks}</p>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Title</p>
//               <p className="text-lg text-gray-800">{selectedQuestion.title}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Description</p>
//               <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.description}</p>
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Question Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
//                   {selectedQuestion.type}
//                 </span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Answer Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
//                   {selectedQuestion.answerType}
//                 </span>
//               </div>
//             </div>

//             {selectedQuestion.mathFormula && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-2">Math Formula</p>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <MathEditor value={selectedQuestion.mathFormula} readOnly />
//                 </div>
//               </div>
//             )}

//             {selectedQuestion.answer?.options && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-3">Answer Options</p>
//                 <div className="space-y-2">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-lg flex items-center gap-3 ${
//                         String(i + 1) === selectedQuestion.answer.correctAnswer
//                           ? "bg-green-50 border-2 border-green-500"
//                           : "bg-gray-50 border border-gray-200"
//                       }`}
//                     >
//                       <span className="font-semibold text-gray-700">{i + 1}.</span>
//                       <span className="text-gray-800">{opt}</span>
//                       {String(i + 1) === selectedQuestion.answer.correctAnswer && (
//                         <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct Answer</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ EDIT MODE ================================
//   // ========================================================================

//   if (viewMode === "edit" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <button
//           onClick={() => !updateLoading && setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Question</h1>

//           {/* Edit Form */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
//               <input
//                 type="text"
//                 value={selectedQuestion.title}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question title"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Description</label>
//               <textarea
//                 rows={4}
//                 value={selectedQuestion.description}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question description"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
//                 <input
//                   type="number"
//                   value={selectedQuestion.marks}
//                   onChange={(e) =>
//                     setSelectedQuestion({
//                       ...selectedQuestion,
//                       marks: Number(e.target.value),
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Enter marks"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type</label>
//                 <select
//                   value={selectedQuestion.answerType}
//                   onChange={(e) =>
//                     setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="mcq">MCQ</option>
//                   <option value="written">Written</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
//               <select
//                 value={selectedQuestion.type}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="general">General</option>
//                 <option value="math">Math</option>
//               </select>
//             </div>

//             {/* Math Formula - Only show if type is "math" */}
//             {selectedQuestion.type === "math" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula</label>
//                 <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
//                   <MathEditor
//                     value={selectedQuestion.mathFormula || ""}
//                     onChange={(v) =>
//                       setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
//                     }
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Options - Only show if answerType is "mcq" */}
//             {selectedQuestion.answerType === "mcq" && selectedQuestion.answer?.options && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div key={i} className="flex gap-2">
//                       <input
//                         value={opt}
//                         onChange={(e) => {
//                           const newOpt = [...selectedQuestion.answer.options];
//                           newOpt[i] = e.target.value;
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder={`Option ${i + 1}`}
//                       />
//                       <button
//                         onClick={() => {
//                           const newOpt = selectedQuestion.answer.options.filter(
//                             (_, idx) => idx !== i
//                           );
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
//                   <select
//                     className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                     value={selectedQuestion.answer.correctAnswer}
//                     onChange={(e) =>
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: {
//                           ...selectedQuestion.answer,
//                           correctAnswer: e.target.value,
//                         },
//                       })
//                     }
//                   >
//                     <option value="">Choose correct answer</option>
//                     {selectedQuestion.answer.options.map((_, i) => (
//                       <option key={i} value={String(i + 1)}>
//                         Option {i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* SAVE BUTTON */}
//             <button
//               onClick={handleUpdateQuestion}
//               disabled={updateLoading}
//               className="w-full px-6 py-4 bg-green-800 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {updateLoading ? "Updating..." : "Confirm Update"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }
















// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { 
//   Loader2, 
//   Eye, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   ArrowLeft,
//   MoreVertical
// } from "lucide-react";

// // Mock ENV for demo
// const ENV = {
//   BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://mcq-analysis.vercel.app/api/v1"
// };

// function MathEditor({ value, onChange, readOnly = false }) {
//   const mathEditorRef = useRef(null);

//   useEffect(() => {
//     const scriptId = "mathlive-script";
//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const checkReady = setInterval(() => {
//       if (window.MathfieldElement && mathEditorRef.current) {
//         clearInterval(checkReady);

//         const mathField = mathEditorRef.current;

//         const handleChange = (evt) => {
//           const newValue = evt.target.getValue
//             ? evt.target.getValue()
//             : evt.target.value;
//           onChange(newValue);
//         };

//         mathField.addEventListener("input", handleChange);
//         mathField.addEventListener("change", handleChange);

//         return () => {
//           mathField.removeEventListener("input", handleChange);
//           mathField.removeEventListener("change", handleChange);
//         };
//       }
//     }, 200);

//     return () => clearInterval(checkReady);
//   }, [onChange]);

//   return (
//     <math-field ref={mathEditorRef} readOnly={readOnly}>
//       {value}
//     </math-field>
//   );
// }

// // ====================== COOKIE HELPER ======================
// function getCookie(name) {
//   if (typeof document === "undefined") return null;

//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

//   return null;
// }

// // ====================== SWEET ALERT ======================
// function showAlert(title, text, icon) {
//   // Simple custom alert since we can't use external libraries
//   const alertDiv = document.createElement("div");
//   alertDiv.innerHTML = `
//     <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
//       <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
//         <div style="font-size: 48px; margin-bottom: 20px;">
//           ${icon === "success" ? "✅" : icon === "error" ? "❌" : "ℹ️"}
//         </div>
//         <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #333;">${title}</h2>
//         <p style="color: #666; margin-bottom: 24px;">${text}</p>
//         <button id="alertOkBtn" style="background: #10b981; color: white; padding: 12px 32px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">OK</button>
//       </div>
//     </div>
//   `;
  
//   document.body.appendChild(alertDiv);
  
//   const okBtn = document.getElementById("alertOkBtn");
//   okBtn.onclick = () => {
//     document.body.removeChild(alertDiv);
//   };
// }

// export default function ViewAllQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
//   const [loading, setLoading] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [viewMode, setViewMode] = useState("list");
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ====================== FETCH QUESTIONS FROM SERVER ======================
//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         page: filters.page,
//         limit: filters.limit,
//         sortBy: filters.sortBy,
//         sortOrder: filters.sortOrder,
//       }).toString();

//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         setQuestions(result.data.data);
//         setMeta(result.data.meta);
//       }
//     } catch (error) {
//       console.log("Fetch Failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

//   // ====================== DELETE QUESTION ======================
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete?")) return;

//     try {
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           Authorization: accessToken || "",
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         showAlert("Deleted!", "Question deleted successfully", "success");
//         fetchQuestions();
//       } else {
//         showAlert("Error", result.message || "Delete failed!", "error");
//       }
//     } catch (error) {
//       console.error("Delete Error:", error);
//       showAlert("Error", "Failed to delete question", "error");
//     }
//   };

//   // ====================== ACTION HANDLERS ======================
//   const handleViewQuestion = (q) => {
//     setSelectedQuestion(q);
//     setViewMode("view");
//   };

//   const handleEditQuestion = (q) => {
//     setSelectedQuestion({ ...q });
//     setViewMode("edit");
//   };

//   const handleUpdateQuestion = async () => {
//     try {
//       setUpdateLoading(true);
//       const accessToken = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/question/${selectedQuestion.questionId}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: accessToken || "",
//         },
//         body: JSON.stringify(selectedQuestion),
//       });

//       const result = await res.json();

//       if (result.success) {
//         showAlert("Success!", "Question updated successfully", "success");
//         setTimeout(() => {
//           setViewMode("list");
//           fetchQuestions();
//         }, 1500);
//       } else {
//         showAlert("Error", result.message || "Update failed!", "error");
//       }
//     } catch (err) {
//       console.log("Update failed", err);
//       showAlert("Error", "Failed to update question", "error");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // ====================== TRUNCATE ======================
//   const truncateText = (text, len = 40) =>
//     text?.length > len ? text.substring(0, len) + "..." : text;

//   // ====================== TYPE COLORS ======================
//   const getTypeGradient = (t) =>
//     ({
//       math: "bg-blue-50 text-blue-700 border border-blue-200",
//       general: "bg-green-50 text-green-700 border border-green-200",
//       science: "bg-purple-50 text-purple-700 border border-purple-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   const getAnswerTypeGradient = (t) =>
//     ({
//       mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
//       descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
//       "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
//       written: "bg-orange-50 text-orange-700 border border-orange-200",
//     }[t] || "bg-gray-50 text-gray-700");

//   // ========================================================================
//   // ============================ LIST MODE ================================
//   // ========================================================================

//   if (viewMode === "list") {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">All Created Questions</h1>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 mb-6">
//           <input
//             placeholder="Search by title, description..."
//             value={filters.search_query}
//             onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 fetchQuestions();
//               }
//             }}
//             className="border border-gray-300 px-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
//           />

//           <button
//             onClick={fetchQuestions}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Search
//           </button>

//           <button
//             onClick={() => {
//               setFilters({ ...filters, search_query: "", page: 1 });
//               setTimeout(fetchQuestions, 100);
//             }}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Clear
//           </button>
//         </div>

//         {/* TABLE - No borders except bottom row border */}
//         <div className="bg-white rounded-lg shadow-sm overflow-x-auto min-h-screen pb-32">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Answer Type</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Marks</th>
//                 <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-10">
//                     <Loader2 className="mx-auto animate-spin text-green-600" size={32} />
//                   </td>
//                 </tr>
//               ) : (
//                 questions.map((q) => (
//                   <tr key={q._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-4 text-gray-600">{q.questionId}</td>
//                     <td className="p-4 text-gray-800">{truncateText(q.title, 40)}</td>
//                     <td className="p-4 text-gray-600 text-sm">{truncateText(q.description, 50)}</td>
//                     <td className="p-4 text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(q.type)}`}>
//                         {q.type}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
//                           q.answerType
//                         )}`}
//                       >
//                         {q.answerType}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center text-gray-700">{q.marks}</td>

//                     {/* ACTIONS THREE DOT MENU */}
//                     <td className="p-4 relative" ref={openDropdown === q._id ? dropdownRef : null}>
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(openDropdown === q._id ? null : q._id)
//                         }
//                         className="p-2 hover:bg-gray-200 rounded-lg transition"
//                       >
//                         <MoreVertical size={18} />
//                       </button>

//                       {openDropdown === q._id && (
//                         <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-lg w-44 z-20">
//                           <button
//                             onClick={() => {
//                               handleViewQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Eye size={16} />
//                             View Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleEditQuestion(q);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
//                           >
//                             <Edit size={16} />
//                             Edit Question
//                           </button>

//                           <button
//                             onClick={() => {
//                               handleDelete(q.questionId);
//                               setOpenDropdown(null);
//                             }}
//                             className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition"
//                           >
//                             <Trash2 size={16} />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <p className="text-gray-600">
//             Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
//           </p>

//           <div className="flex gap-3">
//             <button
//               disabled={meta.page <= 1}
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Prev
//             </button>
//             <button
//               disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ VIEW MODE ================================
//   // ========================================================================

//   if (viewMode === "view" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <button
//           onClick={() => setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Question Details</h1>

//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Question ID</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.questionId}</p>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-1">Marks</p>
//                 <p className="text-lg font-semibold text-gray-800">{selectedQuestion.marks}</p>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Title</p>
//               <p className="text-lg text-gray-800">{selectedQuestion.title}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Description</p>
//               <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.description}</p>
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Question Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
//                   {selectedQuestion.type}
//                 </span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 mb-2">Answer Type</p>
//                 <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
//                   {selectedQuestion.answerType}
//                 </span>
//               </div>
//             </div>

//             {selectedQuestion.mathFormula && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-2">Math Formula</p>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <MathEditor value={selectedQuestion.mathFormula} readOnly />
//                 </div>
//               </div>
//             )}

//             {selectedQuestion.answer?.options && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-3">Answer Options</p>
//                 <div className="space-y-2">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-lg flex items-center gap-3 ${
//                         String(i + 1) === selectedQuestion.answer.correctAnswer
//                           ? "bg-green-50 border-2 border-green-500"
//                           : "bg-gray-50 border border-gray-200"
//                       }`}
//                     >
//                       <span className="font-semibold text-gray-700">{i + 1}.</span>
//                       <span className="text-gray-800">{opt}</span>
//                       {String(i + 1) === selectedQuestion.answer.correctAnswer && (
//                         <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct Answer</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================================================
//   // ============================ EDIT MODE ================================
//   // ========================================================================

//   if (viewMode === "edit" && selectedQuestion) {
//     return (
//       <div className="p-10 bg-gray-50 min-h-screen">
//         <button
//           onClick={() => !updateLoading && setViewMode("list")}
//           className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//         >
//           <ArrowLeft size={18} /> Back to List
//         </button>

//         <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Question</h1>

//           {/* Edit Form */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
//               <input
//                 type="text"
//                 value={selectedQuestion.title}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question title"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Description</label>
//               <textarea
//                 rows={4}
//                 value={selectedQuestion.description}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter question description"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
//                 <input
//                   type="number"
//                   value={selectedQuestion.marks}
//                   onChange={(e) =>
//                     setSelectedQuestion({
//                       ...selectedQuestion,
//                       marks: Number(e.target.value),
//                     })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Enter marks"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type</label>
//                 <select
//                   value={selectedQuestion.answerType}
//                   onChange={(e) =>
//                     setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
//                   }
//                   className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="mcq">MCQ</option>
//                   <option value="written">Written</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
//               <select
//                 value={selectedQuestion.type}
//                 onChange={(e) =>
//                   setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="general">General</option>
//                 <option value="math">Math</option>
//               </select>
//             </div>

//             {/* Math Formula - Only show if type is "math" */}
//             {selectedQuestion.type === "math" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula</label>
//                 <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
//                   <MathEditor
//                     value={selectedQuestion.mathFormula || ""}
//                     onChange={(v) =>
//                       setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
//                     }
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Options - Only show if answerType is "mcq" */}
//             {selectedQuestion.answerType === "mcq" && selectedQuestion.answer?.options && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {selectedQuestion.answer.options.map((opt, i) => (
//                     <div key={i} className="flex gap-2">
//                       <input
//                         value={opt}
//                         onChange={(e) => {
//                           const newOpt = [...selectedQuestion.answer.options];
//                           newOpt[i] = e.target.value;
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder={`Option ${i + 1}`}
//                       />
//                       <button
//                         onClick={() => {
//                           const newOpt = selectedQuestion.answer.options.filter(
//                             (_, idx) => idx !== i
//                           );
//                           setSelectedQuestion({
//                             ...selectedQuestion,
//                             answer: { ...selectedQuestion.answer, options: newOpt },
//                           });
//                         }}
//                         className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
//                   <select
//                     className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                     value={selectedQuestion.answer.correctAnswer}
//                     onChange={(e) =>
//                       setSelectedQuestion({
//                         ...selectedQuestion,
//                         answer: {
//                           ...selectedQuestion.answer,
//                           correctAnswer: e.target.value,
//                         },
//                       })
//                     }
//                   >
//                     <option value="">Choose correct answer</option>
//                     {selectedQuestion.answer.options.map((_, i) => (
//                       <option key={i} value={String(i + 1)}>
//                         Option {i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* SAVE BUTTON */}
//             <button
//               onClick={handleUpdateQuestion}
//               disabled={updateLoading}
//               className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {updateLoading ? "Updating..." : "Confirm Update"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }















"use client";



import React, { useEffect, useState, useRef } from "react";
import { 
  Loader2, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft,
  MoreVertical,
  Search,
  Filter
} from "lucide-react";
import Swal from "sweetalert2";

// Mock ENV for demo
const ENV = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://mcq-analysis.vercel.app/api/v1"
};

function MathEditor({ value, onChange, readOnly = false }) {
  const mathEditorRef = useRef(null);

  useEffect(() => {
    const scriptId = "mathlive-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://unpkg.com/mathlive?module";
    script.type = "module";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.MathfieldElement && mathEditorRef.current) {
        clearInterval(checkReady);

        const mathField = mathEditorRef.current;

        const handleChange = (evt) => {
          const newValue = evt.target.getValue
            ? evt.target.getValue()
            : evt.target.value;
          onChange(newValue);
        };

        mathField.addEventListener("input", handleChange);
        mathField.addEventListener("change", handleChange);

        return () => {
          mathField.removeEventListener("input", handleChange);
          mathField.removeEventListener("change", handleChange);
        };
      }
    }, 200);

    return () => clearInterval(checkReady);
  }, [onChange]);

  return (
    <math-field ref={mathEditorRef} readOnly={readOnly}>
      {value}
    </math-field>
  );
}

// ====================== COOKIE HELPER ======================
function getCookie(name) {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

  return null;
}

// ====================== SWEET ALERT ======================
function showAlert(title, text, icon) {
  // Simple custom alert since we can't use external libraries
  const alertDiv = document.createElement("div");
  alertDiv.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${icon === "success" ? "✅" : icon === "error" ? "❌" : "ℹ️"}
        </div>
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #333;">${title}</h2>
        <p style="color: #666; margin-bottom: 24px;">${text}</p>
        <button id="alertOkBtn" style="background: #10b981; color: white; padding: 12px 32px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">OK</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(alertDiv);
  
  const okBtn = document.getElementById("alertOkBtn");
  okBtn.onclick = () => {
    document.body.removeChild(alertDiv);
  };
}

export default function ViewAllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ====================== FETCH QUESTIONS FROM SERVER ======================
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        searchTerm: filters.searchTerm,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }).toString();

      const accessToken = getCookie("access_token");

      const res = await fetch(`${ENV.BASE_URL}/question/?${query}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: accessToken || "",
        },
        cache:"force-cache",
      });

      const result = await res.json();

      if (result.success) {
        setQuestions(result.data.data);
        setMeta(result.data.meta);
      }
    } catch (error) {
      console.log("Fetch Failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

  // ====================== DELETE QUESTION ======================
  const handleDelete = async (id) => {
    // if (!confirm("Are you sure you want to delete?")) return;

    try {
      const accessToken = getCookie("access_token");

      const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: accessToken || "",
        },
      });

      const result = await res.json();

      if (result.success) {
        showAlert("Deleted!", "Question deleted successfully", "success");
        fetchQuestions();
      } else {
        showAlert("Error", result.message || "Delete failed!", "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showAlert("Error", "Failed to delete question", "error");
    }
  };




// const handleDelete = async (id) => {
//   // SweetAlert2 Confirmation
//   const confirm = await Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#d33",
//     cancelButtonColor: "#3085d6",
//     confirmButtonText: "Yes, delete it!",
//   });

//   if (!confirm.isConfirmed) return;

//   try {
//     const accessToken = getCookie("access_token");

//     const res = await fetch(`${ENV.BASE_URL}/question/${id}`, {
//       method: "DELETE",
//       credentials: "include",
//       headers: {
//         Authorization: accessToken || "",
//       },
//     });

//     const result = await res.json();

//     if (result.success) {
//       await Swal.fire({
//         title: "Deleted!",
//         text: "Question deleted successfully.",
//         icon: "success",
//         timer: 1500,
//       });

//       fetchQuestions(); // refresh list
//     } else {
//       Swal.fire({
//         title: "Error!",
//         text: result.message || "Delete failed!",
//         icon: "error",
//       });
//     }
//   } catch (error) {
//     console.error("Delete Error:", error);

//     Swal.fire({
//       title: "Error!",
//       text: "Failed to delete question",
//       icon: "error",
//     });
//   }
// };




  // ====================== ACTION HANDLERS ======================
  const handleViewQuestion = (q) => {
    setSelectedQuestion(q);
    setViewMode("view");
  };

  const handleEditQuestion = (q) => {
    setSelectedQuestion({ ...q });
    setViewMode("edit");
  };

  const handleUpdateQuestion = async () => {
    try {
      setUpdateLoading(true);
      const accessToken = getCookie("access_token");

      const res = await fetch(`${ENV.BASE_URL}/question/${selectedQuestion.questionId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken || "",
        },
        body: JSON.stringify(selectedQuestion),
      });

      const result = await res.json();

      if (result.success) {
        showAlert("Success!", "Question updated successfully", "success");
        setTimeout(() => {
          setViewMode("list");
          fetchQuestions();
        }, 1500);
      } else {
        showAlert("Error", result.message || "Update failed!", "error");
      }
    } catch (err) {
      console.log("Update failed", err);
      showAlert("Error", "Failed to update question", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ====================== TRUNCATE ======================
  const truncateText = (text, len = 40) =>
    text?.length > len ? text.substring(0, len) + "..." : text;

  // ====================== TYPE COLORS ======================
  const getTypeGradient = (t) =>
    ({
      math: "bg-blue-50 text-blue-700 border border-blue-200",
      general: "bg-green-50 text-green-700 border border-green-200",
      science: "bg-purple-50 text-purple-700 border border-purple-200",
    }[t] || "bg-gray-50 text-gray-700");

  const getAnswerTypeGradient = (t) =>
    ({
      mcq: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      descriptive: "bg-orange-50 text-orange-700 border border-orange-200",
      "fill-blanks": "bg-teal-50 text-teal-700 border border-teal-200",
      written: "bg-orange-50 text-orange-700 border border-orange-200",
    }[t] || "bg-gray-50 text-gray-700");

  // ========================================================================
  // ============================ LIST MODE ================================
  // ========================================================================

  if (viewMode === "list") {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Created Questions</h1>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                placeholder="Search by title, description..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    fetchQuestions();
                  }
                }}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter size={18} />
              Filters
            </button>

            <button
              onClick={fetchQuestions}
              className="flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                <input
                  type="number"
                  min="1"
                  value={filters.page}
                  onChange={(e) => setFilters({ ...filters, page: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt">Created At</option>
                  <option value="title">Title</option>
                  <option value="marks">Marks</option>
                  <option value="type">Type</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* TABLE - No borders except bottom row border */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto min-h-screen pb-32">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Answer Type</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Marks</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <Loader2 className="mx-auto animate-spin text-green-600" size={32} />
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600">{q.questionId}</td>
                    <td className="p-4 text-gray-800">{truncateText(q.title, 40)}</td>
                    <td className="p-4 text-gray-600 text-sm">{truncateText(q.description, 50)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeGradient(q.type)}`}>
                        {q.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAnswerTypeGradient(
                          q.answerType
                        )}`}
                      >
                        {q.answerType}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700">{q.marks}</td>

                    {/* ACTIONS THREE DOT MENU */}
                    <td className="p-4 relative" ref={openDropdown === q._id ? dropdownRef : null}>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === q._id ? null : q._id)
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdown === q._id && (
                        <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-lg w-44 z-20">
                          <button
                            onClick={() => {
                              handleViewQuestion(q);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
                          >
                            <Eye size={16} />
                            View Question
                          </button>

                          <button
                            onClick={() => {
                              handleEditQuestion(q);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-100 transition"
                          >
                            <Edit size={16} />
                            Edit Question
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(q.questionId);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
          </p>

          <div className="flex gap-3">
            <button
              disabled={meta.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Prev
            </button>
            <button
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // ============================ VIEW MODE ================================
  // ========================================================================

  if (viewMode === "view" && selectedQuestion) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => setViewMode("list")}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Question Details</h1>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Question ID</p>
                <p className="text-lg font-semibold text-gray-800">{selectedQuestion.questionId}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Marks</p>
                <p className="text-lg font-semibold text-gray-800">{selectedQuestion.marks}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-lg text-gray-800">{selectedQuestion.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.description}</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Question Type</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeGradient(selectedQuestion.type)}`}>
                  {selectedQuestion.type}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Answer Type</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getAnswerTypeGradient(selectedQuestion.answerType)}`}>
                  {selectedQuestion.answerType}
                </span>
              </div>
            </div>

            {selectedQuestion.mathFormula && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Math Formula</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <MathEditor value={selectedQuestion.mathFormula} readOnly />
                </div>
              </div>
            )}

            {selectedQuestion.answer?.options && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Answer Options</p>
                <div className="space-y-2">
                  {selectedQuestion.answer.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        String(i + 1) === selectedQuestion.answer.correctAnswer
                          ? "bg-green-50 border-2 border-green-500"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <span className="font-semibold text-gray-700">{i + 1}.</span>
                      <span className="text-gray-800">{opt}</span>
                      {String(i + 1) === selectedQuestion.answer.correctAnswer && (
                        <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct Answer</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // ============================ EDIT MODE ================================
  // ========================================================================

  if (viewMode === "edit" && selectedQuestion) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <button
          onClick={() => !updateLoading && setViewMode("list")}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Question</h1>

          {/* Edit Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
              <input
                type="text"
                value={selectedQuestion.title}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, title: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter question title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Description</label>
              <textarea
                rows={4}
                value={selectedQuestion.description}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, description: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter question description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                <input
                  type="number"
                  value={selectedQuestion.marks}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      marks: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter marks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type</label>
                <select
                  value={selectedQuestion.answerType}
                  onChange={(e) =>
                    setSelectedQuestion({ ...selectedQuestion, answerType: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="mcq">MCQ</option>
                  <option value="written">Written</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                value={selectedQuestion.type}
                onChange={(e) =>
                  setSelectedQuestion({ ...selectedQuestion, type: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="general">General</option>
                <option value="math">Math</option>
              </select>
            </div>

            {/* Math Formula - Only show if type is "math" */}
            {selectedQuestion.type === "math" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula</label>
                <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
                  <MathEditor
                    value={selectedQuestion.mathFormula || ""}
                    onChange={(v) =>
                      setSelectedQuestion({ ...selectedQuestion, mathFormula: v })
                    }
                  />
                </div>
              </div>
            )}

            {/* Options - Only show if answerType is "mcq" */}
            {selectedQuestion.answerType === "mcq" && selectedQuestion.answer?.options && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>

                <div className="grid grid-cols-2 gap-4">
                  {selectedQuestion.answer.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={opt}
                        onChange={(e) => {
                          const newOpt = [...selectedQuestion.answer.options];
                          newOpt[i] = e.target.value;
                          setSelectedQuestion({
                            ...selectedQuestion,
                            answer: { ...selectedQuestion.answer, options: newOpt },
                          });
                        }}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Option ${i + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOpt = selectedQuestion.answer.options.filter(
                            (_, idx) => idx !== i
                          );
                          setSelectedQuestion({
                            ...selectedQuestion,
                            answer: { ...selectedQuestion.answer, options: newOpt },
                          });
                        }}
                        className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                  <select
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedQuestion.answer.correctAnswer}
                    onChange={(e) =>
                      setSelectedQuestion({
                        ...selectedQuestion,
                        answer: {
                          ...selectedQuestion.answer,
                          correctAnswer: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Choose correct answer</option>
                    {selectedQuestion.answer.options.map((_, i) => (
                      <option key={i} value={String(i + 1)}>
                        Option {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* SAVE BUTTON */}
            <button
              onClick={handleUpdateQuestion}
              disabled={updateLoading}
              className="w-full px-6 py-4 bg-green-800 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}





