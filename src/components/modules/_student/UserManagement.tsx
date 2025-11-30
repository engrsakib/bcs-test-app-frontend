
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   MoreVertical,
//   Eye,
//   Edit,
//   Trash2,
//   X,
//   User,
//   Phone,
//   Mail,
//   Calendar,
//   Shield,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import Link from "next/link";


//   const cloudinary_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
//   const cloudinary_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;


// // 🔥 Cloudinary Upload Function
// async function uploadToCloudinary(file) {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", cloudinary_preset );

//   const res = await fetch(
//      `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const data = await res.json();
//   return data.secure_url;
// }

// const UserManagementTable = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
// const [meta, setMeta] = useState({
//   page: 1,
//   limit: 10,
//   total: 0,
// });

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);

//   const [updateFormData, setUpdateFormData] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     image: "",
//   });

//   const API_URL = "https://mcq-analysis.vercel.app/api/v1";

//   // 🍪 Read Cookies
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   };
//   const accessToken = getCookie("access_token");

//   // // 🟢 Fetch Users
//   // const fetchUsers = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await fetch(`${API_URL}/user/`, {
//   //       headers: { Authorization: accessToken },
//   //     });
//   //     const result = await res.json();

//   //     if (result.success) setUsers(result.data.data);
//   //   } catch (err) {
//   //     console.error("Fetch error:", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchUsers = async (page = 1, limit = 10) => {
//   try {
//     setLoading(true);

//     const res = await fetch(`${API_URL}/user/?page=${page}&limit=${limit}`, {
//       headers: { Authorization: accessToken },
//     });

//     const result = await res.json();

//     if (result.success) {
//       setUsers(result.data.data);
//       setMeta(result.data.meta); // <-- save meta
//     }

//   } catch (err) {
//     console.error("Fetch error:", err);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🟢 View User
//   const handleViewUser = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/user/${id}`, {
//         headers: { Authorization: accessToken },
//       });

//       const result = await res.json();
//       if (result.success) {
//         setSelectedUser(result.data);
//         setShowViewModal(true);
//       }
//     } catch (error) {
//       console.error("View error:", error);
//     }
//   };

//   // 🟢 Open Update Modal
//   const handleUpdateUser = (id) => {
//     const u = users.find((x) => x._id === id);

//     setSelectedUser(u);
//     setUpdateFormData({
//       name: u.name,
//       phone_number: u.phone_number,
//       email: u.email || "",
//       image: u.image || "",
//     });

//     setShowUpdateModal(true);
//   };

//   // 🟢 Update Submit
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();

//     const bodyToSend = {
//       name: updateFormData.name,
//       phone_number: updateFormData.phone_number,
//       email: updateFormData.email,
//       image: updateFormData.image,
//     };

//     try {
//       const res = await fetch(`${API_URL}/user/${selectedUser._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: accessToken,
//         },
//         body: JSON.stringify(bodyToSend),
//       });

//       const result = await res.json();

//       if (result.success) {
//         Swal.fire({
//           title: "Updated!",
//           text: "User updated successfully",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         setUsers(
//           users.map((u) =>
//             u._id === selectedUser._id ? { ...u, ...bodyToSend } : u
//           )
//         );

//         setShowUpdateModal(false);
//       }
//     } catch (error) {
//       Swal.fire("Error", "Failed to update user", "error");
//     }
//   };

//   // 🟢 Delete User
//   const handleDeleteUser = async () => {
//     try {
//       const res = await fetch(`${API_URL}/user/${selectedUser._id}`, {
//         method: "DELETE",
//         headers: { Authorization: accessToken },
//       });

//       if (res.ok) {
//         Swal.fire({
//           title: "Deleted!",
//           text: "User removed",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         setUsers(users.filter((u) => u._id !== selectedUser._id));
//         setShowDeleteModal(false);
//       }
//     } catch (error) {
//       Swal.fire("Error", "Unable to delete", "error");
//     }
//   };

//   const formatDate = (d) =>
//     new Date(d).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">

//         <div className="flex items-center justify-between mb-6">
//   <div>
//     <h1 className="text-3xl font-bold">User Management</h1>
//     <p className="text-gray-600">Manage and monitor all users</p>
//   </div>

//   <Link
//     href="/dashboard/team/create-student"
//     className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow-md transition"
//   >
//     Create Student
//   </Link>
// </div>


   

//         {/* Loading */}
//         {loading && (
//           <div className="flex items-center justify-center h-32">
//             <div className="h-10 w-10 animate-spin border-4 border-green-700 border-t-transparent rounded-full"></div>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && (
//           <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-gray-600">User</th>
//                   <th className="px-6 py-3 text-left text-gray-600">Phone</th>
//                   <th className="px-6 py-3 text-left text-gray-600">Email</th>
//                   <th className="px-6 py-3 text-left text-gray-600">Role</th>
//                   <th className="px-6 py-3 text-left text-gray-600">Created</th>
//                   <th className="px-6 py-3 text-right text-gray-600">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4 flex items-center gap-3">
//                       <img
//                         src={u.image || "/avatar.png"}
//                         className="h-10 w-10 rounded-full border"
//                       />
//                       <div>
//                         <p className="font-semibold">{u.name}</p>
//                         <p className="text-xs text-gray-500">{u._id}</p>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">{u.phone_number}</td>
//                     <td className="px-6 py-4">{u.email || "N/A"}</td>

//                     <td className="px-6 py-4 capitalize">{u.role}</td>
//                     <td className="px-6 py-4">{formatDate(u.createdAt)}</td>

//                     <td className="px-6 py-4 text-right">
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(openDropdown === u._id ? null : u._id)
//                         }
//                       >
//                         <MoreVertical />
//                       </button>

//                       {openDropdown === u._id && (
//                         <div className="absolute right-10 mt-2 bg-white shadow-xl rounded-md border z-20">
//                           <button
//                             onClick={() => handleViewUser(u._id)}
//                             className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
//                           >
//                             <Eye size={16} /> View
//                           </button>

//                           <button
//                             onClick={() => handleUpdateUser(u._id)}
//                             className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
//                           >
//                             <Edit size={16} /> Update
//                           </button>

//                           <button
//                             onClick={() => {
//                               setSelectedUser(u);
//                               setShowDeleteModal(true);
//                             }}
//                             className="w-full px-4 py-2 flex items-center text-red-600 hover:bg-red-50 gap-2"
//                           >
//                             <Trash2 size={16} /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

          
//         )}

//         {/* Pagination */}
// <div className="flex items-center justify-between mt-4">

//   <button
//     disabled={meta.page === 1}
//     onClick={() => fetchUsers(meta.page - 1)}
//     className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//   >
//     Previous
//   </button>

//   <p className="text-gray-700 font-medium">
//     Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
//   </p>

//   <button
//     disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
//     onClick={() => fetchUsers(meta.page + 1)}
//     className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//   >
//     Next
//   </button>

// </div>






//       {/* ------------ UPDATE MODAL -------------- */}
// {showUpdateModal && (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

//     <div className="bg-white/80 backdrop-blur-xl border border-green-800 shadow-2xl rounded-2xl p-8 w-full max-w-xl animate-scaleIn">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-green-800">
//           Update User
//         </h2>

//         <X
//           className="cursor-pointer text-green-700 hover:text-red-600 transition"
//           onClick={() => setShowUpdateModal(false)}
//         />
//       </div>

//       {/* Form */}
//       <form onSubmit={handleUpdateSubmit} className="space-y-5">

//         {/* Name */}
//         <div>
//           <label className="font-semibold text-gray-700">Name</label>
//           <input
//             type="text"
//             value={updateFormData.name}
//             onChange={(e) =>
//               setUpdateFormData({ ...updateFormData, name: e.target.value })
//             }
//             className="w-full border px-4 py-2 bg-white/60 rounded-lg focus:ring-2 focus:ring-green-800 outline-none"
//             required
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="font-semibold text-gray-700">Phone Number</label>
//           <input
//             type="text"
//             value={updateFormData.phone_number}
//             onChange={(e) =>
//               setUpdateFormData({
//                 ...updateFormData,
//                 phone_number: e.target.value,
//               })
//             }
//             className="w-full border px-4 py-2 bg-white/60 rounded-lg focus:ring-2 focus:ring-green-800 outline-none"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="font-semibold text-gray-700">Email</label>
//           <input
//             type="email"
//             value={updateFormData.email}
//             onChange={(e) =>
//               setUpdateFormData({ ...updateFormData, email: e.target.value })
//             }
//             className="w-full border px-4 py-2 bg-white/60 rounded-lg focus:ring-2 focus:ring-green-800 outline-none"
//           />
//         </div>

//         {/* Image Uploader */}
//         <div>
//           <label className="font-semibold text-gray-700">Profile Image</label>

//           <div className="border-2 border-dashed border-green-700 bg-white/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition">

//             <input
//               type="file"
//               className="hidden"
//               id="fileUploader"
//               onChange={async (e) => {
//                 const f = e.target.files[0];
//                 if (!f) return;

//                 const url = await uploadToCloudinary(f);
//                 setUpdateFormData({ ...updateFormData, image: url });

//                 Swal.fire({
//                   title: "Image Uploaded",
//                   icon: "success",
//                   timer: 1200,
//                   showConfirmButton: false,
//                 });
//               }}
//             />

//             <label htmlFor="fileUploader" className="flex flex-col items-center cursor-pointer">
//               <div className="h-20 w-20 bg-gray-200 rounded-full overflow-hidden border">
//                 <img
//                   src={updateFormData.image || "/avatar.png"}
//                   className="h-full w-full object-cover"
//                 />
//               </div>

//               <p className="mt-2 text-green-700 font-medium">Click to upload</p>
//               <p className="text-xs text-gray-500">PNG, JPG allowed</p>
//             </label>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-2">
//           <button
//             type="button"
//             onClick={() => setShowUpdateModal(false)}
//             className="flex-1 py-2 border bg-white/70 rounded-lg hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="flex-1 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition"
//           >
//             Update
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// )}








//         {/* ------------ DELETE CONFIRMATION MODAL -------------- */}
//         {showDeleteModal && (
//           <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
//             <div className="bg-white border-2 border-red-700 p-6 rounded-xl max-w-sm w-full shadow-xl">

//               <h2 className="text-xl font-bold mb-4 text-red-700">
//                 Delete User
//               </h2>

//               <p className="text-gray-700 mb-5">
//                 Are you sure you want to delete{" "}
//                 <span className="font-bold">{selectedUser?.name}</span>?
//               </p>

//               <div className="flex gap-3">
//                 <button
//                   className="flex-1 py-2 border rounded-lg"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="flex-1 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
//                   onClick={handleDeleteUser}
//                 >
//                   Delete
//                 </button>
//               </div>

//             </div>
//           </div>
//         )}
       
       
//         {/* ------------ VIEW MODAL -------------- */}
//         {showViewModal && selectedUser && (
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//             <div className="bg-white/95 border border-green-700 shadow-xl rounded-xl p-6 max-w-lg w-full">

//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-green-800">
//                   User Details
//                 </h2>
//                 <X
//                   className="cursor-pointer text-green-800 hover:text-red-600"
//                   onClick={() => setShowViewModal(false)}
//                 />
//               </div>

//               <div className="flex items-center gap-4 mb-4">
//                 <img
//                   src={selectedUser.image}
//                   className="h-20 w-20 rounded-full border"
//                 />
//                 <div>
//                   <p className="text-xl font-semibold">{selectedUser.name}</p>
//                   <p className="text-gray-500">{selectedUser.email}</p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <p>
//                   <strong>Phone:</strong> {selectedUser.phone_number}
//                 </p>
//                 <p>
//                   <strong>Role:</strong> {selectedUser.role}
//                 </p>
//                 <p>
//                   <strong>Created:</strong> {formatDate(selectedUser.createdAt)}
//                 </p>
//                 <p>
//                   <strong>Updated:</strong> {formatDate(selectedUser.updatedAt)}
//                 </p>
//               </div>

//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default UserManagementTable;































"use client";

import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

// ---------------------- TYPES ----------------------

interface UserType {
  _id: string;
  name: string;
  phone_number: string;
  email?: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface MetaType {
  page: number;
  limit: number;
  total: number;
}

interface UpdateFormType {
  name: string;
  phone_number: string;
  email: string;
  image: string;
}

// -------------------- ENV --------------------------

const cloudinary_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const cloudinary_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// ----------------- CLOUDINARY UPLOAD ----------------

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinary_preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
}

// -------------------- COMPONENT ---------------------

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [meta, setMeta] = useState<MetaType>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const [updateFormData, setUpdateFormData] = useState<UpdateFormType>({
    name: "",
    phone_number: "",
    email: "",
    image: "",
  });

  const API_URL = "https://mcq-analysis.vercel.app/api/v1";

  // ---------------- COOKIE SAFE GETTER -----------------

  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null; // prevent server crash

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  // Load token safely
  useEffect(() => {
    const token = getCookie("access_token");
    setAccessToken(token);
  }, []);

  // --------------- FETCH USERS ---------------------

  const fetchUsers = async (page = 1, limit = 10) => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/user/?page=${page}&limit=${limit}`, {
        headers: { Authorization: accessToken },
      });

      const result = await res.json();

      if (result.success) {
        setUsers(result.data.data as UserType[]);
        setMeta(result.data.meta as MetaType);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchUsers(1);
  }, [accessToken]);

  // --------------- VIEW USER ---------------------

  const handleViewUser = async (id: string) => {
    if (!accessToken) return;

    const res = await fetch(`${API_URL}/user/${id}`, {
      headers: { Authorization: accessToken },
    });

    const result = await res.json();

    if (result.success) {
      setSelectedUser(result.data as UserType);
      setShowViewModal(true);
    }
  };

  // --------------- UPDATE USER ---------------------

  const handleUpdateUser = (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;

    setSelectedUser(user);
    setUpdateFormData({
      name: user.name,
      phone_number: user.phone_number,
      email: user.email || "",
      image: user.image || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !accessToken) return;

    try {
      const res = await fetch(`${API_URL}/user/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify(updateFormData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Updated!", "User updated successfully", "success");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, ...updateFormData } : u
          )
        );

        setShowUpdateModal(false);
      }
    } catch {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  // ---------------- DELETE USER --------------------

  const handleDeleteUser = async () => {
    if (!selectedUser || !accessToken) return;

    try {
      const res = await fetch(`${API_URL}/user/${selectedUser._id}`, {
        method: "DELETE",
        headers: { Authorization: accessToken },
      });

      if (res.ok) {
        Swal.fire("Deleted!", "User removed", "success");

        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));

        setShowDeleteModal(false);
      }
    } catch {
      Swal.fire("Error", "Unable to delete", "error");
    }
  };

  // -------------- FORMAT DATE ----------------------

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ---------------- UI STARTS -----------------------

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600">Manage and monitor all users</p>
          </div>

          <Link
            href="/dashboard/team/create-student"
            className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow-md transition"
          >
            Create Student
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="h-10 w-10 animate-spin border-4 border-green-700 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={u.image || "/avatar.png"}
                        className="h-10 w-10 rounded-full border"
                      />
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-xs text-gray-500">{u._id}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{u.phone_number}</td>
                    <td className="px-6 py-4">{u.email || "N/A"}</td>
                    <td className="px-6 py-4 capitalize">{u.role}</td>
                    <td className="px-6 py-4">{formatDate(u.createdAt)}</td>

                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === u._id ? null : u._id)
                        }
                      >
                        <MoreVertical />
                      </button>

                      {openDropdown === u._id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-md border z-20">
                          <button
                            onClick={() => handleViewUser(u._id)}
                            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
                          >
                            <Eye size={16} /> View
                          </button>

                          <button
                            onClick={() => handleUpdateUser(u._id)}
                            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
                          >
                            <Edit size={16} /> Update
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setShowDeleteModal(true);
                            }}
                            className="w-full px-4 py-2 flex items-center text-red-600 hover:bg-red-50 gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && (
          <div className="flex items-center justify-between mt-4">
            <button
              disabled={meta.page === 1}
              onClick={() => fetchUsers(meta.page - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-gray-700 font-medium">
              Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
            </p>

            <button
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
              onClick={() => fetchUsers(meta.page + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* ---------------- UPDATE MODAL ---------------- */}
        {showUpdateModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/80 border shadow-xl rounded-xl p-8 w-full max-w-xl">
              
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Update User</h2>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowUpdateModal(false)}
                />
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    value={updateFormData.name}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>

                <div>
                  <label>Phone</label>
                  <input
                    type="text"
                    value={updateFormData.phone_number}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        phone_number: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    value={updateFormData.email}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>

                <div>
                  <label>Image</label>
                  <input
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const url = await uploadToCloudinary(file);
                      setUpdateFormData({ ...updateFormData, image: url });
                    }}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2 bg-green-700 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white border shadow-xl rounded-xl p-6 max-w-sm w-full">
              <h2 className="font-bold text-lg mb-4">Delete User</h2>
              <p className="mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedUser.name}</strong>?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteUser}
                  className="flex-1 py-2 bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODAL */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white border shadow-xl rounded-xl p-6 max-w-lg w-full">

              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">User Details</h2>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowViewModal(false)}
                />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedUser.image}
                  className="h-20 w-20 rounded-full border"
                />
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <p><strong>Phone:</strong> {selectedUser.phone_number}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
              <p><strong>Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementTable;


















