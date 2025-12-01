





"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import Swal from "sweetalert2";
import Link from "next/link";
import { ENV } from "@/config/env";

interface User {
  _id: string;
  name: string;
  phone_number: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}




function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

  return null;
}

export default function UserManagementTable() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ⬇ Filter State (UPDATED: page instead of strat)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: "",
    search_query: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    image: "",
  });

  const accessToken = getCookie("access_token");





  // Cloudinary ENV
const cloudinary_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinary_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Upload function
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinary_preset as string);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
}









  // ========================= FETCH ADMINS (UPDATED PAGINATION) =========================
  const fetchAdmins = async () => {
    try {
      setLoading(true);

      const url = `${ENV.BASE_URL}/user?page=${filters.page}&limit=${filters.limit}&search_query=${filters.search_query}`;

      const res = await fetch(url, {
        headers: {
          Authorization: accessToken || "",
        },
        cache:"force-cache"
      });

      const result = await res.json();
      console.log("Pagination FETCH RESULT:", result);

      if (result.success) {
        setAdmins(result.data.data);
        setMeta(result.data.meta);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // AUTO FETCH WHEN page/limit/role CHANGES
  useEffect(() => {
    fetchAdmins();
  }, [filters.page, filters.limit, filters.role]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ========================= VIEW USER =========================
  const handleView = (u: User) => {
    setSelectedUser(u);
    setShowViewModal(true);
  };

  // ========================= UPDATE USER =========================
  const handleUpdate = (u: User) => {
    setSelectedUser(u);
    setUpdateFormData({
      name: u.name,
      phone_number: u.phone_number,
      email: u.email,
      image: u.image || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedUser) return;

    const res = await fetch(`${ENV.BASE_URL}/user/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken || "",
      },
      body: JSON.stringify(updateFormData),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Updated!", "Student Updated Successfully", "success");

      setAdmins((prev) =>
        prev.map((x) =>
          x._id === selectedUser._id ? { ...x, ...updateFormData } : x
        )
      );

      setShowUpdateModal(false);
    }
  };

  // delete 
  const handleDelete = async () => {
    if (!selectedUser) return;

    const res = await fetch(`${ENV.BASE_URL}/user/${selectedUser._id}`, {
      method: "DELETE",
      headers: { Authorization: accessToken || "" },
    });

    if (res.ok) {
      Swal.fire("Deleted!", "User Delete Successfully", "success");

      setAdmins((prev) => prev.filter((u) => u._id !== selectedUser._id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ===================== PAGE HEADER ===================== */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          👨‍🎓 Student Management Table
          </h1>
          <p className="text-gray-600">
          Easily view, update and manage all student information.

          </p>
        </div>

        {/* ===================== FILTER HEADER ===================== */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">

              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                  value={filters.search_query}
                  onChange={(e) =>
                    setFilters({ ...filters, search_query: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && fetchAdmins()}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border rounded-lg"
              >
                <Filter className="w-5" />
                Filters
                <ChevronDown
                  className={`w-4 transition ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* Search Button */}
              <button
                onClick={() => fetchAdmins()}
                className="px-6 py-2.5 bg-green-800 text-white rounded-lg flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5" />
                )}
                Search
              </button>
            </div>

            <Link href="/dashboard/team/create-admin">
              <button className="px-6 py-2.5 bg-green-800 text-white rounded-lg flex items-center gap-2">
                <Plus className="w-5" /> Create Student
              </button>
            </Link>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label>Page</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={filters.page}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      page: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label>Limit</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: Number(e.target.value) })
                  }
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              {/* <div>
                <label>Role</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div> */}
            </div>
          )}
        </div>

        {/* ===================== TABLE ===================== */}
        <div className="bg-white min-h-screen rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-green-800" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Admin</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Join Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((u) => (
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
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
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
                        <div className="absolute right-10 bg-white border shadow-md rounded-md w-32">
                          <button
                            onClick={() => handleView(u)}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
                          >
                            <Eye size={16} /> View
                          </button>

                          <button
                            onClick={() => handleUpdate(u)}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
                          >
                            <Edit size={16} /> Update
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setShowDeleteModal(true);
                            }}
                            className="w-full px-3 py-2 text-red-600 flex items-center gap-2 hover:bg-red-50"
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
          )}
        </div>

        {/* ===================== PAGINATION (FULL FIXED) ===================== */}
        <div className="flex justify-between items-center mt-4">

          {/* Prev */}
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page info */}
          <p className="font-medium">
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
          </p>

          {/* Next */}
          <button
            disabled={filters.page >= Math.ceil(meta.total / meta.limit)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* ===================== VIEW MODAL ===================== */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">User Details</h2>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowViewModal(false)}
                />
              </div>

              <img
                src={selectedUser.image || "/avatar.png"}
                className="h-20 w-20 mx-auto rounded-full border mb-4"
              />

              <p><b>Name:</b> {selectedUser.name}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Phone:</b> {selectedUser.phone_number}</p>
              <p><b>Role:</b> {selectedUser.role}</p>
              <p><b>Join Date:</b> {formatDate(selectedUser.createdAt)}</p>
            </div>
          </div>
        )}



        {/* ===================== UPDATE MODAL ===================== */}
{showUpdateModal && selectedUser && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
    <form
      onSubmit={handleUpdateSubmit}
      className="bg-white p-6 rounded-xl shadow-xl w-[420px]"
    >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Update User</h2>
        <X
          className="cursor-pointer"
          onClick={() => setShowUpdateModal(false)}
        />
      </div>

      {/* Name */}
      <label className="block font-medium mb-1">Name</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-3"
        value={updateFormData.name}
        onChange={(e) =>
          setUpdateFormData({
            ...updateFormData,
            name: e.target.value,
          })
        }
        required
      />

      {/* Phone */}
      <label className="block font-medium mb-1">Phone Number</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-3"
        value={updateFormData.phone_number}
        onChange={(e) =>
          setUpdateFormData({
            ...updateFormData,
            phone_number: e.target.value,
          })
        }
      />

      {/* Email */}
      <label className="block font-medium mb-1">Email</label>
      <input
        type="email"
        className="w-full border px-3 py-2 rounded mb-3"
        value={updateFormData.email}
        onChange={(e) =>
          setUpdateFormData({
            ...updateFormData,
            email: e.target.value,
          })
        }
      />

      {/* Image Upload */}
      <label className="block font-medium mb-1">Profile Image</label>

      <div className="border-2 border-dashed p-4 rounded-xl text-center mb-4">
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Upload to Cloudinary
            const uploadedUrl = await uploadToCloudinary(file);

            setUpdateFormData({
              ...updateFormData,
              image: uploadedUrl,
            });

            Swal.fire({
              icon: "success",
              title: "Image Uploaded",
              timer: 1500,
              showConfirmButton: false,
            });
          }}
        />

        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
          <img
            src={updateFormData.image || "/avatar.png"}
            className="w-20 h-20 rounded-full border object-cover"
          />
          <p className="text-sm text-green-700 font-medium">
            Click to upload
          </p>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 bg-green-700 text-white rounded mt-4 hover:bg-green-800 transition"
      >
        Update User
      </button>
    </form>
  </div>
)}










        {/* ===================== DELETE MODAL ===================== */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[350px]">
              <h3 className="text-xl font-bold mb-3 text-red-600">
                Delete User?
              </h3>

              <p className="mb-4">
                Are you sure you want to delete{" "}
                <b>{selectedUser?.name}</b>?
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 border py-2 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
