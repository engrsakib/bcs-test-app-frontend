



// "use client";
// import { Bell, LogOut, LogIn, UserPlus, User, Menu } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";

// export const Navbar = ({ onMenuClick }:any) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="h-16 border-b border-green-800/30 bg-[#2B6A5B] flex items-center justify-between px-4 md:px-6 shadow-sm">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="md:hidden text-green-100 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//         <h2 className="hidden md:block font-semibold text-lg text-white">
//       Smart Learning – MCQ Analysis Dashboard
//         </h2>
//       </div>

//       <div className="flex items-center gap-4 md:gap-5 relative text-white">
//         <button className="relative text-green-100 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors">
//           <Bell className="w-6 h-6" />
//           <h1>Nofication</h1>
//           <span className="absolute top-1.5 right-1.5 bg-red-500 text-[10px] rounded-full w-2.5 h-2.5 border border-green-700" />
//         </button>

//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen(!open)}
//             className="w-9 h-9 flex items-center justify-center bg-white/10 text-green-100 rounded-full font-semibold hover:bg-white/20 transition-colors"
//           >
//             <User className="w-5 h-5" />
//           </button>

//           <AnimatePresence>
//             {open && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                 transition={{ duration: 0.15, ease: "easeOut" }}
//                 className="absolute right-0 mt-2 w-56 bg-white border dark:border-gray-700 dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50"
//                 style={{ transformOrigin: "top right" }}
//               >
//                 <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
//                   <div className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
//                     <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800 dark:text-white">Nowshad</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
//                   </div>
//                 </div>

//                 <ul className="text-sm text-gray-700 dark:text-gray-200 py-2">
//                   <li>
//                     <Link
//                       href="/dashboard/login"
//                       className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                       onClick={() => setOpen(false)}
//                     >
//                       <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Login
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/dashboard/register"
//                       className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                       onClick={() => setOpen(false)}
//                     >
//                       <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" /> Register
//                     </Link>
//                   </li>
//                   <li className="border-t dark:border-gray-700 my-1"></li>
//                   <li>
//                     <button
//                       className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
//                       onClick={() => {
//                         alert("Logged out!");
//                         setOpen(false);
//                       }}
//                     >
//                       <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" /> Logout
//                     </button>
//                   </li>
//                 </ul>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </header>
//   );
// };












"use client";
import { Bell, LogOut, LogIn, UserPlus, User, Menu, Award, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Sample notifications data
const notificationsData = [
  {
    id: 1,
    icon: Award,
    title: "New Achievement Unlocked!",
    description: "You've completed 50 MCQ questions. Keep up the great work!",
    time: "5 minutes ago",
    read: false
  },
  {
    id: 2,
    icon: BookOpen,
    title: "New Exam Available",
    description: "Physics Chapter 5 exam is now available for practice",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Performance Improvement",
    description: "Your accuracy has improved by 15% this week!",
    time: "3 hours ago",
    read: true
  },
  {
    id: 4,
    icon: FileText,
    title: "Result Published",
    description: "Your Mathematics exam result is now available",
    time: "1 day ago",
    read: true
  },
  {
    id: 5,
    icon: Bell,
    title: "Reminder",
    description: "Don't forget to complete your daily practice",
    time: "2 days ago",
    read: true
  }
];

export const Navbar = ({ onMenuClick }:any) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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

  const unreadCount = notificationsData.filter(n => !n.read).length;

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
          Smart Learning – MCQ Analysis Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-5 relative text-white">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-green-100 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center border border-green-700 font-semibold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                style={{ transformOrigin: "top right" }}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notificationsData.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            !notification.read 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              !notification.read 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium w-full text-center">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
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