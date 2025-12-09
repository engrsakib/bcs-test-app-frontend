



















// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Eye,
//   Trash2,
//   Edit,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { ENV } from "@/config/env";
// import getCookie from "@/util/GetCookie";
// import { useRouter } from "next/navigation";

// // -----------------------
// // DATE FORMAT HELPERS
// // -----------------------
// // const formatDate = (dateString:Date) => {
// //   const d = new Date(dateString);
// //   return d.toLocaleDateString("en-GB", {
// //     day: "2-digit",
// //     month: "short",
// //     year: "numeric",
// //   });
// // };

// const formatTime = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// export default function ViewAllGuideline() {
//   const router = useRouter();

//   const [guidelines, setGuidelines] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [status, setStatus] = useState("");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);

//   const limit = 10;

//   // -----------------------
//   // FETCH ALL GUIDELINES
//   // -----------------------
//   const fetchGuidelines = async () => {
//     setLoading(true);

//     const url = `${ENV.BASE_URL}/guideline?page=${page}&limit=${limit}&searchTerm=${searchTerm}&category=${category}&status=${status}`;

//     try {
//       const res = await fetch(url, {
//         headers: {
//           Authorization: getCookie("access_token") || "",
//         },
//       });

//       const data = await res.json();

//       console.log("View All Guideline", data);

//       if (res.ok) {
//         setGuidelines(data.data.data);
//         setTotalPage(data.data.meta.totalPage);
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchGuidelines();
//   }, [page]);

//   // -----------------------
//   // HANDLE SEARCH ENTER
//   // -----------------------
//   const handleSearch = (e: any) => {
//     if (e.key === "Enter") {
//       setPage(1);
//       fetchGuidelines();
//     }
//   };

//   // -----------------------
//   // DELETE GUIDELINE
//   // -----------------------
//   const deleteGuideline = async (guidelineNumber: number) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this guideline?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await fetch(
//             `${ENV.BASE_URL}/guideline/${guidelineNumber}`,
//             {
//               method: "DELETE",
//               headers: {
//                 Authorization: getCookie("access_token") || "",
//               },
//             }
//           );

//           const data = await res.json();

//           if (res.ok) {
//             Swal.fire("Deleted!", data.message, "success");
//             fetchGuidelines();
//           } else {
//             Swal.fire("Error", data.message, "error");
//           }
//         } catch (err) {
//           Swal.fire("Error", "Something went wrong", "error");
//         }
//       }
//     });
//   };

//   // -----------------------
//   // TOGGLE STATUS
//   // -----------------------
//   const toggleStatus = async (guidelineNumber: number) => {
//     try {
//       const res = await fetch(
//         `${ENV.BASE_URL}/guideline/${guidelineNumber}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: getCookie("access_token") || "",
//           },
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire("Updated!", "Guideline status updated", "success");
//         fetchGuidelines();
//       }
//     } catch (err) {
//       Swal.fire("Error", "Status update failed", "error");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
//         <h1 className="text-3xl font-bold">All Guidelines</h1>
//         <p className="text-teal-100 mt-1">Browse and manage examination guidelines</p>
//       </div>

//       {/* FILTER BAR */}
//       <div className="bg-white shadow-md rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//         {/* SEARCH */}
//         <div className="flex items-center gap-2 border rounded-xl px-3">
//           <Search className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search guidelines..."
//             className="w-full py-3 outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={handleSearch}
//           />
//         </div>

//         {/* CATEGORY FILTER */}
//         <select
//           className="border rounded-xl px-3 py-3"
//           value={category}
//           onChange={(e) => {
//             setCategory(e.target.value);
//             setPage(1);
//             fetchGuidelines();
//           }}
//         >
//           <option value="">All Categories</option>
//           <option value="general">General</option>
//           <option value="technical">Technical</option>
//           <option value="exam">Exam</option>
//           <option value="bcs_preparation">BCS Preparation</option>
//           <option value="primary_teacher_preparation">Primary Teacher</option>
//           <option value="teacher_nibondhon_preparation">Teacher Nibondhon</option>
//         </select>

//         {/* STATUS FILTER */}
//         <select
//           className="border rounded-xl px-3 py-3"
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setPage(1);
//             fetchGuidelines();
//           }}
//         >
//           <option value="">All Status</option>
//           <option value="active">Published</option>
//           <option value="inactive">Unpublished</option>
//         </select>

//         {/* DATE FILTER (NOT IMPLEMENTED IN API) */}
//         <div className="flex items-center gap-2 border rounded-xl px-3">
//           <Calendar />
//           <input type="date" className="w-full py-3 outline-none" disabled />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-teal-600 text-white">
//             <tr>
//               <th className="py-3">ID</th>
//               <th className="py-3 text-left">Title</th>
//               <th className="py-3">Category</th>
//               <th className="py-3">Status</th>
//               <th className="py-3">Date & Time</th>
//               <th className="py-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   Loading...
//                 </td>
//               </tr>
//             ) : guidelines.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   No guidelines found
//                 </td>
//               </tr>
//             ) : (
//               guidelines.map((item, index) => (
//                 <tr
//                   key={item.guideline_number}
//                   className="border-b hover:bg-gray-50"
//                 >
//                   {/* ID */}
//                   <td className="text-center py-4 font-semibold">
//                     #{item.guideline_number}
//                   </td>

//                   {/* TITLE + DESCRIPTION */}
//                   <td className="py-4">
//                     <div className="font-bold">{item.title}</div>
//                     <div className="text-gray-500 text-sm">{item.description}</div>
//                   </td>

//                   {/* CATEGORY */}
//                   <td className="text-center">
//                     <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
//                       {item.category.replace(/_/g, " ").toUpperCase()}
//                     </span>
//                   </td>

//                   {/* STATUS */}
//                   <td className="text-center">
//                     <span
//                       className={`px-3 py-1 text-sm rounded-full ${
//                         item.status === "active"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
//                     </span>
//                   </td>

//                   {/* DATE & TIME */}
//                   <td className="text-center text-sm">
//                     <div>{item.createdAt}</div>
//                     <div>{item.createdAt}</div>
//                   </td>

//                   {/* ACTIONS */}
//                   <td className="text-center">
//                     <div className="flex justify-center gap-3">

//                       {/* VIEW */}
//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/dashboard/guideline/view-guideline/${item.guideline_number}`
//                           )
//                         }
//                         className="p-2 bg-blue-100 text-blue-600 rounded-lg"
//                       >
//                         <Eye size={18} />
//                       </button>

//                       {/* EDIT */}
//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/dashboard/guideline/edit/${item.guideline_number}`
//                           )
//                         }
//                         className="p-2 bg-green-100 text-green-600 rounded-lg"
//                       >
//                         <Edit size={18} />
//                       </button>

//                       {/* TOGGLE STATUS */}
//                       <button
//                         onClick={() => toggleStatus(item.guideline_number)}
//                         className="p-2 bg-teal-100 text-teal-600 rounded-lg"
//                       >
//                         ✓
//                       </button>

//                       {/* DELETE */}
//                       <button
//                         onClick={() => deleteGuideline(item.guideline_number)}
//                         className="p-2 bg-red-100 text-red-600 rounded-lg"
//                       >
//                         <Trash2 size={18} />
//                       </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center p-4">
//           <p className="text-sm text-gray-600">
//             Showing {guidelines.length} of results
//           </p>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
//             >
//               <ChevronLeft />
//             </button>

//             <span className="px-4 py-2 bg-green-600 text-white rounded-lg">
//               {page}
//             </span>

//             <button
//               disabled={page === totalPage}
//               onClick={() => setPage((p) => p + 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
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
//   Search,
//   Eye,
//   Trash2,
//   Edit,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { ENV } from "@/config/env";
// import getCookie from "@/util/GetCookie";
// import { useRouter } from "next/navigation";

// // DATE FORMAT HELPERS -----------------------
// const formatDate = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// export default function ViewAllGuideline() {
//   const router = useRouter();

//   const [guidelines, setGuidelines] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [status, setStatus] = useState("");
  

//   console.log("SearchTerm", searchTerm);
//   console.log("category", category)
//   console.log("status", status)
//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);

//   const limit = 10;

//   // -----------------------
//   // FETCH ALL GUIDELINES
//   // -----------------------
//   const fetchGuidelines = async () => {
//     setLoading(true);

//     const url = `${ENV.BASE_URL}/guideline?page=${page}&limit=${limit}&searchTerm=${searchTerm}&category=${category}&status=${status}`;

//     try {
//       const res = await fetch(url, {
//         headers: {
//           Authorization: getCookie("access_token") || "",
//         },
//       });

//       const data = await res.json();
//       console.log("FILTER DATA", data);

//       if (res.ok) {
//         setGuidelines(data.data.data);
//         setTotalPage(data.data.meta.totalPage);
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     setLoading(false);
//   };

//   // -------------- FIX #1: RUN FILTERING ON CHANGE --------------
//   useEffect(() => {
//     fetchGuidelines();
//   }, [page, searchTerm, category, status]);

//   const deleteGuideline = async (guidelineNumber: number) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this guideline?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: getCookie("access_token") || "",
//           },
//         });
//         Swal.fire("Deleted!", "", "success");
//         fetchGuidelines();
//       }
//     });
//   };

//   const toggleStatus = async (guidelineNumber: number) => {
//     await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
//       method: "PATCH",
//       headers: {
//         Authorization: getCookie("access_token") || "",
//       },
//     });
//     Swal.fire("Updated!", "Status changed successfully", "success");
//     fetchGuidelines();
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">

//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
//         <h1 className="text-3xl font-bold">All Guidelines</h1>
//         <p className="text-teal-100">Browse and manage guidelines</p>
//       </div>

//       {/* FILTERS */}
//       <div className="bg-white rounded-xl shadow-md p-5 grid md:grid-cols-4 gap-4">

//         {/* SEARCH */}
//         <div className="flex items-center gap-2 border rounded-xl px-3">
//           <Search />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="py-3 outline-none w-full"
//             value={searchTerm}
//             onChange={(e) => {
//               setPage(1);
//               setSearchTerm(e.target.value);
//             }}
//           />
//         </div>

//         {/* CATEGORY */}
//         <select
//           className="border rounded-xl px-3 py-3"
//           value={category}
//           onChange={(e) => {
//             setPage(1);
//             setCategory(e.target.value);
//           }}
//         >
//           <option value="">All Categories</option>
//           <option value="general">General</option>
//           <option value="technical">Technical</option>
//           <option value="exam">Exam</option>
//           <option value="bcs_preparation">BCS Preparation</option>
//         </select>

//         {/* STATUS */}
//         <select
//           className="border rounded-xl px-3 py-3"
//           value={status}
//           onChange={(e) => {
//             setPage(1);
//             setStatus(e.target.value);
//           }}
//         >
//           <option value="">All Status</option>
//           <option value="active">Published</option>
//           <option value="inactive">Unpublished</option>
//         </select>

//         {/* DATE (Disabled) */}
//         <div className="flex items-center gap-2 border rounded-xl px-3">
//           <Calendar />
//           <input type="date" disabled className="py-3 w-full outline-none" />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
//         <table className="w-full">
//           <thead className="bg-teal-600 text-white">
//             <tr>
//               <th className="py-3">ID</th>
//               <th className="py-3 text-left">Title</th>
//               <th className="py-3">Category</th>
//               <th className="py-3">Status</th>
//               <th className="py-3">Date & Time</th>
//               <th className="py-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   Loading...
//                 </td>
//               </tr>
//             ) : guidelines.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   No data found
//                 </td>
//               </tr>
//             ) : (
//               guidelines.map((item) => (
//                 <tr key={item.guideline_number} className="border-b">
//                   <td className="py-4 text-center font-semibold">
//                     #{item.guideline_number}
//                   </td>

//                   <td className="py-4">
//                     <div className="font-bold">{item.title}</div>
//                     <div className="text-gray-500">{item.description}</div>
//                   </td>

//                   <td className="text-center">
//                     <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
//                       {item.category.replace(/_/g, " ").toUpperCase()}
//                     </span>
//                   </td>

//                   <td className="text-center">
//                     <span
//                       className={`px-3 py-1 text-sm rounded-full ${
//                         item.status === "active"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
//                     </span>
//                   </td>

//                   {/* FIXED DATE FORMATTING */}
//                   <td className="text-center text-sm">
//                     <div>{formatDate(item.createdAt)}</div>
//                     <div>{formatTime(item.createdAt)}</div>
//                   </td>

//                   <td className="text-center">
//                     <div className="flex gap-2 justify-center">

//                       <button
//                         className="p-2 bg-blue-100 text-blue-600 rounded-lg"
//                         onClick={() =>
//                           router.push(
//                             `/dashboard/guideline/view-guideline/${item.guideline_number}`
//                           )
//                         }
//                       >
//                         <Eye size={18} />
//                       </button>

//                       <button
//                         className="p-2 bg-green-100 text-green-600 rounded-lg"
//                         onClick={() =>
//                           router.push(
//                             `/dashboard/guideline/edit/${item.guideline_number}`
//                           )
//                         }
//                       >
//                         <Edit size={18} />
//                       </button>

//                       <button
//                         className="p-2 bg-teal-100 text-teal-600 rounded-lg"
//                         onClick={() => toggleStatus(item.guideline_number)}
//                       >
//                         ✓
//                       </button>

//                       <button
//                         className="p-2 bg-red-100 text-red-600 rounded-lg"
//                         onClick={() => deleteGuideline(item.guideline_number)}
//                       >
//                         <Trash2 size={18} />
//                       </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center p-4">
//           <p className="text-gray-500 text-sm">
//             Showing {guidelines.length} results
//           </p>

//           <div className="flex gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
//             >
//               <ChevronLeft />
//             </button>

//             <span className="px-4 py-2 bg-teal-600 text-white rounded-lg">
//               {page}
//             </span>

//             <button
//               disabled={page === totalPage}
//               onClick={() => setPage((p) => p + 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
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
  Search,
  Eye,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Swal from "sweetalert2";
import { ENV } from "@/config/env";
import getCookie from "@/util/GetCookie";
import { useRouter } from "next/navigation";

export default function ViewAllGuideline() {
  const router = useRouter();

  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // NEW
  const [totalPage, setTotalPage] = useState(1);

  // Collapse filter section
  const [showFilters, setShowFilters] = useState(false);

  // FETCH FUNCTION
  const fetchGuidelines = async () => {
    setLoading(true);

    const url = `${ENV.BASE_URL}/guideline?page=${page}&limit=${limit}&searchTerm=${searchTerm}`;

    console.log("API CALL URL:", url);

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: getCookie("access_token") || "",
        },
      });

      const data = await res.json();
      console.log("SEARCH FILTER RESULT:", data);

      if (res.ok) {
        setGuidelines(data.data.data);
        setTotalPage(data.data.meta.totalPage);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Auto fetch on page change
  useEffect(() => {
    fetchGuidelines();
  }, [page, limit]);

  // Search button click
  const handleSearchClick = () => {
    setPage(1);
    fetchGuidelines();
  };

  // Press enter to search
  const handleSearchEnter = (e: any) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchGuidelines();
    }
  };

  // DELETE GUIDELINE
  const deleteGuideline = async (guidelineNumber: number) => {
    Swal.fire({
      title: "Delete?",
      text: "Do you want to delete this guideline?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
          method: "DELETE",
          headers: { Authorization: getCookie("access_token") || "" },
        });

        Swal.fire("Deleted!", "", "success");
        fetchGuidelines();
      }
    });
  };

  // UPDATE STATUS
  const toggleStatus = async (guidelineNumber: number) => {
    await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
      method: "PATCH",
      headers: { Authorization: getCookie("access_token") || "" },
    });

    Swal.fire("Updated!", "Status updated", "success");
    fetchGuidelines();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">All Guidelines</h1>
        <p className="text-teal-100">Browse and manage guidelines</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* SEARCH INPUT */}
          <div className="flex items-center gap-2 border rounded-xl px-3">
            <Search />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="py-3 outline-none w-full"
            />
          </div>

          {/* SEARCH BUTTON */}
          <button
            onClick={handleSearchClick}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-3 font-semibold"
          >
            Search
          </button>

          {/* FILTER COLLAPSE BUTTON */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-teal-700 font-semibold"
          >
            <Filter size={18} />
           Pagination
            {showFilters ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* COLLAPSIBLE FILTER SECTION */}
        {showFilters && (
          <div className="border rounded-xl p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* PAGE Selector */}
            <div>
              <label className="font-semibold">Page</label>
              <input
                type="number"
                min={1}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            {/* LIMIT Selector */}
            <div>
              <label className="font-semibold">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full border rounded-xl p-3 mt-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* APPLY BUTTON */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPage(1);
                  fetchGuidelines();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-3 font-semibold"
              >
                Apply Filters
              </button>
            </div>

          </div>
        )}

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <table className="w-full">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="py-3">ID</th>
              <th className="py-3 text-left">Title</th>
              <th className="py-3">Category</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="text-center py-6 text-gray-500" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : guidelines.length === 0 ? (
              <tr>
                <td className="text-center py-6 text-gray-500" colSpan={6}>
                  No guidelines found
                </td>
              </tr>
            ) : (
              guidelines.map((item) => (
                <tr key={item.guideline_number} className="border-b">
                  <td className="text-center py-4 font-semibold">
                    #{item.guideline_number}
                  </td>

                  <td className="py-4">
                    <div className="font-bold">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.description}</div>
                  </td>

                  <td className="text-center">
                    <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
                      {item.category.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          router.push(`/dashboard/guideline/view-guideline/${item.guideline_number}`)
                        }
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/guideline/edit/${item.guideline_number}`)
                        }
                        className="p-2 bg-green-100 text-green-600 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => toggleStatus(item.guideline_number)}
                        className="p-2 bg-teal-100 text-teal-600 rounded-lg"
                      >
                        ✓
                      </button>

                      <button
                        onClick={() => deleteGuideline(item.guideline_number)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <span className="text-gray-600 text-sm">
            Showing {guidelines.length} results
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="px-4 py-2 bg-teal-600 text-white rounded-lg">
              {page}
            </span>

            <button
              disabled={page === totalPage}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}








// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Eye,
//   Trash2,
//   Edit,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { ENV } from "@/config/env";
// import getCookie from "@/util/GetCookie";
// import { useRouter } from "next/navigation";

// // DATE FORMAT HELPERS
// const formatDate = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// export default function ViewAllGuideline() {
//   const router = useRouter();

//   const [guidelines, setGuidelines] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Search Filter
//   const [searchTerm, setSearchTerm] = useState("");

//   console.log("SearchTerm", searchTerm)

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);

//   const limit = 10;

//   // FETCH FUNCTION (Only searchTerm is used)
//   const fetchGuidelines = async () => {
//     setLoading(true);

//     const url = `${ENV.BASE_URL}/guideline?page=${page}&limit=${limit}&searchTerm=${searchTerm}`;

//     console.log("API CALL URL:", url);

//     try {
//       const res = await fetch(url, {
//         headers: {
//           Authorization: getCookie("access_token") || "",
//         },
//       });

//       const data = await res.json();
//       console.log("SEARCH FILTER RESULT:", data);

//       if (res.ok) {
//         setGuidelines(data.data.data);
//         setTotalPage(data.data.meta.totalPage);
//       }
//     } catch (err) {
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   // Auto fetch on page change
//   useEffect(() => {
//     fetchGuidelines();
//   }, [page]);

//   // Search button click
//   const handleSearchClick = () => {
//     setPage(1);
//     fetchGuidelines();
//   };

//   // Press enter to search
//   const handleSearchEnter = (e: any) => {
//     if (e.key === "Enter") {
//       setPage(1);
//       fetchGuidelines();
//     }
//   };

//   // DELETE GUIDELINE
//   const deleteGuideline = (guidelineNumber: number) => {
//     Swal.fire({
//       title: "Delete?",
//       text: "Do you want to delete this guideline?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
//           method: "DELETE",
//           headers: { Authorization: getCookie("access_token") || "" },
//         });

//         Swal.fire("Deleted!", "", "success");
//         fetchGuidelines();
//       }
//     });
//   };

//   // TOGGLE STATUS
//   const toggleStatus = async (guidelineNumber: number) => {
//     await fetch(`${ENV.BASE_URL}/guideline/${guidelineNumber}`, {
//       method: "PATCH",
//       headers: { Authorization: getCookie("access_token") || "" },
//     });

//     Swal.fire("Updated!", "Status updated", "success");
//     fetchGuidelines();
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
//         <h1 className="text-3xl font-bold">All Guidelines</h1>
//         <p className="text-teal-100">Browse and manage guidelines</p>
//       </div>

//       {/* SEARCH BAR */}
//       <div className="bg-white rounded-xl shadow-md p-5 grid grid-cols-1 md:grid-cols-4 gap-4">

//         {/* SEARCH INPUT */}
//         <div className="flex items-center gap-2 border rounded-xl px-3">
//           <Search />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={handleSearchEnter}
//             className="py-3 outline-none w-full"
//           />
//         </div>

//         {/* SEARCH BUTTON */}
//         <button
//           onClick={handleSearchClick}
//           className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-3 font-semibold"
//         >
//           Search
//         </button>

     

//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
//         <table className="w-full">
//           <thead className="bg-teal-600 text-white">
//             <tr>
//               <th className="py-3">ID</th>
//               <th className="py-3 text-left">Title</th>
//               <th className="py-3">Category</th>
//               <th className="py-3">Status</th>
          
//               <th className="py-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td className="text-center py-6 text-gray-500" colSpan={6}>
//                   Loading...
//                 </td>
//               </tr>
//             ) : guidelines.length === 0 ? (
//               <tr>
//                 <td className="text-center py-6 text-gray-500" colSpan={6}>
//                   No guidelines found
//                 </td>
//               </tr>
//             ) : (
//               guidelines.map((item) => (
//                 <tr key={item.guideline_number} className="border-b">
//                   <td className="text-center py-4 font-semibold">
//                     #{item.guideline_number}
//                   </td>

//                   {/* TITLE */}
//                   <td className="py-4">
//                     <div className="font-bold">{item.title}</div>
//                     <div className="text-gray-500 text-sm">{item.description}</div>
//                   </td>

//                   {/* CATEGORY */}
//                   <td className="text-center">
//                     <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
//                       {item.category.replace(/_/g, " ").toUpperCase()}
//                     </span>
//                   </td>

//                   {/* STATUS */}
//                   <td className="text-center">
//                     <span
//                       className={`px-3 py-1 text-sm rounded-full ${
//                         item.status === "active"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
//                     </span>
//                   </td>

            
//                   {/* ACTIONS */}
//                   <td className="text-center">
//                     <div className="flex justify-center gap-2">

//                       <button
//                         onClick={() =>
//                           router.push(`/dashboard/guideline/view-guideline/${item.guideline_number}`)
//                         }
//                         className="p-2 bg-blue-100 text-blue-600 rounded-lg"
//                       >
//                         <Eye size={18} />
//                       </button>

//                       <button
//                         onClick={() =>
//                           router.push(`/dashboard/guideline/edit/${item.guideline_number}`)
//                         }
//                         className="p-2 bg-green-100 text-green-600 rounded-lg"
//                       >
//                         <Edit size={18} />
//                       </button>

//                       <button
//                         onClick={() => toggleStatus(item.guideline_number)}
//                         className="p-2 bg-teal-100 text-teal-600 rounded-lg"
//                       >
//                         ✓
//                       </button>

//                       <button
//                         onClick={() => deleteGuideline(item.guideline_number)}
//                         className="p-2 bg-red-100 text-red-600 rounded-lg"
//                       >
//                         <Trash2 size={18} />
//                       </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center p-4">
//           <div className="text-gray-600 text-sm">
//             Showing {guidelines.length} results
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
//             >
//               <ChevronLeft />
//             </button>

//             <span className="px-4 py-2 bg-teal-600 text-white rounded-lg">
//               {page}
//             </span>

//             <button
//               disabled={page === totalPage}
//               onClick={() => setPage((p) => p + 1)}
//               className="p-2 border rounded-lg disabled:opacity-40"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
