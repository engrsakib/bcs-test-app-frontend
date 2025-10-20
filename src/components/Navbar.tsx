
"use client";
import { Bell, LogOut, LogIn, UserPlus, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside close dropdown
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
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <h2 className="font-semibold text-lg text-gray-800">Dashboard</h2>

      <div className="flex items-center gap-5 relative">
        {/* Notification Bell */}
        <button className="relative hover:bg-gray-100 p-2 rounded-full transition">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-3 h-3" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition"
          >
            N
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
              style={{ transformOrigin: "top right" }}
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Nowshad</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </div>

              {/* Menu Items */}
              <ul className="text-sm text-gray-700">
                <li>
                  <Link
                    href="/dashboard/auth"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <LogIn className="w-4 h-4 text-indigo-600" /> Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/auth/register"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <UserPlus className="w-4 h-4 text-green-600" /> Register
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-left"
                    onClick={() => alert("Logged out!")}
                  >
                    <LogOut className="w-4 h-4 text-red-600" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
