


// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Search, Filter, Calendar, ChevronLeft, ChevronRight, 
//   FileText, Clock, Eye, Edit, Trash2 
// } from 'lucide-react';

// // Fake Data Array with Published/Unpublished Status
// const fakeGuidelines = [
//   {
//     id: 1,
//     title: "BCS Preliminary Exam Guidelines",
//     category: "exam",
//     description: "Complete guidelines for BCS preliminary examination including syllabus, marking scheme, and preparation tips.",
//     date: "2025-11-05",
//     time: "10:30",
//     status: "published"
//   },
//   {
//     id: 2,
//     title: "MCQ Test Instructions",
//     category: "mcq",
//     description: "Important instructions for taking MCQ tests including time management and answer sheet filling.",
//     date: "2025-11-08",
//     time: "14:15",
//     status: "published"
//   },
//   {
//     id: 3,
//     title: "General Rules and Regulations",
//     category: "rules",
//     description: "General rules and regulations that all candidates must follow during examinations.",
//     date: "2025-11-01",
//     time: "09:00",
//     status: "unpublished"
//   },
//   {
//     id: 4,
//     title: "Exam Hall Instructions",
//     category: "instructions",
//     description: "Detailed instructions for behavior and procedures inside the examination hall.",
//     date: "2025-11-03",
//     time: "11:45",
//     status: "published"
//   },
//   {
//     id: 5,
//     title: "Online Test Guidelines",
//     category: "general",
//     description: "Guidelines for participating in online tests including technical requirements and troubleshooting.",
//     date: "2025-11-07",
//     time: "16:20",
//     status: "unpublished"
//   },
//   {
//     id: 6,
//     title: "Written Exam Preparation",
//     category: "exam",
//     description: "Comprehensive guide for written examination preparation including answer writing techniques.",
//     date: "2025-11-02",
//     time: "13:00",
//     status: "published"
//   },
//   {
//     id: 7,
//     title: "Negative Marking Rules",
//     category: "rules",
//     description: "Detailed explanation of negative marking system and how to avoid common mistakes.",
//     date: "2025-11-06",
//     time: "15:30",
//     status: "published"
//   },
//   {
//     id: 8,
//     title: "Time Management Tips",
//     category: "general",
//     description: "Essential time management strategies for maximizing performance during examinations.",
//     date: "2025-11-04",
//     time: "12:10",
//     status: "unpublished"
//   },
//   {
//     id: 9,
//     title: "Answer Sheet Guidelines",
//     category: "instructions",
//     description: "Instructions for properly filling out answer sheets and OMR forms.",
//     date: "2025-11-09",
//     time: "10:00",
//     status: "published"
//   },
//   {
//     id: 10,
//     title: "Practice Test Instructions",
//     category: "mcq",
//     description: "Guidelines for taking practice tests and understanding result analysis.",
//     date: "2025-10-30",
//     time: "14:45",
//     status: "published"
//   },
//   {
//     id: 11,
//     title: "Syllabus Overview",
//     category: "exam",
//     description: "Complete syllabus overview with topic-wise distribution and weightage.",
//     date: "2025-10-28",
//     time: "09:30",
//     status: "unpublished"
//   },
//   {
//     id: 12,
//     title: "Code of Conduct",
//     category: "rules",
//     description: "Code of conduct that must be maintained during all examination activities.",
//     date: "2025-11-08",
//     time: "11:00",
//     status: "published"
//   }
// ];

// const ViewAllGuideline = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Format Date Function
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Filter and Search Logic
//   const filteredGuidelines = useMemo(() => {
//     return fakeGuidelines.filter(guideline => {
//       const matchesSearch =
//         guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         guideline.description.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory =
//         categoryFilter === 'all' || guideline.category === categoryFilter;
//       const matchesStatus =
//         statusFilter === 'all' || guideline.status === statusFilter;
//       const matchesDate = !dateFilter || guideline.date === dateFilter;

//       return matchesSearch && matchesCategory && matchesStatus && matchesDate;
//     });
//   }, [searchTerm, categoryFilter, statusFilter, dateFilter]);

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredGuidelines.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedGuidelines = filteredGuidelines.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Reset page on filter change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, categoryFilter, statusFilter, dateFilter]);

//   const getCategoryBadge = (category) => {
//     const colors = {
//       exam: 'bg-blue-100 text-blue-700 border-blue-200',
//       mcq: 'bg-purple-100 text-purple-700 border-purple-200',
//       rules: 'bg-red-100 text-red-700 border-red-200',
//       instructions: 'bg-orange-100 text-orange-700 border-orange-200',
//       general: 'bg-green-100 text-green-700 border-green-200'
//     };
//     return colors[category] || colors.general;
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       published: 'bg-green-100 text-green-700 border-green-200',
//       unpublished: 'bg-yellow-100 text-yellow-700 border-yellow-200'
//     };
//     return colors[status] || colors.published;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All Guidelines</h1>
//               <p className="text-teal-50 text-sm sm:text-base">
//                 Browse and manage examination guidelines • Total: {filteredGuidelines.length} items
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Search className="w-4 h-4 text-teal-600" />
//                 Search by Title
//               </label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search guidelines..."
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//               />
//             </div>

//             {/* Category */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Filter className="w-4 h-4 text-teal-600" />
//                 Filter by Category
//               </label>
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
//               >
//                 <option value="all">All Categories</option>
//                 <option value="general">General</option>
//                 <option value="exam">Exam</option>
//                 <option value="mcq">MCQ</option>
//                 <option value="rules">Rules</option>
//                 <option value="instructions">Instructions</option>
//               </select>
//             </div>

//             {/* Status */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Filter className="w-4 h-4 text-teal-600" />
//                 Filter by Status
//               </label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="published">Published</option>
//                 <option value="unpublished">Unpublished</option>
//               </select>
//             </div>

//             {/* Date */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Calendar className="w-4 h-4 text-teal-600" />
//                 Filter by Date
//               </label>
//               <input
//                 type="date"
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Active Filters */}
//           {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter) && (
//             <div className="mt-4 flex flex-wrap items-center gap-2">
//               <span className="text-sm text-gray-600">Active filters:</span>
//               {searchTerm && (
//                 <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
//                   Search: "{searchTerm}"
//                 </span>
//               )}
//               {categoryFilter !== 'all' && (
//                 <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
//                   Category: {categoryFilter}
//                 </span>
//               )}
//               {statusFilter !== 'all' && (
//                 <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
//                   Status: {statusFilter}
//                 </span>
//               )}
//               {dateFilter && (
//                 <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
//                   Date: {dateFilter}
//                 </span>
//               )}
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setCategoryFilter('all');
//                   setStatusFilter('all');
//                   setDateFilter('');
//                 }}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-all"
//               >
//                 Clear All
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {/* Desktop View */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedGuidelines.length > 0 ? (
//                   paginatedGuidelines.map((guideline, index) => (
//                     <tr key={guideline.id} className={`border-b hover:bg-teal-50 transition-all ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                       <td className="px-6 py-4 text-sm text-gray-600 font-medium">#{guideline.id}</td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <p className="font-semibold text-gray-800">{guideline.title}</p>
//                           <p className="text-sm text-gray-600 line-clamp-2">{guideline.description}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(guideline.category)}`}>
//                           {guideline.category.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(guideline.status)}`}>
//                           {guideline.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <span className="text-sm text-gray-700 flex items-center gap-1">
//                             <Calendar className="w-3.5 h-3.5" />
//                             {formatDate(guideline.date)}
//                           </span>
//                           <span className="text-sm text-gray-600 flex items-center gap-1">
//                             <Clock className="w-3.5 h-3.5" />
//                             {guideline.time}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all" title="View">
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all" title="Edit">
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all" title="Delete">
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
//                       <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                       <p className="text-lg font-semibold">No guidelines found</p>
//                       <p className="text-sm">Try adjusting your filters</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile View */}
//           <div className="lg:hidden">
//             {paginatedGuidelines.length > 0 ? (
//               paginatedGuidelines.map((guideline) => (
//                 <div key={guideline.id} className="border-b p-4 hover:bg-teal-50 transition-all">
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="text-sm text-gray-600 font-medium">#{guideline.id}</span>
//                     <div className="flex gap-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(guideline.status)}`}>
//                         {guideline.status.toUpperCase()}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(guideline.category)}`}>
//                         {guideline.category.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                   <h3 className="font-semibold text-gray-800 mb-1">{guideline.title}</h3>
//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guideline.description}</p>
//                   <div className="flex justify-between items-center">
//                     <div className="text-sm text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-3.5 h-3.5" />
//                         {formatDate(guideline.date)}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-3.5 h-3.5" />
//                         {guideline.time}
//                       </div>
//                     </div>
//                     <div className="flex gap-1">
//                       <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all" title="View">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all" title="Edit">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all" title="Delete">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="px-6 py-12 text-center text-gray-500">
//                 <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                 <p className="text-lg font-semibold">No guidelines found</p>
//                 <p className="text-sm">Try adjusting your filters</p>
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {filteredGuidelines.length > 0 && (
//             <div className="bg-gray-50 px-4 sm:px-6 py-4 flex items-center justify-between border-t">
//               <div className="text-sm text-gray-600">
//                 Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
//                 <span className="font-semibold">
//                   {Math.min(startIndex + itemsPerPage, filteredGuidelines.length)}
//                 </span>{' '}
//                 of <span className="font-semibold">{filteredGuidelines.length}</span> results
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>

//                 <div className="flex gap-1">
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCurrentPage(i + 1)}
//                       className={`w-10 h-10 rounded-lg font-semibold transition-all ${
//                         currentPage === i + 1
//                           ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
//                           : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewAllGuideline;











"use client";

import React from "react";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- STATIC DEMO DATA ---
const demoData = [
  {
    id: 1,
    title: "BCS Preliminary Exam Guidelines",
    category: "exam",
    description: "Complete guidelines for BCS preliminary examination.",
    date: "2025-11-05",
    time: "10:30",
    status: "published",
  },
  {
    id: 2,
    title: "MCQ Test Instructions",
    category: "mcq",
    description: "Instructions and rules for MCQ based tests.",
    date: "2025-11-08",
    time: "14:15",
    status: "published",
  },
  {
    id: 3,
    title: "General Rules",
    category: "rules",
    description: "General exam rules and candidate responsibilities.",
    date: "2025-11-01",
    time: "09:00",
    status: "unpublished",
  },
];

const ViewAllGuidelineUI = () => {
  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryBadge = (category) => {
    const colors = {
      exam: "bg-blue-100 text-blue-700 border-blue-200",
      mcq: "bg-purple-100 text-purple-700 border-purple-200",
      rules: "bg-red-100 text-red-700 border-red-200",
      instructions: "bg-orange-100 text-orange-700 border-orange-200",
      general: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[category] || colors.general;
  };

  const getStatusBadge = (status) => {
    const colors = {
      published: "bg-green-100 text-green-700 border-green-200",
      unpublished: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[status] || colors.published;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All Guidelines</h1>
              <p className="text-teal-50 text-sm sm:text-base">Browse and manage examination guidelines</p>
            </div>
          </div>
        </div>

        {/* FILTER / SEARCH UI (STATIC ONLY) */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* SEARCH BOX */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <Search className="w-4 h-4 text-teal-600" />
                Search by Title
              </label>
              <input
                disabled
                placeholder="Search guidelines..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* CATEGORY DROPDOWN */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <Filter className="w-4 h-4 text-teal-600" />
                Category
              </label>
              <select
                disabled
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <option>All Categories</option>
              </select>
            </div>

            {/* STATUS DROPDOWN */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <Filter className="w-4 h-4 text-teal-600" />
                Status
              </label>
              <select
                disabled
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <option>All Status</option>
              </select>
            </div>

            {/* DATE PICKER */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <Calendar className="w-4 h-4 text-teal-600" />
                Date
              </label>
              <input
                type="date"
                disabled
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>

          </div>
        </div>

        {/* TABLE STATIC */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {demoData.map((item, index) => (
                  <tr key={item.id} className={`border-b ${index % 2 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">#{item.id}</td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(item.category)}`}>
                        {item.category.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(item.date)}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (STATIC) */}
          <div className="lg:hidden">
            {demoData.map((item) => (
              <div key={item.id} className="border-b p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600 font-medium">#{item.id}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* STATIC PAGINATION UI */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-600">Showing 1 to 3 of 3 results</div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button className="w-10 h-10 rounded-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                1
              </button>

              <button className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewAllGuidelineUI;




















