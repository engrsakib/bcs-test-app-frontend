"use client";

import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  LucideIcon,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  getNotificationRelativeTime,
  type NotificationItem,
} from "@/lib/notifications";

const MODULE_ICONS: Record<string, LucideIcon> = {
  exam: BookOpen,
  result: Award,
  question: HelpCircle,
  user: UserPlus,
  admin: Users,
  "question-study-topic": GraduationCap,
  "study-plan": ClipboardList,
  "exam-routine": CalendarDays,
  books: FileText,
  guideline: FileText,
  youtube: Video,
};

function getNotificationIcon(module: string): LucideIcon {
  return MODULE_ICONS[module] || Bell;
}

function NotificationRelativeTime({ item }: { item: NotificationItem }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <p className="text-xs text-slate-500 mt-1.5">
      {getNotificationRelativeTime(item, now)}
    </p>
  );
}

function getSubtitle(
  isLoading: boolean,
  error: string | null,
  fromCache: boolean,
  unreadCount: number
): string {
  if (isLoading) return "Loading notifications...";
  if (error) return "Could not load notifications";
  if (fromCache) return "Showing cached notifications";
  if (unreadCount === 0) return "You're all caught up";
  return `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`;
}

export type NotificationDrawerProps = {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  fromCache: boolean;
  onItemClick: (id: string, isRead: boolean) => void;
  onScroll: () => void;
  listRef: React.RefObject<HTMLDivElement | null>;
};

export function NotificationDrawer({
  open,
  onClose,
  notifications,
  unreadCount,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  fromCache,
  onItemClick,
  onScroll,
  listRef,
}: NotificationDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[1px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <header className="shrink-0 border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="notification-drawer-title"
                      className="text-lg font-semibold tracking-tight text-slate-900"
                    >
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {getSubtitle(isLoading, error, fromCache, unreadCount)}
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close notification panel"
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div
              ref={listRef}
              onScroll={onScroll}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {isLoading && notifications.length === 0 && (
                <div className="flex flex-col gap-3 px-5 py-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-slate-200" />
                          <div className="h-3 w-full rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    No notifications yet
                  </p>
                  <p className="mt-1 max-w-[240px] text-sm text-slate-500">
                    Activity from exams, results, and admin actions will appear
                    here.
                  </p>
                </div>
              )}

              {notifications.map((notification) => {
                const IconComp = getNotificationIcon(notification.module);

                return (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() =>
                      onItemClick(notification._id, notification.isRead)
                    }
                    className={`w-full border-b border-slate-100 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${
                      !notification.isRead
                        ? "border-l-2 border-l-indigo-500 bg-indigo-50/40"
                        : "border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <IconComp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        <p className="mt-0.5 text-sm leading-snug text-slate-600 line-clamp-2">
                          {notification.description}
                        </p>
                        <NotificationRelativeTime item={notification} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <footer className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3">
              {isLoadingMore && (
                <p className="text-center text-xs font-medium text-slate-500">
                  Loading more...
                </p>
              )}
              {!isLoadingMore && hasMore && notifications.length > 0 && (
                <p className="text-center text-xs text-slate-400">
                  Scroll for more notifications
                </p>
              )}
              {!isLoadingMore && !hasMore && notifications.length > 0 && (
                <p className="text-center text-xs text-slate-400">
                  End of notifications
                </p>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
