// src/components/sidebar.tsx
"use client";
import Link from "next/link";
import { Book, GraduationCap, Video, Bell, Trophy, FileText, Link2 } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Trophy },
  { name: "Auth", href: "/dashboard/auth", icon: FileText },
  { name: "Exam", href: "/dashboard/exam", icon: GraduationCap },
  { name: "Result", href: "/dashboard/result", icon: Trophy },
  { name: "Guideline", href: "/dashboard/guideline", icon: Book },
  { name: "YouTube", href: "/dashboard/youtube", icon: Video },
  { name: "Rokomari", href: "/dashboard/rokomari", icon: Link2 },
  { name: "Manage-Permission", href: "/dashboard/permission", icon: Link2 },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col shadow-sm">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
       EduMaster BD
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition hover:bg-gray-100",
                active && "bg-gray-200 font-semibold"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
