// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Mail, Lock, Eye, EyeOff, Home, UserPlus, AlertCircle, User } from 'lucide-react';
// import Link from 'next/link';

// const Register: React.FC = () => {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState<{
//     name?: string;
//     email?: string;
//     password?: string;
//     confirmPassword?: string;
//   }>({});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name as keyof typeof errors]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: {
//       name?: string;
//       email?: string;
//       password?: string;
//       confirmPassword?: string;
//     } = {};
    
//     // Name validation
//     if (!formData.name) {
//       newErrors.name = 'Name is required';
//     } else if (formData.name.length < 3) {
//       newErrors.name = 'Name must be at least 3 characters';
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
//     const colors = {
//       success: 'linear-gradient(135deg, #10b981, #059669)',
//       error: 'linear-gradient(135deg, #ef4444, #dc2626)',
//       info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
//     };

//     const icons = {
//       success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
//       error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
//       info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
//     };

//     const alertDiv = document.createElement('div');
//     alertDiv.innerHTML = `
//       <div style="position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999; animation: slideIn 0.3s ease-out;">
//         <div style="display: flex; align-items: center; gap: 12px;">
//           <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//             ${icons[type]}
//           </svg>
//           <span style="font-weight: 600;">${message}</span>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(alertDiv);
//     setTimeout(() => alertDiv.remove(), 3000);
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       console.log('Register Data:', {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         timestamp: new Date().toISOString()
//       });

//       showAlert('success', 'Registration Successful!');
      
//       setFormData({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//       });

//       // Navigate to login after successful registration
//       setTimeout(() => {
//         router.push('/dashboard/login');
//       }, 1500);
//     } else {
//       showAlert('error', 'Please fix the errors!');
//     }
//   };

//   const handleBackToHome = () => {
//     console.log('Navigating to home...');
//     router.push('/');
//   };

//   const handleGoToLogin = () => {
//     console.log('Navigate to login page');
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
//       <style>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
      
    

//       <div className="relative w-full max-w-md">
//         <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
//         <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

//         <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
//           <div className="relative h-32 bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 flex items-center justify-center overflow-hidden">
//             <div className="absolute inset-0 bg-black opacity-10"></div>
//             <div className="absolute top-0 left-0 w-full h-full">
//               <div className="absolute top-3 left-4 w-12 h-12 border-2 border-white/20 rounded-full"></div>
//               <div className="absolute bottom-3 right-6 w-16 h-16 border-2 border-white/20 rounded-full"></div>
//             </div>
            
//             <div className="relative z-10 text-center">
//               <UserPlus className="w-12 h-12 text-white mx-auto mb-2" strokeWidth={2} />
//               <h2 className="text-2xl font-bold text-white">Register</h2>
//               <p className="text-green-100 text-sm mt-1">BCS Exam Portal</p>
//             </div>
//           </div>

//           <div className="p-8">
//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <User className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className={`w-full pl-12 pr-4 py-3 border-2 ${
//                       errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
//                     } rounded-xl focus:outline-none transition-colors`}
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//                 {errors.name && (
//                   <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{errors.name}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Mail className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`w-full pl-12 pr-4 py-3 border-2 ${
//                       errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
//                     } rounded-xl focus:outline-none transition-colors`}
//                     placeholder="your.email@example.com"
//                   />
//                 </div>
//                 {errors.email && (
//                   <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{errors.email}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Lock className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`w-full pl-12 pr-12 py-3 border-2 ${
//                       errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
//                     } rounded-xl focus:outline-none transition-colors`}
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{errors.password}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Lock className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className={`w-full pl-12 pr-4 py-3 border-2 ${
//                       errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
//                     } rounded-xl focus:outline-none transition-colors`}
//                     placeholder="Confirm your password"
//                   />
//                 </div>
//                 {errors.confirmPassword && (
//                   <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{errors.confirmPassword}</span>
//                   </div>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 <UserPlus className="w-5 h-5" />
//                 <span>Register</span>
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Already have an account?
//              <Link href="/dashboard/login">
//                 <button
//                   onClick={handleGoToLogin}
//                   className="ml-2 text-green-700 hover:text-green-800 font-semibold hover:underline transition-colors"
//                 >
//                   Login
//                 </button>
//              </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;




















"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Lock, Eye, EyeOff, FileImage, UserCog } from "lucide-react";

const ROLES = ["founder", "super_admin", "admin", "moderator"];

const Register: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    password: "",
    bio: "",
    role: "",
    image: ""
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };


  const BASE_URL = process.env.
NEXT_PUBLIC_BASE_URL!;

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.phone_number) newErrors.phone_number = "Phone number is required";
    else if (formData.phone_number.length < 8) newErrors.phone_number = "Invalid phone number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!formData.role) newErrors.role = "Please select a role";

    if (!formData.image) newErrors.image = "Image upload required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageToCloudinary = async (file: File) => {
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const UPLOAD_PRESET= process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    return result.secure_url;
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImageToCloudinary(file);

    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      phone_number: formData.phone_number,
      password: formData.password,
      bio: formData.bio,
      role: formData.role,
      image: formData.image
    };

    console.log("Sending Payload:", payload);

    const res = await fetch(`${BASE_URL}/admin/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Admin created successfully!");
      router.push("/dashboard/login");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-green-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        
        <h2 className="text-2xl font-bold text-center mb-6">Create Admin Account</h2>

        {/* Name */}
        <InputField
          icon={<User />}
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />

        {/* Phone Number */}
        <InputField
          icon={<Phone />}
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          error={errors.phone_number}
        />

        {/* Bio */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Bio (optional)</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full border rounded-xl p-3 mt-1"
            placeholder="Short bio..."
          />
        </div>

        {/* Role Select */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Select Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full border rounded-xl p-3 mt-1"
          >
            <option value="">Choose Role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        {/* Password */}
        <PasswordField
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
        />

        {/* Image Upload */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Profile Image</label>
          <input type="file" onChange={handleImageChange} className="mt-2" />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          {formData.image && (
            <img src={formData.image} alt="preview" className="mt-3 w-24 h-24 rounded-lg object-cover" />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 mt-6 rounded-xl font-semibold"
        >
          Create Admin
        </button>
      </div>
    </div>
  );
};

export default Register;

/* ——————————— Helper Components ——————————— */

const InputField = ({ icon, label, name, value, onChange, error }: any) => (
  <div className="mt-4">
    <label className="text-sm font-semibold">{label}</label>
    <div className="relative mt-1">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl pl-10 p-3"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const PasswordField = ({ showPassword, setShowPassword, value, onChange, error }: any) => (
  <div className="mt-4">
    <label className="text-sm font-semibold">Password</label>
    <div className="relative mt-1">
      <span className="absolute left-3 top-3 text-gray-400">
        <Lock />
      </span>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl pl-10 p-3 pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
