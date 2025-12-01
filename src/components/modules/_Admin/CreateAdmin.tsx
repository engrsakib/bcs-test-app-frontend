

// "use client";

// import { useForm } from "react-hook-form";
// import { Phone, User2, Lock, ShieldCheck } from "lucide-react";
// import Swal from "sweetalert2";
// import { useRouter } from "next/navigation";

// // Roles Enum
// export const ROLES = {
//   FOUNDER: "founder",
//   SUPER_ADMIN: "super_admin",
//   ADMIN: "admin",
//   MODERATOR: "moderator",
// };

// // // Helper function to get cookie value
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null;
  
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
  
//   if (parts.length === 2) {
//     return parts.pop()?.split(";").shift() || null;
//   }
//   return null;
// }

// export default function CreateAdminForm() {
//   const router = useRouter();
  
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const onSubmit = async (data: any) => {
//     try {
//       // Get access token from cookie
//       const accessToken = getCookie("access_token");

//       if (!accessToken) {
//         Swal.fire({
//           title: "Unauthorized",
//           text: "Please login first",
//           icon: "warning",
//         });
//         router.push("/login");
//         return;
//       }

//       // Call backend API with Authorization header
//       const res = await fetch(
//         "https://mcq-analysis.vercel.app/api/v1/admin/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": accessToken,
//           },
//           credentials: "include", // Important for cookies
//           body: JSON.stringify(data),
//         }
//       );

//       const result = await res.json();
//       console.log("CreateAdmin response:", result);

//       if (result.success) {
//         Swal.fire({
//           title: "Success!",
//           text: "Admin Created Successfully. Verification OTP Sent.",
//           icon: "success",
//           confirmButtonColor: "#16a34a",
//         });
//         reset(); // Clear form
//       } else {
//         // Handle different error cases
//         if (res.status === 401) {
//           Swal.fire({
//             title: "Session Expired",
//             text: "Please login again",
//             icon: "warning",
//           });
//           // Clear cookies
//           document.cookie = "access_token=; path=/; max-age=0";
//           document.cookie = "refresh_token=; path=/; max-age=0";
//           router.push("/login");
//         } else {
//           Swal.fire({
//             title: "Error",
//             text: result.message || "Failed to create admin.",
//             icon: "error",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Create admin error:", error);
//       Swal.fire({
//         title: "Server Error",
//         text: "Something went wrong!",
//         icon: "error",
//       });
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center px-4 py-10">
      
//       {/* Title Section */}
//       <div className="w-full max-w-4xl mb-8">
//         <h1 className="text-3xl font-bold text-green-800">Create Admin</h1>
//         <p className="text-gray-600">
//           Add a new admin to the Smart Learning – MCQ Analysis system.
//         </p>
//       </div>

//       {/* Form Card */}
//       <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-green-200">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
          
//           {/* Full Name */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <User2 className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Enter full name"
//                 {...register("name", { required: "Name is required" })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 focus:outline-none transition-colors ${
//                   errors.name
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.name && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors?.name?.message as string}
//               </span>
//             )}
//           </div>

//           {/* Phone Number */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="01XXXXXXXXX"
//                 {...register("phone_number", {
//                   required: "Phone number is required",
//                   pattern: {
//                     value: /^01[0-9]{9}$/,
//                     message: "Invalid phone number format"
//                   },
//                   minLength: { value: 11, message: "Must be 11 digits" },
//                   maxLength: { value: 11, message: "Must be 11 digits" },
//                 })}
//                 maxLength={11}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 focus:outline-none transition-colors ${
//                   errors.phone_number
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.phone_number && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.phone_number.message as string}
//               </span>
//             )}
//           </div>

//           {/* Password */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: { value: 6, message: "Minimum 6 characters" },
//                 })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 focus:outline-none transition-colors ${
//                   errors.password
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.password && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.password.message as string}
//               </span>
//             )}
//           </div>

//           {/* Role Dropdown */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">
//               Select Role
//             </label>
//             <div className="relative">
//               <ShieldCheck className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10" />

//               <select
//                 {...register("role", { required: "Role is required" })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 appearance-none focus:outline-none transition-colors bg-white ${
//                   errors.role
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               >
//                 <option value="">Choose role</option>
//                 <option value={ROLES.FOUNDER}>Founder</option>
//                 <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
//                 <option value={ROLES.ADMIN}>Admin</option>
//                 <option value={ROLES.MODERATOR}>Moderator</option>
//               </select>
//             </div>

//             {errors.role && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.role.message as string}
//               </span>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="md:col-span-2 mt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white 
//               font-semibold py-3.5 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 
//               transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Admin"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useForm } from "react-hook-form";
import { Phone, User2, Lock, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENV } from "@/config/env";

// Roles Enum
export const ROLES = {
  FOUNDER: "founder",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

// 🌿 ZOD VALIDATION SCHEMA (Bengali Error Messages)
const AdminSchema = z.object({
  name: z
    .string()
    .min(3, "নামের কমপক্ষে ৩ অক্ষর হতে হবে")
    .nonempty("নাম প্রয়োজন"),

  phone_number: z
    .string()
    .length(11, "ফোন নম্বর অবশ্যই ১১ ডিজিট হতে হবে")
    .regex(/^01[0-9]{9}$/, "সঠিক বাংলাদেশি ফোন নম্বর লিখুন"),

  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে")
    .nonempty("পাসওয়ার্ড প্রয়োজন"),

  role: z.string().nonempty("অবশ্যই একটি রোল নির্বাচন করুন"),
});

type AdminFormType = z.infer<typeof AdminSchema>;

// COOKIE GETTER
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

  return null;
}

export default function CreateAdminForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormType>({
    resolver: zodResolver(AdminSchema),
    mode: "onChange",          // 🔥 Live validation
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: AdminFormType) => {
    try {
      const accessToken = getCookie("access_token");

      if (!accessToken) {
        Swal.fire({
          title: "অননুমোদিত অ্যাক্সেস",
          text: "আপনাকে আগে লগইন করতে হবে",
          icon: "warning",
        });
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${ENV.BASE_URL}/admin/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          body: JSON.stringify(data),
        }
      );



      const result = await res.json();
      console.log("Create Admin", result)
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Admin Create Successfully",
          icon: "success",
        });
        reset();
      } else {
        Swal.fire({
          title: "ত্রুটি",
          text: result.message || "অ্যাডমিন তৈরি করা যায়নি!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "সার্ভার ত্রুটি",
        text: "কিছু সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      {/* Title Section */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-green-800">Create Admin</h1>
        <p className="text-gray-600">
          Smart Learning – MCQ Analysis সিস্টেমে নতুন অ্যাডমিন যোগ করুন।
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-green-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NAME */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                placeholder="পূর্ণ নাম লিখুন"
                {...register("name")}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>

            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* PHONE NUMBER */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                maxLength={11}
                placeholder="01XXXXXXXXX"
                {...register("phone_number")}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.phone_number
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>

            {errors.phone_number && (
              <span className="text-red-500 text-sm">
                {errors.phone_number.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />

              <input
                type="password"
                placeholder="পাসওয়ার্ড লিখুন"
                {...register("password")}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>

            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* ROLE */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Select Role
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 text-gray-400" />

              <select
                {...register("role")}
                className={`w-full pl-10 p-3 rounded-xl border-2 bg-white ${
                  errors.role
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              >
                <option value="">রোল নির্বাচন করুন</option>
                <option value={ROLES.FOUNDER}>Founder</option>
                <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.MODERATOR}>Moderator</option>
              </select>
            </div>

            {errors.role && (
              <span className="text-red-500 text-sm">{errors.role.message}</span>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl shadow-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  তৈরি হচ্ছে...
                </>
              ) : (
                "Create Admin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}









