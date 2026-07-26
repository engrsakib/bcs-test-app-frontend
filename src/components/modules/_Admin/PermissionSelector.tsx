"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  ALL_PERMISSIONS,
  PERMISSION_GROUP_CONFIG,
  type PermissionEnum,
} from "@/constants/permissions";
import {
  getPermissionsForRole,
  isSystemRole,
} from "@/constants/role-permissions";
import type { AdminRole } from "@/constants/admin-roles";

interface PermissionSelectorProps {
  role: AdminRole | "";
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  readOnly?: boolean;
  lockToRole?: boolean;
  syncOnRoleChange?: boolean;
  compact?: boolean;
}

export default function PermissionSelector({
  role,
  selectedPermissions,
  onChange,
  readOnly = false,
  lockToRole = true,
  syncOnRoleChange = true,
  compact = false,
}: PermissionSelectorProps) {
  const isLocked =
    readOnly || (role !== "" && isSystemRole(role) && lockToRole);

  useEffect(() => {
    if (role && isSystemRole(role) && syncOnRoleChange) {
      onChange(getPermissionsForRole(role));
    }
  }, [role, syncOnRoleChange]);

  const handleTogglePermission = (permission: string) => {
    if (isLocked) return;

    onChange(
      selectedPermissions.includes(permission)
        ? selectedPermissions.filter((item) => item !== permission)
        : [...selectedPermissions, permission]
    );
  };

  const handleToggleGroup = (groupPermissions: PermissionEnum[]) => {
    if (isLocked) return;

    const allSelected = groupPermissions.every((permission) =>
      selectedPermissions.includes(permission)
    );

    if (allSelected) {
      onChange(
        selectedPermissions.filter(
          (permission) => !groupPermissions.includes(permission as PermissionEnum)
        )
      );
      return;
    }

    onChange([
      ...selectedPermissions,
      ...groupPermissions.filter(
        (permission) => !selectedPermissions.includes(permission)
      ),
    ]);
  };

  const getGroupProgress = (groupPermissions: PermissionEnum[]) => {
    const total = groupPermissions.length;
    const selected = groupPermissions.filter((permission) =>
      selectedPermissions.includes(permission)
    ).length;

    return {
      selected,
      total,
      percentage: total === 0 ? 0 : (selected / total) * 100,
    };
  };

  if (!role) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Select a role to preview the permissions that will be assigned automatically.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLocked && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Permissions for the <strong>{role}</strong> role are assigned automatically
          and cannot be changed manually.
        </div>
      )}

      {!isLocked && role && isSystemRole(role) && !lockToRole && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Changing the <strong>{role}</strong> role resets permissions to its
          defaults. You can customize them afterward without changing the role
          again.
        </div>
      )}

      <div
        className={`rounded-lg border border-gray-200 bg-white ${
          compact ? "p-4" : "p-4 md:p-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Permissions Selected</p>
            <p className="text-2xl font-bold text-green-800">
              {selectedPermissions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Out of</p>
            <p className="text-2xl font-bold text-gray-900">
              {ALL_PERMISSIONS.length}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-green-800 transition-all duration-300"
            style={{
              width: `${(selectedPermissions.length / ALL_PERMISSIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {PERMISSION_GROUP_CONFIG.map((group) => {
          const groupPermissionKeys = group.permissions.map(
            (permission) => permission.key
          );
          const progress = getGroupProgress(groupPermissionKeys);
          const allSelected = progress.selected === progress.total;

          return (
            <div
              key={group.key}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="bg-gradient-to-r from-green-800 to-green-700 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {group.title}
                      </h3>
                      <p className="text-sm text-green-100">
                        {progress.selected} of {progress.total} selected
                      </p>
                    </div>
                  </div>

                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => handleToggleGroup(groupPermissionKeys)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        allSelected
                          ? "bg-white text-green-800 hover:bg-green-50"
                          : "bg-green-900 text-white hover:bg-green-950"
                      }`}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-green-900">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 p-4">
                {group.permissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission.key);

                  return (
                    <label
                      key={permission.key}
                      className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                        isLocked
                          ? "cursor-not-allowed opacity-80"
                          : "cursor-pointer hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isLocked}
                        onChange={() => handleTogglePermission(permission.key)}
                        className="h-5 w-5 rounded border-gray-300 text-green-800 focus:ring-2 focus:ring-green-800 disabled:cursor-not-allowed"
                      />
                      <span className="flex-1 font-medium text-gray-700">
                        {permission.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-green-800" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
