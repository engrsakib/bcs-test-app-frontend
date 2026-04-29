











"use client";

import { useForm } from "react-hook-form";
import { Phone, User2, Lock, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENV } from "@/config/env";

export const ROLES = {
  FOUNDER: "founder",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

const AdminSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .nonempty("Name is required"),

  phone_number: z
    .string()
    .length(11, "Phone number must be 11 digits")
    .regex(/^01[0-9]{9}$/, "Enter a valid Bangladeshi phone number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),

  role: z.string().nonempty("Please select a role"),
});

type AdminFormType = z.infer<typeof AdminSchema>;

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
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: AdminFormType) => {
    try {
      const accessToken = getCookie("access_token");

      if (!accessToken) {
        Swal.fire({
          title: "Unauthorized Access",
          text: "You need to log in first",
          icon: "warning",
        });
        router.push("/login");
        return;
      }

      const res = await fetch(`${ENV.BASE_URL}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      // console.log("Create Admin", result);

      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Admin Create Successfully",
          icon: "success",
        });
        reset();
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to create admin!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Server Error",
        text: "Something went wrong, please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-green-800">Create Admin</h1>
        <p className="text-gray-600">
          Add a new admin to the Smart Learning – MCQ Analysis system.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-green-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter full name"
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

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
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
                <option value="">Select role</option>
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

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl shadow-lg hover:bg-teal-700 transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
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