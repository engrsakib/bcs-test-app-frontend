"use client";

import {
  Bell,
  LogOut,
  User,
  Menu,
  Award,
  BookOpen,
  HelpCircle,
  UserPlus,
  Users,
  FileText,
  Video,
  ClipboardList,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { confirmAction } from "@/components/ui/confirm-dialog";
import { notify } from "@/lib/toast";
import { ENV } from "@/config/env";
import { useNotifications } from "@/hooks/useNotifications";

type DashboardNavbarProps = {
  onMenuClick?: () => void;
};

const MODULE_ICONS: Record<string, LucideIcon> = {
  exam: BookOpen,
  result: Award,
  question: HelpCircle,
  user: UserPlus,
  admin: Users,
  "question-study-topic": GraduationCap,
  "study-plan": ClipboardList,
  books: FileText,
  guideline: FileText,
  youtube: Video,
};

function getNotificationIcon(module: string): LucideIcon {
  return MODULE_ICONS[module] || Bell;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [admin, setAdmin] = useState<Record<string, string> | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const notificationsEnabled = !loadingAdmin && Boolean(admin);
  const { notifications, unreadCount, isLoading, markAsRead } =
    useNotifications(notificationsEnabled);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = getCookie("access_token");
        const res = await fetch(`${ENV.BASE_URL}/admin/auth`, {
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setAdmin(data.data);
        }
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoadingAdmin(false);
      }
    };

    void fetchAdminData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "Logout?",
      description: "Are you sure you want to logout?",
      confirmText: "Yes, logout",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      const accessToken = getCookie("access_token");
      if (accessToken) {
        await fetch(`${ENV.BASE_URL}/admin/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          credentials: "include",
        });
      }

      document.cookie = "access_token=; path=/; max-age=0";
      document.cookie = "refresh_token=; path=/; max-age=0";

      notify.success("Logged Out", "You have been logged out successfully", {
        duration: 1500,
        onAutoClose: () => {
          router.push("/login");
          router.refresh();
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      void markAsRead(id);
    }
  };

  return (
    <header className="h-16 border-b border-emerald-200/70 bg-white/95 backdrop-blur flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="hidden md:block font-semibold text-lg text-slate-800">
          Smart Learning - MCQ Analysis Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4 relative text-slate-700">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 text-black border border-slate-100"
              >
                <div className="px-4 py-3 border-b bg-slate-50">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <p className="text-xs text-slate-500">
                    {isLoading
                      ? "Loading notifications..."
                      : `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {!isLoading && notifications.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  )}
                  {notifications.map((n) => {
                    const IconComp = getNotificationIcon(n.module);
                    return (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n._id, n.isRead)}
                        className={`px-4 py-3 border-b hover:bg-slate-50 transition cursor-pointer ${
                          !n.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                            <IconComp className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900">
                              {n.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {n.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden z-50 text-black border border-slate-100"
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={admin?.image || "/default-profile.png"}
                      alt={admin?.name || "User"}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {loadingAdmin ? "Loading..." : admin?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {loadingAdmin ? "..." : admin?.phone_number || "No Number"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {loadingAdmin ? "..." : admin?.role || "Role Not Found"}
                    </p>
                  </div>
                </div>

                <ul className="text-sm text-slate-700 py-2">
                  <li>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li className="border-t my-1" />
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-100 text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
