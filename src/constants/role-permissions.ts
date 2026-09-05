import {
  ADMIN_ROLES,
  type AdminRole,
} from "@/constants/admin-roles";
import {
  PermissionEnum,
  PERMISSION_GROUP_KEYS,
  PERMISSION_GROUPS,
  type PermissionGroupKey,
} from "@/constants/permissions";

const ROLE_PERMISSION_GROUPS: Record<
  AdminRole,
  PermissionGroupKey[] | "ALL"
> = {
  [ADMIN_ROLES.FOUNDER]: "ALL",
  [ADMIN_ROLES.ADMIN]: [
    PERMISSION_GROUP_KEYS.STUDENT,
    PERMISSION_GROUP_KEYS.EXAM,
    PERMISSION_GROUP_KEYS.QUESTION,
    PERMISSION_GROUP_KEYS.BOOK,
    PERMISSION_GROUP_KEYS.GUIDELINE,
    PERMISSION_GROUP_KEYS.ANNOUNCEMENT,
    PERMISSION_GROUP_KEYS.SMS,
  ],
  [ADMIN_ROLES.EDITOR]: [
    PERMISSION_GROUP_KEYS.EXAM,
    PERMISSION_GROUP_KEYS.QUESTION,
  ],
};

const ROLE_EXTRA_PERMISSIONS: Partial<Record<AdminRole, PermissionEnum[]>> = {
  [ADMIN_ROLES.ADMIN]: [
    PermissionEnum.CHECK_RESULT,
    PermissionEnum.VIEW_ACTIVITY,
  ],
};

export const SYSTEM_ROLES = Object.values(ADMIN_ROLES);

export function isSystemRole(role: string): role is AdminRole {
  return SYSTEM_ROLES.includes(role as AdminRole);
}

export function getPermissionsForRole(role: AdminRole): PermissionEnum[] {
  const groupConfig = ROLE_PERMISSION_GROUPS[role];

  if (groupConfig === "ALL") {
    return Object.values(PermissionEnum);
  }

  const fromGroups = groupConfig.flatMap(
    (groupKey) => PERMISSION_GROUPS[groupKey]
  );
  const extras = ROLE_EXTRA_PERMISSIONS[role] ?? [];

  return Array.from(new Set([...fromGroups, ...extras]));
}
