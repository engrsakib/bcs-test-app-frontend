export const ADMIN_ROLES = {
  FOUNDER: "founder",
  ADMIN: "admin",
  EDITOR: "editor",
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const ADMIN_ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: ADMIN_ROLES.FOUNDER, label: "Founder" },
  { value: ADMIN_ROLES.ADMIN, label: "Admin" },
  { value: ADMIN_ROLES.EDITOR, label: "Editor" },
];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  founder: "Founder",
  admin: "Admin",
  editor: "Editor",
};

export const ADMIN_ROLE_GRADIENTS: Record<AdminRole, string> = {
  founder: "bg-gradient-to-r from-yellow-500 to-orange-500",
  admin: "bg-gradient-to-r from-blue-500 to-purple-600",
  editor: "bg-gradient-to-r from-green-500 to-teal-600",
};
