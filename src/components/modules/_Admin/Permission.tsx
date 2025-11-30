


"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Shield, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

enum PermissionEnum {
  CREATE_STUDENT = "create_student",
  VIEW_STUDENT = "view_student",
  UPDATE_STUDENT = "update_student",
  DELETE_STUDENT = "delete_student",
  CREATE_EXAM = "create_exam",
  VIEW_EXAM = "view_exam",
  UPDATE_EXAM = "update_exam",
  DELETE_EXAM = "delete_exam",
  CREATE_QUESTION = "create_question",
  VIEW_QUESTION = "view_question",
  UPDATE_QUESTION = "update_question",
  DELETE_QUESTION = "delete_question",
  CREATE_BOOK = "create_book",
  VIEW_BOOK = "view_book",
  UPDATE_BOOK = "update_book",
  DELETE_BOOK = "delete_book",
  CREATE_GUIDELINE = "create_guideline",
  VIEW_GUIDELINE = "view_guideline",
  UPDATE_GUIDELINE = "update_guideline",
  DELETE_GUIDELINE = "delete_guideline",
  CREATE_STAFF = "create_staff",
  VIEW_STAFF = "view_staff",
  UPDATE_STAFF = "update_staff",
  DELETE_STAFF = "delete_staff",
  CHECK_RESULT = "check_result",
  MANAGE_PERMISSIONS = "manage_permissions",
}

interface PermissionGroup {
  title: string;
  icon: string;
  permissions: {
    key: PermissionEnum;
    label: string;
  }[];
}

export default function ManagePermissions() {
  const router = useRouter();
  const [adminId, setAdminId] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const permissionGroups: PermissionGroup[] = [
    {
      title: "Student",
      icon: "👨‍🎓",
      permissions: [
        { key: PermissionEnum.CREATE_STUDENT, label: "Create Student" },
        { key: PermissionEnum.VIEW_STUDENT, label: "View Student" },
        { key: PermissionEnum.UPDATE_STUDENT, label: "Update Student" },
        { key: PermissionEnum.DELETE_STUDENT, label: "Delete Student" },
      ],
    },
    {
      title: "Exam",
      icon: "📝",
      permissions: [
        { key: PermissionEnum.CREATE_EXAM, label: "Create Exam" },
        { key: PermissionEnum.VIEW_EXAM, label: "View Exam" },
        { key: PermissionEnum.UPDATE_EXAM, label: "Update Exam" },
        { key: PermissionEnum.DELETE_EXAM, label: "Delete Exam" },
      ],
    },
    {
      title: "Question",
      icon: "❓",
      permissions: [
        { key: PermissionEnum.CREATE_QUESTION, label: "Create Question" },
        { key: PermissionEnum.VIEW_QUESTION, label: "View Question" },
        { key: PermissionEnum.UPDATE_QUESTION, label: "Update Question" },
        { key: PermissionEnum.DELETE_QUESTION, label: "Delete Question" },
      ],
    },
    {
      title: "Book",
      icon: "📚",
      permissions: [
        { key: PermissionEnum.CREATE_BOOK, label: "Create Book" },
        { key: PermissionEnum.VIEW_BOOK, label: "View Book" },
        { key: PermissionEnum.UPDATE_BOOK, label: "Update Book" },
        { key: PermissionEnum.DELETE_BOOK, label: "Delete Book" },
      ],
    },
    {
      title: "Guideline",
      icon: "📋",
      permissions: [
        { key: PermissionEnum.CREATE_GUIDELINE, label: "Create Guideline" },
        { key: PermissionEnum.VIEW_GUIDELINE, label: "View Guideline" },
        { key: PermissionEnum.UPDATE_GUIDELINE, label: "Update Guideline" },
        { key: PermissionEnum.DELETE_GUIDELINE, label: "Delete Guideline" },
      ],
    },
    {
      title: "Staff",
      icon: "👥",
      permissions: [
        { key: PermissionEnum.CREATE_STAFF, label: "Create Staff" },
        { key: PermissionEnum.VIEW_STAFF, label: "View Staff" },
        { key: PermissionEnum.UPDATE_STAFF, label: "Update Staff" },
        { key: PermissionEnum.DELETE_STAFF, label: "Delete Staff" },
      ],
    },
    {
      title: "Other Permissions",
      icon: "⚙️",
      permissions: [
        { key: PermissionEnum.CHECK_RESULT, label: "Check Result" },
        { key: PermissionEnum.MANAGE_PERMISSIONS, label: "Manage Permissions" },
      ],
    },
  ];

  // Combined effect to get admin ID and fetch permissions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setAdminId(id);
      // Automatically fetch permissions when ID is available
      fetchPermissionsForId(id);
    }
  }, []);

  const fetchPermissionsForId = async (id: string) => {
    if (!id) {
      setMessage({ type: "error", text: "Please enter admin ID" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const accessToken = getCookie("access_token");

      if (!accessToken) {
        setMessage({ type: "error", text: "Please login first" });
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/admin/auth`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken,
          },
          credentials: "include",
        }
      );

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Please login again" });
        router.push("/login");
        return;
      }

      const json = await res.json();
      console.log("Fetched permissions:", json);

      if (json.success && json.data?.permissions) {
        setSelectedPermissions(json.data.permissions);
        setMessage({ type: "success", text: "Permissions loaded successfully!" });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ type: "error", text: json.message || "Failed to load permissions" });
      }
    } catch (e) {
      console.error("Error fetching permissions:", e);
      setMessage({ type: "error", text: "Failed to load permissions" });
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = () => {
    if (adminId) {
      fetchPermissionsForId(adminId);
    }
  };

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleToggleGroup = (group: PermissionGroup) => {
    const groupPermissions = group.permissions.map((p) => p.key);
    const allSelected = groupPermissions.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !groupPermissions.includes(p as PermissionEnum))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...groupPermissions.filter((p) => !prev.includes(p)),
      ]);
    }
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const accessToken = getCookie("access_token");

      if (!accessToken) {
        setMessage({ type: "error", text: "Please login first" });
        router.push("/login");
        return;
      }

      const res = await fetch(
        `https://mcq-analysis.vercel.app/api/v1/permissions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken,
          },
          credentials: "include",
          body: JSON.stringify({
            id: adminId,
            permissions: selectedPermissions,
          }),
        }
      );

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Please login again" });
        router.push("/login");
        return;
      }

      const json = await res.json();
      console.log("Save response:", json);

      if (json.success) {
        setMessage({ type: "success", text: "Permissions saved successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: json.message || "Failed to save permissions" });
      }
    } catch (e) {
      console.error("Error saving permissions:", e);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const getGroupProgress = (group: PermissionGroup) => {
    const total = group.permissions.length;
    const selected = group.permissions.filter((p) =>
      selectedPermissions.includes(p.key)
    ).length;
    return { selected, total, percentage: (selected / total) * 100 };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Admin List</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-green-800" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Manage Permissions
          </h1>
        </div>
        <p className="text-gray-600">
          Configure access permissions for admin users
        </p>
      </div>

      {/* Admin ID Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin ID
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
            placeholder="Enter admin ID"
          />
          <button
            onClick={fetchPermissions}
            disabled={loading || !adminId}
            className="px-6 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Load Permissions"
            )}
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-green-800 animate-spin mb-4" />
            <p className="text-gray-600">Loading permissions...</p>
          </div>
        </div>
      ) : adminId && (
        <>
          {/* Permission Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Permissions Selected</p>
                <p className="text-3xl font-bold text-green-800">
                  {selectedPermissions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Out of</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(PermissionEnum).length}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-800 h-full transition-all duration-300"
                style={{
                  width: `${
                    (selectedPermissions.length /
                      Object.keys(PermissionEnum).length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Permission Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {permissionGroups.map((group) => {
              const progress = getGroupProgress(group);
              const allSelected = progress.selected === progress.total;

              return (
                <div
                  key={group.title}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Group Header */}
                  <div className="bg-gradient-to-r from-green-800 to-green-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{group.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {group.title}
                          </h3>
                          <p className="text-green-100 text-sm">
                            {progress.selected} of {progress.total} selected
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleGroup(group)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          allSelected
                            ? "bg-white text-green-800 hover:bg-green-50"
                            : "bg-green-900 text-white hover:bg-green-950"
                        }`}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                    <div className="mt-3 bg-green-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Group Permissions */}
                  <div className="p-4 space-y-2">
                    {group.permissions.map((permission) => {
                      const isSelected = selectedPermissions.includes(
                        permission.key
                      );

                      return (
                        <label
                          key={permission.key}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleTogglePermission(permission.key)
                            }
                            className="w-5 h-5 text-green-800 border-gray-300 rounded focus:ring-2 focus:ring-green-800 cursor-pointer"
                          />
                          <span className="flex-1 text-gray-700 group-hover:text-gray-900 font-medium">
                            {permission.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-green-800" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="sticky bottom-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {selectedPermissions.length} permission(s) selected
              </div>
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Permissions
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}