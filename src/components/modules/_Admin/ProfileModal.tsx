








"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Phone, Briefcase, Calendar, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ENV } from "@/config/env";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface AdminProfile {
  _id: string;
  name: string;
  phone_number: string;
  role: string;
  status: string;
  image?: string;
  designation?: string;
  biography?: string;
  createdAt?: string;
  permissions?: string[];
}

interface ProfileModalProps {
  adminId: string;
  onClose: () => void;
}

export default function ProfileModal({ adminId, onClose }: ProfileModalProps) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const accessToken = getCookie("access_token");

      if (!accessToken) {
        Swal.fire({
          title: "Unauthorized",
          text: "Please login first",
          icon: "warning",
        });
        router.push("/login");
        return;
      }

      const res = await fetch(`${ENV.BASE_URL}/admin/${adminId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken,
        },
        credentials: "include",
      });

      if (res.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again",
          icon: "warning",
        });
        router.push("/login");
        return;
      }

      const json = await res.json();

      if (!json.success) {
        Swal.fire({
          title: "Error",
          text: json.message || "Failed to fetch profile",
          icon: "error",
        });
        onClose();
        return;
      }

      setAdmin(json.data);
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch admin profile",
        icon: "error",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchAdminProfile();
    }
  }, [adminId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur and dark overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-green-800 animate-spin mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          ) : admin ? (
            <>
              {/* Header */}
              <div className="h-32 bg-gradient-to-r from-green-700 to-green-900"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row translate-y-7 items-center sm:items-end gap-4 -mt-16 mb-6">
                  <div className="relative">
                    <img
                      src={
                        admin.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={admin.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {admin.name}
                    </h1>
                    <p className="text-green-700 font-medium capitalize">
                      {admin.role.replace(/_/g, " ")}
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {admin.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Phone className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-900 font-medium">
                            {admin.phone_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Briefcase className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Designation</p>
                          <p className="text-gray-900 font-medium">
                            {admin.designation || "normal_man"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Joined</p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(admin?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Biography
                    </h2>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <FileText className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-gray-700">
                          {admin.biography || "my biograph"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditionally Render Permissions */}
                {admin.permissions && admin.permissions.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Permissions
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {admin.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-green-50 text-green-800 text-sm text-center rounded-lg border border-green-100"
                        >
                          {permission.replace(/_/g, " ")}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-600 text-lg">Profile not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
