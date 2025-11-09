



"use client";
import { Bell, LogOut, LogIn, UserPlus, User, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = ({ onMenuClick }:any) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-green-800/30 bg-[#2B6A5B] flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-green-100 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="hidden md:block font-semibold text-lg text-white">
          BCS Exam Panel
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-5 relative text-white">
        <button className="relative text-green-100 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 bg-red-500 text-[10px] rounded-full w-2.5 h-2.5 border border-green-700" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center bg-white/10 text-green-100 rounded-full font-semibold hover:bg-white/20 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 bg-white border dark:border-gray-700 dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50"
                style={{ transformOrigin: "top right" }}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Nowshad</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                  </div>
                </div>

                <ul className="text-sm text-gray-700 dark:text-gray-200 py-2">
                  <li>
                    <Link
                      href="/dashboard/login"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/register"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" /> Register
                    </Link>
                  </li>
                  <li className="border-t dark:border-gray-700 my-1"></li>
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      onClick={() => {
                        alert("Logged out!");
                        setOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" /> Logout
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
};
