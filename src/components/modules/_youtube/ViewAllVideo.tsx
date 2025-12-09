// "use client";
// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Video,
//   Search,
//   Globe,
//   Lock,
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpDown,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import Link from "next/link";

// // Demo data
// const videosData = [
//   {
//     id: 1,
//     thumbnailLink: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
//     title: "System Configuration Class 2",
//     description: "Complete system configuration tutorial",
//     videoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
//     duration: "29:28",
//     visibility: "Unlisted",
//     restrictions: "None",
//     date: "Nov 16, 2025",
//     status: "Uploaded",
//     views: 1,
//     comments: 0,
//     likes: 0,
//     isPublished: false,
//   },
//   {
//     id: 2,
//     thumbnailLink: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
//     title: "System Configuration Class 2",
//     description: "Complete system configuration tutorial",
//     videoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
//     duration: "29:28",
//     visibility: "Unlisted",
//     restrictions: "None",
//     date: "Nov 16, 2025",
//     status: "Uploaded",
//     views: 1,
//     comments: 0,
//     likes: 0,
//     isPublished: false,
//   },
//   {
//     id: 3,
//     thumbnailLink: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
//     title: "Numerical Analysis Class 1",
//     description: "Base Analysis - Fazle Rabbi Lecturer DIU",
//     videoLink: "https://youtube.com/watch?v=abc123",
//     duration: "50:43",
//     visibility: "Unlisted",
//     restrictions: "None",
//     date: "Oct 8, 2025",
//     status: "Uploaded",
//     views: 7,
//     comments: 0,
//     likes: 0,
//     isPublished: false,
//   },
// ];

// export default function ViewAllVideos() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Filter + Sort
//   const filteredAndSortedVideos = useMemo(() => {
//     let filtered = videosData.filter(
//       (video) =>
//         video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         video.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     filtered.sort((a, b) => {
//       let comparison = 0;
//       if (sortBy === "date") {
//         comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
//       } else if (sortBy === "views") {
//         comparison = a.views - b.views;
//       } else if (sortBy === "title") {
//         comparison = a.title.localeCompare(b.title);
//       }
//       return sortOrder === "asc" ? comparison : -comparison;
//     });

//     return filtered;
//   }, [searchQuery, sortBy, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage);
//   const paginatedVideos = filteredAndSortedVideos.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleSort = (column: "date" | "views" | "title") => {
//     if (sortBy === column) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("desc");
//     }
//   };

//   const handleDelete = (id: number, title: string) => {
//     Swal.fire({
//       title: "Delete Video?",
//       text: `Are you sure you want to delete "${title}"?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#166534",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//     });
//   };

//   const handleEdit = (id: number) => {
//     router.push(`/dashboard/youtube/edit-video/${id}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-green-800 rounded-xl flex justify-center items-center shadow-lg">
//                 <Video className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                All Uploaded Videos
//                 </h1>
//                 <p className="text-sm text-gray-600">
//                   {filteredAndSortedVideos.length} videos found
//                 </p>
//               </div>
//             </div>






//             {/* Search */}
//             <div className="relative w-full md:w-80">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search videos..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800"
//               />
            
//             </div>


            
// <Link href={"/dashboard/youtube/create-video"}>

//                             <button
//   className="
//     flex justify-end items-center gap-2 mt-2.5
//     bg-green-800 hover:bg-green-700 
//     text-white font-semibold 
//     px-5 py-3 rounded-lg 
//     shadow-md hover:shadow-lg 
//     transition-all
//   "
// >
//   <Video className="w-5 h-5" />
//   Create Video
// </button>

// </Link>


//           </div>



//         </div>

//         {/* Create Button */}







//         {/* Table */}
//         <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="text-left px-6 py-4">
//                     <input type="checkbox" className="w-4 h-4" />
//                   </th>

//                   <th className="text-left px-6 py-4">
//                     <button
//                       onClick={() => handleSort("title")}
//                       className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
//                     >
//                       Video <ArrowUpDown className="w-4 h-4" />
//                     </button>
//                   </th>

//                   <th className="text-left px-6 py-4">Visibility</th>
//                   <th className="text-left px-6 py-4">Restrictions</th>

//                   <th className="text-left px-6 py-4">
//                     <button
//                       onClick={() => handleSort("date")}
//                       className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
//                     >
//                       Date <ArrowUpDown className="w-4 h-4" />
//                     </button>
//                   </th>

//                   <th className="text-left px-6 py-4">
//                     <button
//                       onClick={() => handleSort("views")}
//                       className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
//                     >
//                       Views <ArrowUpDown className="w-4 h-4" />
//                     </button>
//                   </th>

//                   <th className="text-left px-6 py-4">Comments</th>
//                   <th className="text-left px-6 py-4">Likes</th>
//                   <th className="text-left px-6 py-4">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {paginatedVideos.map((video) => (
//                   <tr key={video.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <input type="checkbox" className="w-4 h-4" />
//                     </td>

//                     {/* Video Info */}
//                     <td className="px-6 py-4">
//                       <div className="flex gap-3">
//                         <div className="relative">
//                           <img
//                             src={video.thumbnailLink}
//                             className="w-32 h-20 rounded-lg border border-gray-300 object-cover"
//                           />
//                           <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
//                             {video.duration}
//                           </span>
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-900 text-sm mb-1">
//                             {video.title}
//                           </h3>
//                           <p className="text-xs text-gray-600 line-clamp-1">
//                             {video.description}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Visibility */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         {video.visibility === "Public" ? (
//                           <>
//                             <Globe className="w-4 h-4 text-green-700" />
//                             <span>Public</span>
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="w-4 h-4 text-gray-600" />
//                             <span>Unlisted</span>
//                           </>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">{video.restrictions}</td>

//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-medium">{video.date}</p>
//                         <p className="text-xs text-gray-500">{video.status}</p>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">{video.views}</td>
//                     <td className="px-6 py-4">{video.comments}</td>
//                     <td className="px-6 py-4">{video.likes || "–"}</td>

//                     {/* Actions */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleEdit(video.id)}
//                           className="p-2 hover:bg-gray-100 rounded-lg"
//                         >
//                           <Edit className="w-4 h-4 text-blue-600" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(video.id, video.title)}
//                           className="p-2 hover:bg-gray-100 rounded-lg"
//                         >
//                           <Trash2 className="w-4 h-4 text-green-800" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
//             <p className="text-sm text-gray-700">
//               Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//               {Math.min(currentPage * itemsPerPage, filteredAndSortedVideos.length)}{" "}
//               of {filteredAndSortedVideos.length} videos
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-4 py-2 rounded-lg ${
//                     currentPage === page
//                       ? "bg-green-800 text-white"
//                       : "border border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// "use client";

// import React from "react";
// import {
//   FileText,
//   Search,
//   Filter,
//   Calendar,
//   Clock,
//   Eye,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";

// // --- STATIC DEMO DATA ---
// const demoData = [
//   {
//     id: 1,
//     title: "BCS Preliminary Exam Guidelines",
//     category: "exam",
//     description: "Complete guidelines for BCS preliminary examination.",
//     date: "2025-11-05",
//     time: "10:30",
//     status: "published",
//   },
//   {
//     id: 2,
//     title: "MCQ Test Instructions",
//     category: "mcq",
//     description: "Instructions and rules for MCQ based tests.",
//     date: "2025-11-08",
//     time: "14:15",
//     status: "published",
//   },
//   {
//     id: 3,
//     title: "General Rules",
//     category: "rules",
//     description: "General exam rules and candidate responsibilities.",
//     date: "2025-11-01",
//     time: "09:00",
//     status: "unpublished",
//   },
// ];

// const ViewAllGuidelineUI = () => {
//   const formatDate = (d) => {
//     const date = new Date(d);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getCategoryBadge = (category) => {
//     const colors = {
//       exam: "bg-blue-100 text-blue-700 border-blue-200",
//       mcq: "bg-purple-100 text-purple-700 border-purple-200",
//       rules: "bg-red-100 text-red-700 border-red-200",
//       instructions: "bg-orange-100 text-orange-700 border-orange-200",
//       general: "bg-green-100 text-green-700 border-green-200",
//     };
//     return colors[category] || colors.general;
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       published: "bg-green-100 text-green-700 border-green-200",
//       unpublished: "bg-yellow-100 text-yellow-700 border-yellow-200",
//     };
//     return colors[status] || colors.published;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All Guidelines</h1>
//               <p className="text-teal-50 text-sm sm:text-base">Browse and manage examination guidelines</p>
//             </div>
//           </div>
//         </div>

//         {/* FILTER / SEARCH UI (STATIC ONLY) */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//             {/* SEARCH BOX */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Search className="w-4 h-4 text-teal-600" />
//                 Search by Title
//               </label>
//               <input
//                 disabled
//                 placeholder="Search guidelines..."
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
//               />
//             </div>

//             {/* CATEGORY DROPDOWN */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Filter className="w-4 h-4 text-teal-600" />
//                 Category
//               </label>
//               <select
//                 disabled
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
//               >
//                 <option>All Categories</option>
//               </select>
//             </div>

//             {/* STATUS DROPDOWN */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Filter className="w-4 h-4 text-teal-600" />
//                 Status
//               </label>
//               <select
//                 disabled
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
//               >
//                 <option>All Status</option>
//               </select>
//             </div>

//             {/* DATE PICKER */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
//                 <Calendar className="w-4 h-4 text-teal-600" />
//                 Date
//               </label>
//               <input
//                 type="date"
//                 disabled
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
//               />
//             </div>

//           </div>
//         </div>

//         {/* TABLE STATIC */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

//           {/* DESKTOP TABLE */}
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
//                 {demoData.map((item, index) => (
//                   <tr key={item.id} className={`border-b ${index % 2 ? "bg-white" : "bg-gray-50"}`}>
//                     <td className="px-6 py-4 text-sm text-gray-600 font-medium">#{item.id}</td>

//                     <td className="px-6 py-4">
//                       <p className="font-semibold text-gray-800">{item.title}</p>
//                       <p className="text-sm text-gray-600">{item.description}</p>
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(item.category)}`}>
//                         {item.category.toUpperCase()}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
//                         {item.status.toUpperCase()}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-1">
//                         <span className="text-sm text-gray-700 flex items-center gap-1">
//                           <Calendar className="w-3.5 h-3.5" />
//                           {formatDate(item.date)}
//                         </span>
//                         <span className="text-sm text-gray-600 flex items-center gap-1">
//                           <Clock className="w-3.5 h-3.5" />
//                           {item.time}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button className="p-2 bg-green-100 text-green-600 rounded-lg">
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button className="p-2 bg-red-100 text-red-600 rounded-lg">
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* MOBILE CARD VIEW (STATIC) */}
//           <div className="lg:hidden">
//             {demoData.map((item) => (
//               <div key={item.id} className="border-b p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-sm text-gray-600 font-medium">#{item.id}</span>
//                   <div className="flex gap-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
//                       {item.status.toUpperCase()}
//                     </span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(item.category)}`}>
//                       {item.category.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>

//                 <h3 className="font-semibold text-gray-800">{item.title}</h3>
//                 <p className="text-sm text-gray-600 mb-3">{item.description}</p>

//                 <div className="flex justify-between items-center">
//                   <div className="text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-3.5 h-3.5" />
//                       {formatDate(item.date)}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3.5 h-3.5" />
//                       {item.time}
//                     </div>
//                   </div>

//                   <div className="flex gap-1">
//                     <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 bg-green-100 text-green-600 rounded-lg">
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 bg-red-100 text-red-600 rounded-lg">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* STATIC PAGINATION UI */}
//           <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
//             <div className="text-sm text-gray-600">Showing 1 to 3 of 3 results</div>

//             <div className="flex items-center gap-2">
//               <button className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700">
//                 <ChevronLeft className="w-5 h-5" />
//               </button>

//               <button className="w-10 h-10 rounded-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
//                 1
//               </button>

//               <button className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700">
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewAllGuidelineUI;



















// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Filter,
//   Calendar,
//   Eye,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import Swal from 'sweetalert2';

// function getCookie(name) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     return parts.pop()?.split(";").shift() || null;
//   }
//   return null;
// }

// const ViewAllYouTubeVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Pagination & Filters
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);
//   const [limit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

//   // Fetch videos
//   const fetchVideos = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getCookie('access_token');
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: limit.toString(),
//         ...(searchTerm && { searchTerm })
//       });

//       const response = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: {
//           'Authorization': token || '',
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch videos');
//       }

//       const result = await response.json();
//       console.log("ViewAllYoutube Video", result)
      
//       if (result.success && result.data) {
//         setVideos(result.data.data || []);
//         setTotalPages(result.data.totalPage || 1);
//         setTotalResults(result.data.total || 0);
//       }
//     } catch (err) {
//       console.error('Error fetching videos:', err);
//       setError(err.message);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to load videos. Please try again.',
//         confirmButtonColor: '#0d9488'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [currentPage, searchTerm]);

//   // Handle search
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setCurrentPage(1);
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Toggle visibility
//   const toggleVisibility = async (videoId, currentStatus) => {
//     try {
//       const token = getCookie('access_token');
      
//       const response = await fetch(`${BASE_URL}/youtube/${videoId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': token || '',
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle visibility');
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: `Video ${currentStatus ? 'unpublished' : 'published'} successfully`,
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       console.error('Error toggling visibility:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to toggle visibility',
//         confirmButtonColor: '#0d9488'
//       });
//     }
//   };

//   // Delete video
//   const handleDelete = async (videoId, title) => {
//     const result = await Swal.fire({
//       icon: 'warning',
//       title: 'Are you sure?',
//       text: `Delete "${title}"? This action cannot be undone.`,
//       showCancelButton: true,
//       confirmButtonColor: '#dc2626',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = getCookie('access_token');
      
//       const response = await fetch(`${BASE_URL}/youtube/${videoId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': token || ''
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete video');
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Deleted!',
//         text: 'Video has been deleted successfully',
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       console.error('Error deleting video:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to delete video',
//         confirmButtonColor: '#0d9488'
//       });
//     }
//   };

//   // Handle video click - open in new tab
//   const handleVideoClick = (url) => {
//     if (url) {
//       window.open(url, '_blank');
//     }
//   };

//   // Pagination
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   if (loading && videos.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 font-semibold">Loading videos...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All YouTube Videos</h1>
//               <p className="text-teal-50 text-sm sm:text-base">Browse and manage YouTube videos</p>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-2">
//                 <Search className="w-4 h-4 text-teal-600" />
//                 Search by Title
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={handleSearchKeyPress}
//                   placeholder="Search videos..."
//                   className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg"
//                 >
//                   Search
//                 </button>
//                 {searchTerm && (
//                   <button
//                     onClick={() => {
//                       setSearchTerm("");
//                       setSearchInput("");
//                       setCurrentPage(1);
//                     }}
//                     className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ERROR STATE */}
//         {error && (
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <span className="text-red-800">{error}</span>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

//           {/* DESKTOP TABLE */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Thumbnail</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Title & Description</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Video</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
//                       <span className="text-gray-600">Loading...</span>
//                     </td>
//                   </tr>
//                 ) : videos.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                       No videos found
//                     </td>
//                   </tr>
//                 ) : (
//                   videos.map((item, index) => (
//                     <tr key={item._id} className={`border-b ${index % 2 ? "bg-white" : "bg-gray-50"} hover:bg-teal-50 transition-colors`}>
//                       <td className="px-6 py-4">
//                         <img
//                           src={item.thumbnail_url || 'https://via.placeholder.com/150'}
//                           alt={item.title}
//                           className="w-24 h-16 object-cover rounded-lg shadow-md"
//                         />
//                       </td>

//                       <td className="px-6 py-4 max-w-xs">
//                         <p className="font-semibold text-gray-800 mb-1 truncate">{item.title}</p>
//                         <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></p>
//                       </td>

//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleVideoClick(item.video_url)}
//                           className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                           title="Play Video"
//                         >
//                           <Play className="w-5 h-5 fill-current" />
//                           <span className="text-sm font-semibold">Play</span>
//                         </button>
//                       </td>

//                       <td className="px-6 py-4">
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={item.is_published}
//                             onChange={() => toggleVisibility(item._id, item.is_published)}
//                             className="sr-only peer"
//                           />
//                           <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
//                           <span className="ml-3 text-sm font-medium text-gray-700">
//                             {item.is_published ? 'Published' : 'Unpublished'}
//                           </span>
//                         </label>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1 text-sm text-gray-700">
//                           <Calendar className="w-3.5 h-3.5" />
//                           {formatDate(item.createdAt)}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleVideoClick(item.video_url)}
//                             className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//                             title="View Video"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id, item.title)}
//                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* MOBILE CARD VIEW */}
//           <div className="lg:hidden">
//             {loading ? (
//               <div className="p-12 text-center">
//                 <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
//                 <span className="text-gray-600">Loading...</span>
//               </div>
//             ) : videos.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 No videos found
//               </div>
//             ) : (
//               videos.map((item) => (
//                 <div key={item._id} className="border-b p-4 hover:bg-teal-50 transition-colors">
//                   <div className="flex gap-3 mb-3">
//                     <img
//                       src={item.thumbnail_url || 'https://via.placeholder.com/150'}
//                       alt={item.title}
//                       className="w-24 h-16 object-cover rounded-lg shadow-md"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
//                       <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Calendar className="w-3 h-3" />
//                         {formatDate(item.createdAt)}
//                       </div>
//                     </div>
//                   </div>

//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></p>

//                   <div className="flex items-center justify-between mb-3">
//                     <button
//                       onClick={() => handleVideoClick(item.video_url)}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
//                     >
//                       <Play className="w-4 h-4 fill-current" />
//                       Play Video
//                     </button>

//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={item.is_published}
//                         onChange={() => toggleVisibility(item._id, item.is_published)}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
//                       <span className="ml-2 text-xs font-medium text-gray-700">
//                         {item.is_published ? 'Published' : 'Draft'}
//                       </span>
//                     </label>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleVideoClick(item.video_url)}
//                       className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Eye className="w-4 h-4" />
//                       <span className="text-sm font-semibold">View</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item._id, item.title)}
//                       className="flex-1 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       <span className="text-sm font-semibold">Delete</span>
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION */}
//           {!loading && videos.length > 0 && (
//             <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalResults)} of {totalResults} results
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>

//                 {[...Array(Math.min(5, totalPages))].map((_, idx) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = idx + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = idx + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + idx;
//                   } else {
//                     pageNum = currentPage - 2 + idx;
//                   }

//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => goToPage(pageNum)}
//                       className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
//                         currentPage === pageNum
//                           ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
//                           : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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

// export default ViewAllYouTubeVideos;
























// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Filter,
//   Calendar,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import Swal from 'sweetalert2';

// function getCookie(name:string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     return parts.pop()?.split(";").shift() || null;
//   }
//   return null;
// }

// const ViewAllYouTubeVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Pagination & Filters
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);
//   const [limit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

//   // Fetch videos
//   const fetchVideos = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = getCookie('access_token');
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: limit.toString(),
//         ...(searchTerm && { searchTerm })
//       });

//       const response = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: {
//           'Authorization': token || '',
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch videos');
//       }

//       const result = await response.json();
      
//       console.log('API Response:', result);
      
//       if (result.success && result.data) {
//         setVideos(result.data.data || []);
//         setTotalPages(result.data.totalPage || 1);
//         setTotalResults(result.data.total || 0);
//         setCurrentPage(result.data.page || 1);
//       }
//     } catch (err) {
//       console.error('Error fetching videos:', err);
//       setError(err.message);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to load videos. Please try again.',
//         confirmButtonColor: '#0d9488'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [currentPage, searchTerm]);

//   // Handle search
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setCurrentPage(1);
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Toggle visibility
//   const toggleVisibility = async (videoId, currentStatus) => {
//     try {
//       const token = getCookie('access_token');
      
//       const response = await fetch(`${BASE_URL}/youtube/${videoId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': token || '',
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       console.log('API Response:', data);

//       if (!response.ok) {
//         throw new Error('Failed to toggle visibility');
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: `Video ${currentStatus ? 'unpublished' : 'published'} successfully`,
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       console.error('Error toggling visibility:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to toggle visibility',
//         confirmButtonColor: '#0d9488'
//       });
//     }
//   };

//   // Delete video
//   const handleDelete = async (videoId, title) => {
//     const result = await Swal.fire({
//       icon: 'warning',
//       title: 'Are you sure?',
//       text: `Delete "${title}"? This action cannot be undone.`,
//       showCancelButton: true,
//       confirmButtonColor: '#dc2626',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = getCookie('access_token');
      
//       const response = await fetch(`${BASE_URL}/youtube/${videoId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': token || ''
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete video');
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Deleted!',
//         text: 'Video has been deleted successfully',
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       console.error('Error deleting video:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to delete video',
//         confirmButtonColor: '#0d9488'
//       });
//     }
//   };

//   // Handle update - navigate to update page or open modal
//   const handleUpdate = async (video) => {
//     const { value: formValues } = await Swal.fire({
//       title: 'Update Video',
//       html: `
//         <div style="text-align: left;">
//           <label style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
//           <input id="swal-title" class="swal2-input" value="${video.title}" style="width: 90%; margin-bottom: 15px;">
          
//           <label style="display: block; margin-bottom: 5px; font-weight: bold;">Video URL:</label>
//           <input id="swal-video-url" class="swal2-input" value="${video.video_url}" style="width: 90%; margin-bottom: 15px;">
          
//           <label style="display: block; margin-bottom: 5px; font-weight: bold;">Description:</label>
//           <textarea id="swal-description" class="swal2-textarea" style="width: 90%; height: 100px; margin-bottom: 15px;">${video.description}</textarea>
//         </div>
//       `,
//       focusConfirm: false,
//       showCancelButton: true,
//       confirmButtonText: 'Update',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#0d9488',
//       preConfirm: () => {
//         return {
//           title: document.getElementById('swal-title').value,
//           video_url: document.getElementById('swal-video-url').value,
//           description: document.getElementById('swal-description').value
//         }
//       }
//     });

//     if (formValues) {
//       setIsUpdating(true);
//       try {
//         const token = getCookie('access_token');
        
//         const updateData = {
//           title: formValues.title,
//           video_url: formValues.video_url,
//           description: formValues.description,
//           thumbnail_url: video.thumbnail_url,
//           is_published: video.is_published
//         };

//         const response = await fetch(`${BASE_URL}/youtube/${video.videoId}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': token || '',
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(updateData)
//         });

//         const data = await response.json();

//        console.log("Update Video", data)

//         if (!response.ok) {
//           throw new Error('Failed to update video');
//         }

//         await Swal.fire({
//           icon: 'success',
//           title: 'Updated!',
//           text: 'Video has been updated successfully',
//           timer: 2000,
//           showConfirmButton: false
//         });

//         fetchVideos();
//       } catch (err) {
//         console.error('Error updating video:', err);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Failed to update video',
//           confirmButtonColor: '#0d9488'
//         });
//       } finally {
//         setIsUpdating(false);
//       }
//     }
//   };

//   // Handle video click - open in new tab
//   const handleVideoClick = (url) => {
//     if (url) {
//       window.open(url, '_blank');
//     }
//   };

//   // Pagination
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   if (loading && videos.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 font-semibold">Loading videos...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All YouTube Videos</h1>
//               <p className="text-teal-50 text-sm sm:text-base">Browse and manage YouTube videos</p>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-2">
//                 <Search className="w-4 h-4 text-teal-600" />
//                 Search by Title
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={handleSearchKeyPress}
//                   placeholder="Search videos..."
//                   className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg"
//                 >
//                   Search
//                 </button>
//                 {searchTerm && (
//                   <button
//                     onClick={() => {
//                       setSearchTerm("");
//                       setSearchInput("");
//                       setCurrentPage(1);
//                     }}
//                     className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ERROR STATE */}
//         {error && (
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <span className="text-red-800">{error}</span>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

//           {/* DESKTOP TABLE */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Thumbnail</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Title & Description</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Video</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
//                       <span className="text-gray-600">Loading...</span>
//                     </td>
//                   </tr>
//                 ) : videos.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                       No videos found
//                     </td>
//                   </tr>
//                 ) : (
//                   videos.map((item, index) => (
//                     <tr key={item._id} className={`border-b ${index % 2 ? "bg-white" : "bg-gray-50"} hover:bg-teal-50 transition-colors`}>
//                       <td className="px-6 py-4">
//                         <img
//                           src={item.thumbnail_url || 'https://via.placeholder.com/150'}
//                           alt={item.title}
//                           className="w-24 h-16 object-cover rounded-lg shadow-md"
//                         />
//                       </td>

//                       <td className="px-6 py-4 max-w-xs">
//                         <p className="font-semibold text-gray-800 mb-1 truncate">{item.title}</p>
//                         <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></p>
//                       </td>

//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleVideoClick(item.video_url)}
//                           className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                           title="Play Video"
//                         >
//                           <Play className="w-5 h-5 fill-current" />
//                           <span className="text-sm font-semibold">Play</span>
//                         </button>
//                       </td>

//                       <td className="px-6 py-4">
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={item.is_published}
//                             onChange={() => toggleVisibility(item._id, item.is_published)}
//                             className="sr-only peer"
//                           />
//                           <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
//                           <span className="ml-3 text-sm font-medium text-gray-700">
//                             {item.is_published ? 'Published' : 'Unpublished'}
//                           </span>
//                         </label>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1 text-sm text-gray-700">
//                           <Calendar className="w-3.5 h-3.5" />
//                           {formatDate(item.createdAt)}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleUpdate(item)}
//                             disabled={isUpdating}
//                             className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
//                             title="Update"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.videoId, item.title)}
//                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* MOBILE CARD VIEW */}
//           <div className="lg:hidden">
//             {loading ? (
//               <div className="p-12 text-center">
//                 <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
//                 <span className="text-gray-600">Loading...</span>
//               </div>
//             ) : videos.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 No videos found
//               </div>
//             ) : (
//               videos.map((item) => (
//                 <div key={item._id} className="border-b p-4 hover:bg-teal-50 transition-colors">
//                   <div className="flex gap-3 mb-3">
//                     <img
//                       src={item.thumbnail_url || 'https://via.placeholder.com/150'}
//                       alt={item.title}
//                       className="w-24 h-16 object-cover rounded-lg shadow-md"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
//                       <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Calendar className="w-3 h-3" />
//                         {formatDate(item.createdAt)}
//                       </div>
//                     </div>
//                   </div>

//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></p>

//                   <div className="flex items-center justify-between mb-3">
//                     <button
//                       onClick={() => handleVideoClick(item.video_url)}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
//                     >
//                       <Play className="w-4 h-4 fill-current" />
//                       Play Video
//                     </button>

//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={item.is_published}
//                         onChange={() => toggleVisibility(item._id, item.is_published)}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
//                       <span className="ml-2 text-xs font-medium text-gray-700">
//                         {item.is_published ? 'Published' : 'Draft'}
//                       </span>
//                     </label>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleUpdate(item)}
//                       disabled={isUpdating}
//                       className="flex-1 p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                     >
//                       <Edit className="w-4 h-4" />
//                       <span className="text-sm font-semibold">Update</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item._id, item.title)}
//                       className="flex-1 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       <span className="text-sm font-semibold">Delete</span>
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION */}
//           {!loading && videos.length > 0 && totalPages > 0 && (
//             <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalResults)} of {totalResults} results
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {currentPage > 3 && (
//                     <>
//                       <button
//                         onClick={() => goToPage(1)}
//                         className="w-10 h-10 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
//                       >
//                         1
//                       </button>
//                       {currentPage > 4 && <span className="px-2">...</span>}
//                     </>
//                   )}

//                   {[...Array(totalPages)].map((_, idx) => {
//                     const pageNum = idx + 1;
                    
//                     if (
//                       pageNum === currentPage ||
//                       pageNum === currentPage - 1 ||
//                       pageNum === currentPage + 1 ||
//                       (currentPage <= 2 && pageNum <= 3) ||
//                       (currentPage >= totalPages - 1 && pageNum >= totalPages - 2)
//                     ) {
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => goToPage(pageNum)}
//                           className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
//                             currentPage === pageNum
//                               ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
//                               : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     }
//                     return null;
//                   })}

//                   {currentPage < totalPages - 2 && (
//                     <>
//                       {currentPage < totalPages - 3 && <span className="px-2">...</span>}
//                       <button
//                         onClick={() => goToPage(totalPages)}
//                         className="w-10 h-10 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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

// export default ViewAllYouTubeVideos;













// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Filter,
//   Calendar,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import Swal from 'sweetalert2';

// function getCookie(name: string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// }

// const ViewAllYouTubeVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);
//   const [limit] = useState(10);

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   const [isUpdating, setIsUpdating] = useState(false);

//   const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

//   // Fetch videos
//   const fetchVideos = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = getCookie("access_token");

//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: limit.toString(),
//         ...(searchTerm && { searchTerm })
//       });

//       const response = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) throw new Error("Failed to fetch videos");

//       const result = await response.json();

//       if (result.success && result.data) {
//         setVideos(result.data.data || []);
//         setTotalPages(result.data.totalPage || 1);
//         setTotalResults(result.data.total || 0);
//         setCurrentPage(result.data.page || 1);
//       }

//     } catch (err: any) {
//       console.error("Fetch Error:", err);
//       setError(err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to load videos. Please try again.",
//       });

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [currentPage, searchTerm]);


//   // Search
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setCurrentPage(1);
//   };

//   const handleSearchKeyPress = (e: any) => {
//     if (e.key === "Enter") handleSearch();
//   };


//   // Toggle visibility — FIXED (use video_number)
//   const toggleVisibility = async (video_number: number, currentStatus: boolean) => {
//     try {
//       const token = getCookie("access_token");

//       const response = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await response.json();
//       console.log("Toggle Response:", data);

//       if (!response.ok) throw new Error("Failed to toggle visibility");

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `Video ${currentStatus ? "unpublished" : "published"} successfully`,
//         timer: 1800,
//         showConfirmButton: false
//       });

//       fetchVideos();

//     } catch (err) {
//       console.error("Toggle Error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to toggle visibility",
//       });
//     }
//   };


//   // Delete video — FIXED (use video_number)
//   const handleDelete = async (video_number: number, title: string) => {
//     const result = await Swal.fire({
//       icon: "warning",
//       title: "Are you sure?",
//       text: `Delete "${title}" permanently?`,
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = getCookie("access_token");

//       const response = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "DELETE",
//         headers: { Authorization: token || "" }
//       });

//       if (!response.ok) throw new Error("Delete failed");

//       Swal.fire({
//         icon: "success",
//         title: "Deleted",
//         text: "Video deleted successfully",
//         timer: 1800,
//         showConfirmButton: false
//       });

//       fetchVideos();

//     } catch (err) {
//       console.error("Delete Error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to delete video",
//       });
//     }
//   };


//   // Update video — FIXED (use video_number)
//   const handleUpdate = async (video: any) => {
//     const { value: formValues } = await Swal.fire({
//       title: "Update Video",
//       html: `
//         <label>Title</label>
//         <input id="swal-title" class="swal2-input" value="${video.title}">
        
//         <label>Video URL</label>
//         <input id="swal-video-url" class="swal2-input" value="${video.video_url}">
        
//         <label>Description</label>
//         <textarea id="swal-description" class="swal2-textarea">${video.description}</textarea>
//       `,
//       showCancelButton: true,
//       confirmButtonText: "Update",
//       confirmButtonColor: "#0d9488",
//       preConfirm: () => ({
//         title: (document.getElementById("swal-title") as any).value,
//         video_url: (document.getElementById("swal-video-url") as any).value,
//         description: (document.getElementById("swal-description") as any).value
//       })
//     });

//     if (!formValues) return;

//     setIsUpdating(true);

//     try {
//       const token = getCookie("access_token");

//       const updatePayload = {
//         title: formValues.title,
//         video_url: formValues.video_url,
//         description: formValues.description,
//         thumbnail_url: video.thumbnail_url,
//         is_published: video.is_published
//       };

//       const response = await fetch(`${BASE_URL}/youtube/${video.video_number}`, {
//         method: "PUT",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       const data = await response.json();
//       console.log("Update Response:", data);

//       if (!response.ok) throw new Error("Update failed");

//       Swal.fire({
//         icon: "success",
//         title: "Updated!",
//         text: "Video updated successfully",
//         timer: 1800,
//         showConfirmButton: false
//       });

//       fetchVideos();

//     } catch (err) {
//       console.error("Update Error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update video",
//       });

//     } finally {
//       setIsUpdating(false);
//     }
//   };


//   // Video click
//   const handleVideoClick = (url: string) => {
//     if (url) window.open(url, "_blank");
//   };


//   // Pagination
//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };


//   // Format date
//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "N/A";
//     return new Date(dateStr).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric"
//     });
//   };


//   // LOADING Screen
//   if (loading && videos.length === 0) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-6">
//           <div className="flex items-center gap-4">
//             <FileText className="w-12 h-12" />
//             <div>
//               <h1 className="text-4xl font-bold">All YouTube Videos</h1>
//               <p className="opacity-90">Browse and manage YouTube videos</p>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
//           <label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
//             <Search className="w-5 h-5 text-teal-600" /> Search by Title
//           </label>

//           <div className="flex gap-3">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyPress={handleSearchKeyPress}
//               placeholder="Search videos..."
//               className="flex-1 border-2 rounded-xl px-4 py-2"
//             />

//             <button
//               onClick={handleSearch}
//               className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl text-white"
//             >
//               Search
//             </button>

//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchInput("");
//                   setSearchTerm("");
//                 }}
//                 className="px-6 py-2 bg-gray-200 rounded-xl"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-100 text-red-700 border border-red-300 rounded-xl p-4 mb-6 flex items-center gap-3">
//             <AlertCircle className="w-6 h-6" />
//             {error}
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">

//           {/* DESKTOP TABLE */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
//                 <tr>
//                   <th className="p-4 text-left">Thumbnail</th>
//                   <th className="p-4 text-left">Title</th>
//                   <th className="p-4 text-left">Video</th>
//                   <th className="p-4 text-left">Status</th>
//                   <th className="p-4 text-left">Date</th>
//                   <th className="p-4 text-center">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {videos.map((item: any, index: number) => (
//                   <tr key={item.video_number} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}>
//                     <td className="p-4">
//                       <img src={item.thumbnail_url} className="w-24 h-16 rounded-lg" />
//                     </td>

//                     <td className="p-4 max-w-xs">
//                       <p className="font-semibold">{item.title}</p>
//                       <p className="text-sm text-gray-600 line-clamp-2"
//                         dangerouslySetInnerHTML={{ __html: item.description }}>
//                       </p>
//                     </td>

//                     <td className="p-4">
//                       <button
//                         onClick={() => handleVideoClick(item.video_url)}
//                         className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg"
//                       >
//                         <Play className="w-4 h-4" /> Play
//                       </button>
//                     </td>

//                     <td className="p-4">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={item.is_published}
//                           onChange={() => toggleVisibility(item.video_number, item.is_published)}
//                           className="sr-only peer"
//                         />
//                         <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-teal-600 relative after:absolute after:h-6 after:w-6 after:bg-white after:rounded-full after:top-0.5 after:left-1 after:transition-all peer-checked:after:translate-x-7"></div>
//                         <span className="ml-3">{item.is_published ? "Published" : "Unpublished"}</span>
//                       </label>
//                     </td>

//                     <td className="p-4">{formatDate(item.createdAt)}</td>

//                     <td className="p-4">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleUpdate(item)}
//                           disabled={isUpdating}
//                           className="p-2 bg-green-100 text-green-600 rounded-lg"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(item.video_number, item.title)}
//                           className="p-2 bg-red-100 text-red-600 rounded-lg"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>


//           {/* MOBILE VIEW */}
//           <div className="lg:hidden p-4">
//             {videos.map((item: any) => (
//               <div key={item.video_number} className="border-b pb-4 mb-4">

//                 <img src={item.thumbnail_url} className="w-full h-40 rounded-xl mb-3" />

//                 <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>

//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2"
//                    dangerouslySetInnerHTML={{ __html: item.description }}>
//                 </p>

//                 <div className="flex justify-between items-center mb-3">
//                   <button
//                     onClick={() => handleVideoClick(item.video_url)}
//                     className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg"
//                   >
//                     <Play className="w-4 h-4" /> Play
//                   </button>

//                   <label className="inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={item.is_published}
//                       onChange={() => toggleVisibility(item.video_number, item.is_published)}
//                       className="sr-only"
//                     />
//                     <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-600 relative after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-0.5 after:left-1 after:transition-all peer-checked:after:translate-x-6"></div>
//                   </label>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleUpdate(item)}
//                     className="flex-1 p-2 bg-green-100 text-green-600 rounded-lg"
//                   >
//                     <Edit className="w-4 h-4 inline" /> Update
//                   </button>

//                   <button
//                     onClick={() => handleDelete(item.video_number, item.title)}
//                     className="flex-1 p-2 bg-red-100 text-red-600 rounded-lg"
//                   >
//                     <Trash2 className="w-4 h-4 inline" /> Delete
//                   </button>
//                 </div>

//               </div>
//             ))}
//           </div>


//           {/* PAGINATION */}
//           {videos.length > 0 && (
//             <div className="bg-gray-50 px-4 py-4 flex justify-between items-center">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => goToPage(currentPage - 1)}
//                 className="p-2 bg-white border rounded-lg disabled:opacity-50"
//               >
//                 <ChevronLeft />
//               </button>

//               <span className="text-sm">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => goToPage(currentPage + 1)}
//                 className="p-2 bg-white border rounded-lg disabled:opacity-50"
//               >
//                 <ChevronRight />
//               </button>
//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default ViewAllYouTubeVideos;













// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Calendar,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { useRouter } from "next/navigation";

// function getCookie(name: string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// }

// const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

// export default function ViewAllYouTubeVideos() {
//   const router = useRouter();
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [error, setError] = useState(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   // ==============================
//   // Fetch All Videos
//   // ==============================
//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const token = getCookie("access_token");

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//         ...(searchTerm && { searchTerm })
//       });

//       const res = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: { Authorization: token || "" }
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to load videos");

//       setVideos(data.data.data);
//       setTotalPages(data.data.totalPage);
//       setTotalResults(data.data.total);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [page, searchTerm]);

//   // ==============================
//   // Search Handler
//   // ==============================
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setPage(1);
//   };

//   // ==============================
//   // Toggle Publish / Unpublish FIXED
//   // ==============================
//   const toggleVisibility = async (video_number: number, current: boolean) => {
//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ is_published: !current }) // FIXED!
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: current ? "Video unpublished successfully" : "Video published successfully",
//         timer: 1500,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to toggle visibility"
//       });
//     }
//   };

//   // ==============================
//   // Delete Video
//   // ==============================
//   const deleteVideo = async (video_number: number, title: string) => {
//     const confirm = await Swal.fire({
//       icon: "warning",
//       title: "Are you sure?",
//       text: `Delete "${title}"?`,
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626"
//     });
//     if (!confirm.isConfirmed) return;

//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "DELETE",
//         headers: { Authorization: token || "" }
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Video deleted successfully",
//         timer: 1500,
//         showConfirmButton: false
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to delete video"
//       });
//     }
//   };

//   // ==============================
//   // Save Updated Video
//   // ==============================
//   const saveUpdatedVideo = async (video: any) => {
//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video.video_number}`, {
//         method: "PUT",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(video)

//       });

//                 router.push(`/dashboard/youtube/view-video/update/${video.video_number}`);


//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       Swal.fire({
//         icon: "success",
//         title: "Updated!",
//         text: "Video updated successfully",
//         timer: 1500,
//         showConfirmButton: false
//       });

//       setEditingVideo(null);
//       fetchVideos();

//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update video"
//       });
//     }
//   };

//   // ==============================
//   // Format Date
//   // ==============================
//   const formatDate = (date: string) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric"
//     });
//   };

//   // ==============================
//   // If Loading Screen
//   // ==============================
//   if (loading && videos.length === 0)
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-2xl text-white mb-6 shadow-lg">
//           <div className="flex gap-4 items-center">
//             <FileText className="w-10 h-10" />
//             <div>
//               <h1 className="text-3xl font-bold">All YouTube Videos</h1>
//               <p className="opacity-90">Manage all uploaded videos</p>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6">
//           <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//             <Search className="w-5 h-5 text-teal-600" /> Search by Title
//           </label>

//           <div className="flex gap-3">
//             <input
//               className="flex-1 border p-3 rounded-xl"
//               placeholder="Search videos..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />

//             <button
//               onClick={handleSearch}
//               className="px-6 rounded-xl bg-teal-600 text-white font-semibold shadow"
//             >
//               Search
//             </button>

//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSearchInput("");
//                 }}
//                 className="px-6 rounded-xl bg-gray-300 text-gray-800"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6 flex gap-2 items-center">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <span className="text-red-700">{error}</span>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">
//           <table className="w-full hidden lg:table">
//             <thead className="bg-teal-600 text-white">
//               <tr>
//                 <th className="p-4">Thumbnail</th>
//                 <th className="p-4">Title</th>
//                 <th className="p-4">Play</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4">Date</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {videos.map((v: any, i) => (
//                 <tr key={v.video_number} className="border-b hover:bg-gray-50">
//                   <td className="p-4">
//                     <img src={v.thumbnail_url} className="w-24 h-16 rounded-lg" />
//                   </td>

//                   <td className="p-4">
//                     <p className="font-semibold">{v.title}</p>
//                     <p
//                       className="text-gray-600 text-sm line-clamp-2"
//                       dangerouslySetInnerHTML={{ __html: v.description }}
//                     ></p>
//                   </td>

//                   <td className="p-4">
//                     <button
//                       onClick={() => window.open(v.video_url, "_blank")}
//                       className="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Play className="w-4 h-4 inline" /> Play
//                     </button>
//                   </td>

//                   <td className="p-4">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={v.is_published}
//                         onChange={() =>
//                           toggleVisibility(v.video_number, v.is_published)
//                         }
//                         className="sr-only"
//                       />
//                       <div className="w-14 h-7 bg-gray-300 rounded-full relative peer-checked:bg-teal-600 after:absolute after:h-6 after:w-6 after:bg-white after:rounded-full after:top-0.5 after:left-1 after:transition peer-checked:after:translate-x-7"></div>
//                       <span>{v.is_published ? "Published" : "Unpublished"}</span>
//                     </label>
//                   </td>

//                   <td className="p-4">{formatDate(v.createdAt)}</td>

//                   <td className="p-4 text-center flex justify-center gap-3">
//                     <button
//                       // onClick={() => setEditingVideo(v)}
//                       onClick={() => router.push(`/dashboard/youtube/update?video=${v.video_number}`)}

//                       className="p-2 bg-green-100 text-green-600 rounded-lg"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>

//                     <button
//                       onClick={() => deleteVideo(v.video_number, v.title)}
//                       className="p-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* PAGINATION */}
//           <div className="flex justify-between items-center p-4 bg-gray-50">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronLeft />
//             </button>

//             <span>
//               Page {page} of {totalPages}
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </div>

//         {/* UPDATE SECTION */}
//         {editingVideo && (
//           <div className="bg-white p-6 rounded-2xl shadow-xl mt-8">
//             <h2 className="text-2xl font-bold text-teal-700 mb-4">
//               Update Video
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               <div>
//                 <label className="font-semibold">Title</label>
//                 <input
//                   className="w-full border p-3 rounded-lg"
//                   value={editingVideo.title}
//                   onChange={(e) =>
//                     setEditingVideo({
//                       ...editingVideo,
//                       title: e.target.value
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold">Video URL</label>
//                 <input
//                   className="w-full border p-3 rounded-lg"
//                   value={editingVideo.video_url}
//                   onChange={(e) =>
//                     setEditingVideo({
//                       ...editingVideo,
//                       video_url: e.target.value
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold">Thumbnail URL</label>
//                 <input
//                   className="w-full border p-3 rounded-lg"
//                   value={editingVideo.thumbnail_url}
//                   onChange={(e) =>
//                     setEditingVideo({
//                       ...editingVideo,
//                       thumbnail_url: e.target.value
//                     })
//                   }
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="font-semibold">Description</label>
//                 <textarea
//                   className="w-full border p-3 rounded-lg h-32"
//                   value={editingVideo.description}
//                   onChange={(e) =>
//                     setEditingVideo({
//                       ...editingVideo,
//                       description: e.target.value
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   checked={editingVideo.is_published}
//                   onChange={() =>
//                     setEditingVideo({
//                       ...editingVideo,
//                       is_published: !editingVideo.is_published
//                     })
//                   }
//                 />
//                 <label className="font-semibold">Published</label>
//               </div>
//             </div>

//             <div className="flex gap-4 mt-6">
//               <button
//                 onClick={() => saveUpdatedVideo(editingVideo)}
//                 className="px-6 py-2 bg-teal-600 text-white rounded-lg"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setEditingVideo(null)}
//                 className="px-6 py-2 bg-gray-300 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { useRouter } from "next/navigation";

// function getCookie(name: string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// }

// const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

// export default function ViewAllYouTubeVideos() {
//   const router = useRouter();
//   const [videos, setVideos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [totalPages, setTotalPages] = useState(1);

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   // ==============================
//   // Fetch Videos
//   // ==============================
//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const token = getCookie("access_token");

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//         ...(searchTerm && { searchTerm }),
//       });

//       const res = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: { Authorization: token || "" },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setVideos(data.data.data);
//       setTotalPages(data.data.totalPage);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [page, searchTerm]);

//   // ==============================
//   // Search Handler
//   // ==============================
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setPage(1);
//   };

//   // ==============================
//   // Publish / Unpublish via Dropdown
//   // ==============================
//   const updatePublishStatus = async (
//     video_number: number,
//     newValue: string
//   ) => {
//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ is_published: newValue === "true" }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text:
//           newValue === "true"
//             ? "Video published successfully"
//             : "Video unpublished successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire("Error", "Failed to update publish status", "error");
//     }
//   };

//   // ==============================
//   // Delete Video
//   // ==============================
//   const deleteVideo = async (video_number: number, title: string) => {
//     const confirm = await Swal.fire({
//       icon: "warning",
//       title: "Are you sure?",
//       text: `Delete "${title}"?`,
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "DELETE",
//         headers: { Authorization: token || "" },
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Video deleted successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire("Error", "Failed to delete video", "error");
//     }
//   };

//   // ==============================
//   // Date Format
//   // ==============================
//   const formatDate = (date: string) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // ==============================
//   // Loading Screen
//   // ==============================
//   if (loading && videos.length === 0)
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-2xl text-white mb-6 shadow-lg">
//           <div className="flex gap-4 items-center">
//             <FileText className="w-10 h-10" />
//             <div>
//               <h1 className="text-3xl font-bold">All YouTube Videos</h1>
//               <p className="opacity-90">Manage all uploaded videos</p>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6">
//           <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//             <Search className="w-5 h-5 text-teal-600" /> Search by Title
//           </label>

//           <div className="flex gap-3">
//             <input
//               className="flex-1 border p-3 rounded-xl"
//               placeholder="Search videos..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />

//             <button
//               onClick={handleSearch}
//               className="px-6 rounded-xl bg-teal-600 text-white font-semibold shadow"
//             >
//               Search
//             </button>

//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSearchInput("");
//                 }}
//                 className="px-6 rounded-xl bg-gray-300 text-gray-800"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6 flex gap-2 items-center">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <span className="text-red-700">{error}</span>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">
//           <table className="w-full hidden lg:table">
//             <thead className="bg-teal-600 text-white">
//               <tr>
//                 <th className="p-4">Thumbnail</th>
//                 <th className="p-4">Title</th>
//                 <th className="p-4">Play</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4">Date</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {videos.map((v: any) => (
//                 <tr key={v.video_number} className="border-b hover:bg-gray-50">
//                   <td className="p-4">
//                     <img
//                       src={v.thumbnail_url}
//                       className="w-24 h-16 rounded-lg object-cover"
//                     />
//                   </td>

//                   <td className="p-4">
//                     <p className="font-semibold">{v.title}</p>
//                     <p
//                       className="text-gray-600 text-sm line-clamp-2"
//                       dangerouslySetInnerHTML={{ __html: v.description }}
//                     ></p>
//                   </td>

//                   <td className="p-4">
//                     <button
//                       onClick={() => window.open(v.video_url, "_blank")}
//                       className="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Play className="w-4 h-4 inline" /> Play
//                     </button>
//                   </td>

//                   {/* 🔥 NEW DROPDOWN STATUS */}
//                   <td className="p-4">
//                     <select
//                       value={v.is_published ? "true" : "false"}
//                       onChange={(e) =>
//                         updatePublishStatus(v.video_number, e.target.value)
//                       }
//                       className="border p-2 rounded-lg bg-white"
//                     >
//                       <option value="true">Published</option>
//                       <option value="false">Unpublished</option>
//                     </select>
//                   </td>

//                   <td className="p-4">{formatDate(v.createdAt)}</td>

//                   <td className="p-4 text-center flex justify-center gap-3">
//                     {/* EDIT BUTTON */}
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/dashboard/youtube/update?video=${v.video_number}`
//                         )
//                       }
//                       className="p-2 bg-green-100 text-green-600 rounded-lg"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>

//                     {/* DELETE BUTTON */}
//                     <button
//                       onClick={() => deleteVideo(v.video_number, v.title)}
//                       className="p-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* PAGINATION */}
//           <div className="flex justify-between items-center p-4 bg-gray-50">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronLeft />
//             </button>

//             <span>
//               Page {page} of {totalPages}
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Search,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   Loader2,
//   AlertCircle,
//   PlusCircle,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { ENV } from "@/config/env";

// function getCookie(name: string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mcq-analysis.vercel.app/api/v1";

// export default function ViewAllYouTubeVideos() {
//   const router = useRouter();
//   const [videos, setVideos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [totalPages, setTotalPages] = useState(1);

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   // ==============================
//   // Fetch Videos
//   // ==============================
//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const token = getCookie("access_token");

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//         ...(searchTerm && { searchTerm }),
//       });

//       const res = await fetch(`${BASE_URL}/youtube?${params}`, {
//         headers: { Authorization: token || "" },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setVideos(data.data.data);
//       setTotalPages(data.data.totalPage);

//       // 👉 Prevent invalid empty page
//       if (page > data.data.totalPage) {
//         setPage(1);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [page, searchTerm]);

//   // ==============================
//   // Search Handler
//   // ==============================
//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setPage(1);
//   };

//   // ==============================
//   // Publish / Unpublish
//   // ==============================
//   const updatePublishStatus = async (video_number: number, newValue: string) => {
//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${ENV.BASE_URL}/youtube/${video_number}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: token || "",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ is_published: newValue === "true" }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text:
//           newValue === "true"
//             ? "Video published successfully"
//             : "Video unpublished successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire("Error", "Failed to update publish status", "error");
//     }
//   };

//   // ==============================
//   // Delete Video
//   // ==============================
//   const deleteVideo = async (video_number: number, title: string) => {
//     const confirm = await Swal.fire({
//       icon: "warning",
//       title: "Are you sure?",
//       text: `Delete "${title}"?`,
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const token = getCookie("access_token");

//       const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
//         method: "DELETE",
//         headers: { Authorization: token || "" },
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Video deleted successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       fetchVideos();
//     } catch (err) {
//       Swal.fire("Error", "Failed to delete video", "error");
//     }
//   };

//   // ==============================
//   // Date Format
//   // ==============================
//   const formatDate = (date: string) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // ==============================
//   // Loading Screen
//   // ==============================
//   if (loading && videos.length === 0)
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-2xl text-white mb-6 shadow-lg flex justify-between items-center">
//           <div className="flex gap-4 items-center">
//             <FileText className="w-10 h-10" />
//             <div>
//               <h1 className="text-3xl font-bold">All YouTube Videos</h1>
//               <p className="opacity-90">Manage all uploaded videos</p>
//             </div>
//           </div>

//           {/* CREATE VIDEO BUTTON */}
//            <Link href="/dashboard/youtube/create-video">
           
           
//             <button
//             onClick={() => router.push("/dashboard/youtube/create")}
//             className="flex items-center gap-2 bg-white text-teal-700 font-semibold px-5 py-3 rounded-xl shadow"
//           >
//             <PlusCircle className="w-5 h-5" /> Create Video
//           </button>
//            </Link>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6">
//           <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//             <Search className="w-5 h-5 text-teal-600" /> Search by Title
//           </label>

//           <div className="flex gap-3 flex-wrap">
//             <input
//               className="flex-1 border p-3 rounded-xl"
//               placeholder="Search videos..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />

//             <button
//               onClick={handleSearch}
//               className="px-6 rounded-xl bg-teal-600 text-white font-semibold shadow"
//             >
//               Search
//             </button>

//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSearchInput("");
//                 }}
//                 className="px-6 rounded-xl bg-gray-300 text-gray-800"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6 flex gap-2 items-center">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <span className="text-red-700">{error}</span>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">
//           <table className="w-full hidden lg:table">
//             <thead className="bg-teal-600 text-white">
//               <tr>
//                 <th className="p-4">Thumbnail</th>
//                 <th className="p-4">Title</th>
//                 <th className="p-4">Play</th>
//                 <th className="p-4">Status</th>
      
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {videos.map((v: any) => (
//                 <tr key={v.video_number} className="border-b hover:bg-gray-50">
//                   <td className="p-4">
//                     <img
//                       src={v.thumbnail_url}
//                       className="w-24 h-16 rounded-lg object-cover"
//                     />
//                   </td>

//                   <td className="p-4">
//                     <p className="font-semibold">{v.title}</p>
//                     <p
//                       className="text-gray-600 text-sm line-clamp-2"
//                       dangerouslySetInnerHTML={{ __html: v.description }}
//                     ></p>
//                   </td>

//                   <td className="p-4">
//                     <button
//                       onClick={() => window.open(v.video_url, "_blank")}
//                       className="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Play className="w-4 h-4 inline" /> Play
//                     </button>
//                   </td>

//                   {/* DROPDOWN */}
//                   <td className="p-4">
//                     <select
//                       value={v.is_published ? "true" : "false"}
//                       onChange={(e) =>
//                         updatePublishStatus(v.video_number, e.target.value)
//                       }
//                       className="border p-2 rounded-lg bg-white"
//                     >
//                       <option value="true">Published</option>
//                       <option value="false">Unpublished</option>
//                     </select>
//                   </td>

               

//                   <td className="p-4 text-center flex justify-center gap-3">
//                     {/* EDIT BUTTON */}
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/dashboard/youtube/update?video=${v.video_number}`
//                         )
//                       }
//                       className="p-2 bg-green-100 text-green-600 rounded-lg"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>

//                     {/* DELETE BUTTON */}
//                     <button
//                       onClick={() => deleteVideo(v.video_number, v.title)}
//                       className="p-2 bg-red-100 text-red-600 rounded-lg"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* PAGINATION */}
//           <div className="flex justify-between items-center p-4 bg-gray-50">
//             <button
//               disabled={page === 1 || totalPages === 0}
//               onClick={() => setPage(page - 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronLeft />
//             </button>

//             <span>
//               Page {page} of {totalPages}
//             </span>

//             <button
//               disabled={page >= totalPages || videos.length < limit}
//               onClick={() => setPage(page + 1)}
//               className="p-2 bg-white border rounded-lg disabled:opacity-50"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const BASE_URL = "https://mcq-analysis.vercel.app/api/v1";

export default function ViewAllYouTubeVideos() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination + Limit Filter
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Search Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Collapse Filter Panel
  const [showFilter, setShowFilter] = useState(false);

  // ==============================
  // Fetch Videos
  // ==============================
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = getCookie("access_token");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(searchTerm && { searchTerm }),
      });

      const res = await fetch(`${BASE_URL}/youtube?${params}`, {
        headers: { Authorization: token || "" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setVideos(data.data.data);
      setTotalPages(data.data.totalPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, limit, searchTerm]);

  // ==============================
  // Search Handler
  // ==============================
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  // ==============================
  // Publish / Unpublish
  // ==============================
  const updatePublishStatus = async (video_number: number, newValue: string) => {
    try {
      const token = getCookie("access_token");

      const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
        method: "PATCH",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_published: newValue === "true" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          newValue === "true"
            ? "Video published successfully"
            : "Video unpublished successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchVideos();
    } catch (err) {
      Swal.fire("Error", "Failed to update publish status", "error");
    }
  };

  // ==============================
  // Delete Video
  // ==============================
  const deleteVideo = async (video_number: number, title: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Delete "${title}"?`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = getCookie("access_token");

      const res = await fetch(`${BASE_URL}/youtube/${video_number}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      });

      if (!res.ok) throw new Error("Delete failed");

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Video deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchVideos();
    } catch (err) {
      Swal.fire("Error", "Failed to delete video", "error");
    }
  };

  // ==============================
  // Loading Screen
  // ==============================
  if (loading && videos.length === 0)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-2xl text-white mb-6 shadow-lg flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <FileText className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">All YouTube Videos</h1>
              <p className="opacity-90">Manage all uploaded videos</p>
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE FILTER PANEL */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700"
          >
            <span>Advanced Filters</span>
            <ChevronDown
              className={`transition-transform ${
                showFilter ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilter && (
            <div className="p-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Page Selector */}
              <div>
                <label className="font-semibold text-gray-600">Page</label>
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  className="w-full mt-1 border p-2 rounded-xl"
                />
              </div>

              {/* Limit Selector */}
              <div>
                <label className="font-semibold text-gray-600">Limit</label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full mt-1 border p-2 rounded-xl"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="font-semibold text-gray-600">Search</label>
                <input
                  type="text"
                  className="w-full mt-1 border p-2 rounded-xl"
                  placeholder="Search videos..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="mt-2 w-full bg-teal-600 text-white p-2 rounded-xl"
                >
                  Apply
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-xl mb-6 flex gap-2 items-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full hidden lg:table">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Title</th>
                <th className="p-4">Play</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {videos.map((v: any) => (
                <tr key={v.video_number} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={v.thumbnail_url}
                      className="w-24 h-16 rounded-lg object-cover"
                    />
                  </td>

                  <td className="p-4">
                    <p className="font-semibold">{v.title}</p>
                    <p
                      className="text-gray-600 text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: v.description }}
                    ></p>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => window.open(v.video_url, "_blank")}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
                    >
                      <Play className="w-4 h-4 inline" /> Play
                    </button>
                  </td>

                  <td className="p-4">
                    <select
                      value={v.is_published ? "true" : "false"}
                      onChange={(e) =>
                        updatePublishStatus(v.video_number, e.target.value)
                      }
                      className="border p-2 rounded-lg bg-white"
                    >
                      <option value="true">Published</option>
                      <option value="false">Unpublished</option>
                    </select>
                  </td>

                  <td className="p-4 text-center flex justify-center gap-3">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/youtube/update?video=${v.video_number}`
                        )
                      }
                      className="p-2 bg-green-100 text-green-600 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => deleteVideo(v.video_number, v.title)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 bg-gray-50">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft />
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white border rounded-lg disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
