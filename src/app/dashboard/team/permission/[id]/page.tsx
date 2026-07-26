"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  Shield,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PermissionSelector from "@/components/modules/_Admin/PermissionSelector";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import {
  getPermissionsForRole,
  isSystemRole,
} from "@/constants/role-permissions";
import type { AdminRole } from "@/constants/admin-roles";
import { ADMIN_ROLE_OPTIONS } from "@/constants/admin-roles";
import { PermissionEnum } from "@/constants/permissions";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

interface Admin {
  _id: string;
  name: string;
  phone_number: string;
  permissions: string[];
  role: string;
  status: string;
  image?: string;
  designation?: string;
  bio?: string;
}

interface LoggedInAdmin {
  permissions?: string[];
}

export default function ManagePermissions() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole | "">("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [canManagePermissions, setCanManagePermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const permissionsLocked =
    selectedRole !== "" && isSystemRole(selectedRole) && !canManagePermissions;

  useEffect(() => {
    if (adminId) {
      fetchPermissionsForId(adminId);
    }
  }, [adminId]);

  const fetchLoggedInAdminPermissions = async (
    accessToken: string
  ): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/admin/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const loggedInAdmin = json.data as LoggedInAdmin | undefined;

    return Array.isArray(loggedInAdmin?.permissions)
      ? loggedInAdmin.permissions
      : [];
  };

  const fetchPermissionsForId = async (id: string) => {
    try {
      setLoading(true);
      setMessage(null);
      setAdminInfo(null);

      const accessToken = getCookie("access_token");

      if (!accessToken) {
        setMessage({ type: "error", text: "Please login first" });
        router.push("/login");
        return;
      }

      const [loggedInPermissions, res] = await Promise.all([
        fetchLoggedInAdminPermissions(accessToken),
        fetch(`${BASE_URL}/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const hasManagePermission = loggedInPermissions.includes(
        PermissionEnum.MANAGE_PERMISSIONS
      );
      setCanManagePermissions(hasManagePermission);

      if (res.status === 401) {
        setMessage({
          type: "error",
          text: "Session expired. Please login again",
        });
        router.push("/login");
        return;
      }

      const json = await res.json();

      if (!json.success) {
        setMessage({
          type: "error",
          text: json.message || "Failed to load admin details",
        });
        return;
      }

      const adminData: Admin = json.data;

      setAdminInfo(adminData);
      setSelectedRole(adminData.role as AdminRole);

      const storedPermissions = adminData.permissions || [];
      const roleDefaults =
        adminData.role && isSystemRole(adminData.role)
          ? getPermissionsForRole(adminData.role)
          : [];

      if (
        adminData.role &&
        isSystemRole(adminData.role) &&
        !hasManagePermission
      ) {
        setSelectedPermissions(roleDefaults);
      } else if (storedPermissions.length === 0 && roleDefaults.length > 0) {
        setSelectedPermissions(roleDefaults);
      } else {
        setSelectedPermissions(storedPermissions);
      }
    } catch (e) {
      console.error("Error fetching permissions:", e);
      setMessage({ type: "error", text: "Failed to load permissions" });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: AdminRole) => {
    setSelectedRole(role);

    if (isSystemRole(role)) {
      setSelectedPermissions(getPermissionsForRole(role));
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

      const roleChanged = Boolean(
        selectedRole && adminInfo && selectedRole !== adminInfo.role
      );

      if (roleChanged && selectedRole) {
        const roleRes = await fetch(`${BASE_URL}/admin/update-staff/${adminId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          credentials: "include",
          body: JSON.stringify({ role: selectedRole }),
        });

        const roleJson = await roleRes.json();

        if (!roleJson.success) {
          setMessage({
            type: "error",
            text: roleJson.message || "Failed to update admin role",
          });
          return;
        }
      }

      const permissionsToSave =
        selectedRole && isSystemRole(selectedRole) && !canManagePermissions
          ? getPermissionsForRole(selectedRole)
          : selectedPermissions;

      const res = await fetch(`${BASE_URL}/permissions`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        credentials: "include",
        body: JSON.stringify({
          id: adminId,
          permissions: permissionsToSave,
        }),
      });

      if (res.status === 401) {
        setMessage({
          type: "error",
          text: "Session expired. Please login again",
        });
        router.push("/login");
        return;
      }

      const json = await res.json();

      if (json.success) {
        setAdminInfo((current) =>
          current
            ? {
                ...current,
                role: selectedRole || current.role,
                permissions: permissionsToSave,
              }
            : current
        );
        setMessage({
          type: "success",
          text: roleChanged
            ? "Role and permissions saved successfully!"
            : "Permissions saved successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: json.message || "Failed to save permissions",
        });
      }
    } catch (e) {
      console.error("Error saving permissions:", e);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Admin List</span>
        </button>

        <div className="mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-green-800" />
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Manage Permissions
          </h1>
        </div>

        <p className="text-gray-600">
          Configure access permissions for admin users
        </p>
      </div>

      {adminInfo && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex items-center gap-4">
            <img
              src={
                adminInfo.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={adminInfo.name}
              className="h-14 w-14 rounded-full border object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{adminInfo.name}</h2>
              <p className="text-sm text-gray-600">{adminInfo.phone_number}</p>
              <p className="text-sm text-gray-500">{adminInfo.status}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>
            {canManagePermissions ? (
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500"
              >
                {ADMIN_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium capitalize text-gray-800">
                {selectedRole}
              </p>
            )}
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-green-800" />
            <p className="text-gray-600">Loading permissions...</p>
          </div>
        </div>
      ) : (
        <>
          <PermissionSelector
            role={selectedRole}
            selectedPermissions={selectedPermissions}
            onChange={setSelectedPermissions}
            readOnly={permissionsLocked}
            lockToRole={!canManagePermissions}
            syncOnRoleChange={false}
          />

          <div className="sticky bottom-6 mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600">
                {selectedPermissions.length} of {ALL_PERMISSIONS.length}{" "}
                permission(s) selected
              </div>
              <button
                onClick={handleSavePermissions}
                disabled={saving || !selectedRole}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 px-8 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-green-900 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
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
