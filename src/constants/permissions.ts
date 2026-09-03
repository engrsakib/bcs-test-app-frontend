export enum PermissionEnum {
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

  CREATE_ANNOUNCEMENT = "create_announcement",
  VIEW_ANNOUNCEMENT = "view_announcement",
  UPDATE_ANNOUNCEMENT = "update_announcement",
  DELETE_ANNOUNCEMENT = "delete_announcement",

  CHECK_RESULT = "check_result",

  CREATE_STAFF = "create_staff",
  VIEW_STAFF = "view_staff",
  UPDATE_STAFF = "update_staff",
  DELETE_STAFF = "delete_staff",

  MANAGE_PERMISSIONS = "manage_permissions",

  VIEW_SMS = "view_sms",
  SEND_SMS = "send_sms",
}

export const PERMISSION_GROUP_KEYS = {
  STUDENT: "STUDENT",
  EXAM: "EXAM",
  QUESTION: "QUESTION",
  BOOK: "BOOK",
  GUIDELINE: "GUIDELINE",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  SMS: "SMS",
  STAFF: "STAFF",
  OTHER: "OTHER",
} as const;

export type PermissionGroupKey =
  (typeof PERMISSION_GROUP_KEYS)[keyof typeof PERMISSION_GROUP_KEYS];

export const PERMISSION_GROUPS: Record<PermissionGroupKey, PermissionEnum[]> = {
  [PERMISSION_GROUP_KEYS.STUDENT]: [
    PermissionEnum.CREATE_STUDENT,
    PermissionEnum.VIEW_STUDENT,
    PermissionEnum.UPDATE_STUDENT,
    PermissionEnum.DELETE_STUDENT,
  ],
  [PERMISSION_GROUP_KEYS.EXAM]: [
    PermissionEnum.CREATE_EXAM,
    PermissionEnum.VIEW_EXAM,
    PermissionEnum.UPDATE_EXAM,
    PermissionEnum.DELETE_EXAM,
  ],
  [PERMISSION_GROUP_KEYS.QUESTION]: [
    PermissionEnum.CREATE_QUESTION,
    PermissionEnum.VIEW_QUESTION,
    PermissionEnum.UPDATE_QUESTION,
    PermissionEnum.DELETE_QUESTION,
  ],
  [PERMISSION_GROUP_KEYS.BOOK]: [
    PermissionEnum.CREATE_BOOK,
    PermissionEnum.VIEW_BOOK,
    PermissionEnum.UPDATE_BOOK,
    PermissionEnum.DELETE_BOOK,
  ],
  [PERMISSION_GROUP_KEYS.GUIDELINE]: [
    PermissionEnum.CREATE_GUIDELINE,
    PermissionEnum.VIEW_GUIDELINE,
    PermissionEnum.UPDATE_GUIDELINE,
    PermissionEnum.DELETE_GUIDELINE,
  ],
  [PERMISSION_GROUP_KEYS.ANNOUNCEMENT]: [
    PermissionEnum.CREATE_ANNOUNCEMENT,
    PermissionEnum.VIEW_ANNOUNCEMENT,
    PermissionEnum.UPDATE_ANNOUNCEMENT,
    PermissionEnum.DELETE_ANNOUNCEMENT,
  ],
  [PERMISSION_GROUP_KEYS.SMS]: [
    PermissionEnum.VIEW_SMS,
    PermissionEnum.SEND_SMS,
  ],
  [PERMISSION_GROUP_KEYS.STAFF]: [
    PermissionEnum.CREATE_STAFF,
    PermissionEnum.VIEW_STAFF,
    PermissionEnum.UPDATE_STAFF,
    PermissionEnum.DELETE_STAFF,
  ],
  [PERMISSION_GROUP_KEYS.OTHER]: [
    PermissionEnum.CHECK_RESULT,
    PermissionEnum.MANAGE_PERMISSIONS,
  ],
};

export const PERMISSION_GROUP_LABELS: Record<PermissionGroupKey, string> = {
  [PERMISSION_GROUP_KEYS.STUDENT]: "Student",
  [PERMISSION_GROUP_KEYS.EXAM]: "Exam",
  [PERMISSION_GROUP_KEYS.QUESTION]: "Question",
  [PERMISSION_GROUP_KEYS.BOOK]: "Book",
  [PERMISSION_GROUP_KEYS.GUIDELINE]: "Guideline",
  [PERMISSION_GROUP_KEYS.ANNOUNCEMENT]: "Announcement",
  [PERMISSION_GROUP_KEYS.SMS]: "SMS",
  [PERMISSION_GROUP_KEYS.STAFF]: "Staff",
  [PERMISSION_GROUP_KEYS.OTHER]: "Other Permissions",
};

export const PERMISSION_GROUP_ICONS: Record<PermissionGroupKey, string> = {
  [PERMISSION_GROUP_KEYS.STUDENT]: "👨‍🎓",
  [PERMISSION_GROUP_KEYS.EXAM]: "📝",
  [PERMISSION_GROUP_KEYS.QUESTION]: "❓",
  [PERMISSION_GROUP_KEYS.BOOK]: "📚",
  [PERMISSION_GROUP_KEYS.GUIDELINE]: "📋",
  [PERMISSION_GROUP_KEYS.ANNOUNCEMENT]: "📢",
  [PERMISSION_GROUP_KEYS.SMS]: "💬",
  [PERMISSION_GROUP_KEYS.STAFF]: "👥",
  [PERMISSION_GROUP_KEYS.OTHER]: "⚙️",
};

export const PERMISSION_LABELS: Record<PermissionEnum, string> = {
  [PermissionEnum.CREATE_STUDENT]: "Create Student",
  [PermissionEnum.VIEW_STUDENT]: "View Student",
  [PermissionEnum.UPDATE_STUDENT]: "Update Student",
  [PermissionEnum.DELETE_STUDENT]: "Delete Student",
  [PermissionEnum.CREATE_EXAM]: "Create Exam",
  [PermissionEnum.VIEW_EXAM]: "View Exam",
  [PermissionEnum.UPDATE_EXAM]: "Update Exam",
  [PermissionEnum.DELETE_EXAM]: "Delete Exam",
  [PermissionEnum.CREATE_QUESTION]: "Create Question",
  [PermissionEnum.VIEW_QUESTION]: "View Question",
  [PermissionEnum.UPDATE_QUESTION]: "Update Question",
  [PermissionEnum.DELETE_QUESTION]: "Delete Question",
  [PermissionEnum.CREATE_BOOK]: "Create Book",
  [PermissionEnum.VIEW_BOOK]: "View Book",
  [PermissionEnum.UPDATE_BOOK]: "Update Book",
  [PermissionEnum.DELETE_BOOK]: "Delete Book",
  [PermissionEnum.CREATE_GUIDELINE]: "Create Guideline",
  [PermissionEnum.VIEW_GUIDELINE]: "View Guideline",
  [PermissionEnum.UPDATE_GUIDELINE]: "Update Guideline",
  [PermissionEnum.DELETE_GUIDELINE]: "Delete Guideline",
  [PermissionEnum.CREATE_ANNOUNCEMENT]: "Create Announcement",
  [PermissionEnum.VIEW_ANNOUNCEMENT]: "View Announcement",
  [PermissionEnum.UPDATE_ANNOUNCEMENT]: "Update Announcement",
  [PermissionEnum.DELETE_ANNOUNCEMENT]: "Delete Announcement",
  [PermissionEnum.VIEW_SMS]: "View SMS",
  [PermissionEnum.SEND_SMS]: "Send SMS",
  [PermissionEnum.CHECK_RESULT]: "Check Result",
  [PermissionEnum.CREATE_STAFF]: "Create Staff",
  [PermissionEnum.VIEW_STAFF]: "View Staff",
  [PermissionEnum.UPDATE_STAFF]: "Update Staff",
  [PermissionEnum.DELETE_STAFF]: "Delete Staff",
  [PermissionEnum.MANAGE_PERMISSIONS]: "Manage Permissions",
};

export interface PermissionGroupConfig {
  key: PermissionGroupKey;
  title: string;
  icon: string;
  permissions: {
    key: PermissionEnum;
    label: string;
  }[];
}

export const PERMISSION_GROUP_CONFIG: PermissionGroupConfig[] = (
  Object.keys(PERMISSION_GROUPS) as PermissionGroupKey[]
).map((groupKey) => ({
  key: groupKey,
  title: PERMISSION_GROUP_LABELS[groupKey],
  icon: PERMISSION_GROUP_ICONS[groupKey],
  permissions: PERMISSION_GROUPS[groupKey].map((permissionKey) => ({
    key: permissionKey,
    label: PERMISSION_LABELS[permissionKey],
  })),
}));

export const ALL_PERMISSIONS = Object.values(PermissionEnum);
