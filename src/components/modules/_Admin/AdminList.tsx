// "use client";

// import { useEffect, useState } from "react";

// export default function AdminList() {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     limit: 10,
//     page: 1,
//   });

//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         limit: String(filters.limit),
//         page: String(filters.page),
//       });

//       const res = await fetch(
//         `https://mcq-analysis.vercel.app/api/v1/admin?${query.toString()}`,
//         { cache: "no-store" }
//       );

//       const json = await res.json();
//       console.log(json)
//       setAdmins(json?.data?.data || []);
//     } catch (err) {
//       console.error("Admin fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, [filters.page, filters.limit]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Admin List</h1>

//       {/* Search Bar */}
//       <div className="mb-5 flex items-center gap-3">
//         <input
//           type="text"
//           placeholder="Search admin..."
//           className="border border-gray-300 rounded-md px-3 py-2 w-64"
//           value={filters.search_query}
//           onChange={(e) =>
//             setFilters({ ...filters, search_query: e.target.value })
//           }
//         />

//         <button
//           onClick={fetchAdmins}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Search
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Image</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Phone</th>
//               <th className="p-3 text-left">Role</th>
//               <th className="p-3 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : admins.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-6">
//                   No admins found
//                 </td>
//               </tr>
//             ) : (
//               admins.map((a: any) => (
//                 <tr
//                   key={a._id}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="p-3">
//                     <img
//                       src={
//                         a.image ||
//                         "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                       }
//                       className="w-12 h-12 rounded-md object-cover"
//                     />
//                   </td>
//                   <td className="p-3 font-medium">{a.name}</td>
//                   <td className="p-3">{a.phone_number}</td>
//                   <td className="p-3 capitalize">{a.role}</td>
//                   <td
//                     className={`p-3 font-semibold ${
//                       a.status === "active"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {a.status}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useEffect, useState } from "react";

// export default function AdminList() {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     search_query: "",
//     limit: 10,
//     page: 1,
//   });

//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         search_query: filters.search_query,
//         limit: String(filters.limit),
//         page: String(filters.page),
//       }).toString();

   

//       const res = await fetch(
//   `/api/proxy/admin?${query}`,
//   { method: "GET" }
// );


//       const json = await res.json();
//       console.log("API Response:", json);

//       if (!json.success) {
//         console.error(json);
//         return;
//       }

//       setAdmins(json.data.data);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, [filters.page]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Admin List</h1>
//       <div className="mb-5 flex items-center gap-3">
//         <input
//           type="text"
//           placeholder="Search admin..."
//           className="border border-gray-300 rounded-md px-3 py-2 w-64"
//           value={filters.search_query}
//           onChange={(e) =>
//             setFilters({ ...filters, search_query: e.target.value })
//           }
//         />
//         <button
//           onClick={fetchAdmins}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Search
//         </button>
//       </div>

//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">Image</th>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Phone</th>
//             <th className="p-3 text-left">Role</th>
//             <th className="p-3 text-left">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((a) => (
//             <tr key={a._id} className="border-t">
//               <td className="p-3">
//                 <img
//                   src={
//                     a.image ||
//                     "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                   }
//                   className="w-12 h-12 rounded-md object-cover"
//                 />
//               </td>
//               <td className="p-3">{a.name}</td>
//               <td className="p-3">{a.phone_number}</td>
//               <td className="p-3">{a.role}</td>
//               <td className="p-3">{a.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }













"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Search, Filter, Loader2, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function AdminList() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search_query: "",
    limit: 10,
    strat: 1,
    role: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        search_query: filters.search_query,
        limit: String(filters.limit),
        strat: String(filters.strat),
        ...(filters.role && { role: filters.role }),
      }).toString();

      const res = await fetch(`/api/proxy/admin?${query}`, {
        method: "GET",
      });

      const json = await res.json();
      console.log("API Response:", json);

      if (!json.success) {
        console.error(json);
        return;
      }

      setAdmins(json.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [filters.strat]);

  const handleCreateAdmin = () => {
    // Navigate to create admin page
    window.location.href = "/admin/create";
  };

  // const handleManagePermission = (adminId: string) => {
  //   console.log("Manage permission for:", adminId);
  //   // Add navigation logic
  // };

  const handleManagePermission = (adminId: string) => {
  // Permission page e navigate kora
  window.location.href = `/dashboard/team/permission?id=${adminId}`;
};

  const handleUpdate = (adminId: string) => {
    console.log("Update admin:", adminId);
    // Add navigation logic
  };

  const handleDelete = (adminId: string) => {
    console.log("Delete admin:", adminId);
    // Add delete logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Admin Management
        </h1>
        <p className="text-gray-600">
          Manage your admin users and their permissions
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                value={filters.search_query}
                onChange={(e) =>
                  setFilters({ ...filters, search_query: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && fetchAdmins()}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Search Button */}
            <button
              onClick={fetchAdmins}
              disabled={loading}
              className="px-6 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Create Admin Button */}
          <Link href={"/dashboard/team/create-admin"}>
          <button
     
            className="px-6 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Admin
          </button>
          </Link>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start From
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                value={filters.strat}
                onChange={(e) =>
                  setFilters({ ...filters, strat: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limit
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                value={filters.limit}
                onChange={(e) =>
                  setFilters({ ...filters, limit: Number(e.target.value) })
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-800 animate-spin mb-4" />
            <p className="text-gray-600">Loading admins...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No admins found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              admin.image ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={admin.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                          <span className="font-medium text-gray-900">
                            {admin.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {admin.phone_number}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === admin._id ? null : admin._id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {activeDropdown === admin._id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveDropdown(null)}
                              ></div>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => {
                                    handleManagePermission(admin._id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Manage Permission
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdate(admin._id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(admin._id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {admins.map((admin) => (
                <div key={admin._id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          admin.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={admin.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {admin.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {admin.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === admin._id ? null : admin._id
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {activeDropdown === admin._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => {
                                handleManagePermission(admin._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Manage Permission
                            </button>
                            <button
                              onClick={() => {
                                handleUpdate(admin._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(admin._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {admin.role}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Info */}
      {!loading && admins.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {admins.length} results
        </div>
      )}
    </div>
  );
}