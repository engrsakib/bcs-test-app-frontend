// "use client";

// import { useForm } from "react-hook-form";
// import { Phone, User2, Lock, ShieldCheck } from "lucide-react";
// import Swal from "sweetalert2";

// export default function CreateAdminForm() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const onSubmit = async (data: any) => {
//     try {
//       const res = await fetch(
//         "https://mcq-analysis.vercel.app/api/v1/admin/create",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         }
//       );

//       const result = await res.json();
//       console.log("From CreateAdmin", result)

//       if (result.success) {
//         Swal.fire("Success!", "Admin Created Successfully.", "success");
//         reset();
//       } else {
//         Swal.fire("Error", result.message || "Failed to create admin.", "error");
//       }
//     } catch (error) {
//       Swal.fire("Server Error", "Something went wrong!", "error");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center px-4 py-10">
      
//       {/* Title Section */}
//       <div className="w-full max-w-4xl mb-8">
//         <h1 className="text-3xl font-bold text-green-800">Create Admin</h1>
//         <p className="text-gray-600">
//           Add a new admin to the Smart Learning – MCQ Analysis system
//         </p>
//       </div>

//       {/* Form Card */}
//       <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-green-200">
//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           {/* Name */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">Full Name</label>
//             <div className="relative">
//               <User2 className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Enter full name"
//                 {...register("name", { required: "Name is required" })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 ${
//                   errors.name
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.name && (
//               <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
//             )}
//           </div>

//           {/* Phone Number */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">Phone Number</label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="01XXXXXXXXX"
//                 {...register("phone_number", {
//                   required: "Phone number is required",
//                   minLength: { value: 11, message: "Invalid phone number" },
//                 })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 ${
//                   errors.phone_number
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.phone_number && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.phone_number.message}
//               </span>
//             )}
//           </div>

//           {/* Password */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: { value: 6, message: "Minimum 6 characters" },
//                 })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 ${
//                   errors.password
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               />
//             </div>
//             {errors.password && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </span>
//             )}
//           </div>

//           {/* Role */}
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-2">Role</label>
//             <div className="relative">
//               <ShieldCheck className="absolute left-3 top-3 text-gray-400" />
//               <select
//                 {...register("role", { required: "Role is required" })}
//                 className={`w-full pl-10 p-3 rounded-xl border-2 appearance-none ${
//                   errors.role
//                     ? "border-red-300 focus:border-red-500"
//                     : "border-gray-200 focus:border-green-500"
//                 }`}
//               >
//                 <option value="">Select role</option>
//                 <option value="user">User (Normal Admin)</option>
//                 <option value="super_admin">Super Admin</option>
//               </select>
//             </div>
//             {errors.role && (
//               <span className="text-red-500 text-sm mt-1">
//                 {errors.role.message}
//               </span>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="md:col-span-2 mt-4">
//             <button
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white 
//               font-semibold py-3.5 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 
//               transition-all"
//             >
//               {isSubmitting ? "Creating..." : "Create Admin"}
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

// Roles Enum
export const ROLES = {
  FOUNDER: "founder",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function CreateAdminForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(
        `${BASE_URL}/admin/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      console.log("CreateAdmin from", result)

      if (result.success) {
        Swal.fire(
          "Success!",
          "Admin Created Successfully. Verification OTP Sent.",
          "success"
        );
        reset();
      } else {
        Swal.fire("Error", result.message || "Failed to create admin.", "error");
      }
    } catch (error) {
      Swal.fire("Server Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      
      {/* Title Section */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-green-800">Create Admin</h1>
        <p className="text-gray-600">
          Add a new admin to the Smart Learning – MCQ Analysis system.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-green-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">
                {errors?.name?.message as string}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                {...register("phone_number", {
                  required: "Phone number is required",
                  minLength: { value: 11, message: "Invalid phone number" },
                })}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.phone_number
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>
            {errors.phone_number && (
              <span className="text-red-500 text-sm mt-1">
                {errors.phone_number.message as string}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className={`w-full pl-10 p-3 rounded-xl border-2 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message as string}
              </span>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Select Role
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 text-gray-400" />

              <select
                {...register("role", { required: "Role is required" })}
                className={`w-full pl-10 p-3 rounded-xl border-2 appearance-none ${
                  errors.role
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              >
                <option value="">Choose role</option>
                <option value={ROLES.FOUNDER}>Founder</option>
                <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.MODERATOR}>Moderator</option>
              </select>
            </div>

            {errors.role && (
              <span className="text-red-500 text-sm mt-1">
                {errors.role.message as string}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white 
              font-semibold py-3.5 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 
              transition-all"
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
