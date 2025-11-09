"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Home, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    const colors = {
      success: 'linear-gradient(135deg, #10b981, #059669)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };

    const icons = {
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
    };

    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999; animation: slideIn 0.3s ease-out;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${icons[type]}
          </svg>
          <span style="font-weight: 600;">${message}</span>
        </div>
      </div>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Login Data:', {
        email: formData.email,
        password: formData.password,
        timestamp: new Date().toISOString()
      });

      showAlert('success', 'Login Successful!');
      
      setFormData({
        email: '',
        password: ''
      });

      // Navigate to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      showAlert('error', 'Please fix the errors!');
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    showAlert('info', 'Password reset link sent to your email!');
  };

  const handleBackToHome = () => {
    console.log('Navigating to home...');
    router.push('/');
  };

  const handleGoToRegister = () => {
    console.log('Navigate to register page');
    router.push('/register');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group z-50"
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Home</span>
      </button>

      <div className="relative w-full max-w-md">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-3 left-4 w-12 h-12 border-2 border-white/20 rounded-full"></div>
              <div className="absolute bottom-3 right-6 w-16 h-16 border-2 border-white/20 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <LogIn className="w-12 h-12 text-white mx-auto mb-2" strokeWidth={2} />
              <h2 className="text-2xl font-bold text-white">Login</h2>
              <p className="text-green-100 text-sm mt-1">BCS Exam Portal</p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    } rounded-xl focus:outline-none transition-colors`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    } rounded-xl focus:outline-none transition-colors`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-700 hover:text-green-800 font-semibold hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?
          <Link href="/dashboard/auth/register">
               <button
                
                  className="ml-2 text-green-700 hover:text-green-800 font-semibold hover:underline transition-colors"
                >
                  Register
                </button>
          </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;