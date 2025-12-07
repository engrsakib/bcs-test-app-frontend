


"use client";
import React, { useState, useEffect } from 'react';
import { User, Edit2, Phone, Briefcase, FileText, Shield, Calendar, X } from 'lucide-react';
import { ENV } from '@/config/env';

interface AdminData {
  _id: string;
  name: string;
  phone_number: string;
  is_Deleted: boolean;
  permissions: string[];
  designation: string;
  bio: string;
  role: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  designation: string;
  phone_number: string;
  role: string;
  bio: string;
  image: string;
}

// profile
export default function AdminProfile() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    designation: '',
    phone_number: '',
    role: '',
    bio: '',
    image: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(`${ENV.BASE_URL}/admin/auth`, {
        credentials: "include",
        headers: {
          'Authorization': accessToken || '',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log("Admin Profile", result);
      
      if (result.success) {
        setAdminData(result.data);
        setFormData({
          name: result.data.name,
          designation: result.data.designation,
          phone_number: result.data.phone_number,
          role: result.data.role,
          bio: result.data.bio,
          image: result.data.image
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (): Promise<void> => {
    setUpdating(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(`https://mcq-analysis.vercel.app/api/v1/admin/update-staff/${adminData?._id}`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Authorization': accessToken || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setAdminData(result.data);
        setIsModalOpen(false);
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'yt_new');
      formDataUpload.append('cloud_name', 'drbq8i19k');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drbq8i19k/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setFormData({ ...formData, image: data.secure_url });
        console.log('Image uploaded successfully:', data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Section */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-green-800 to-green-600"></div>
          
          {/* Profile Info Section */}
          <div className="relative px-6 sm:px-8 pb-8">
            {/* Profile Image */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
              <div className="relative">
                <img
                  src={adminData?.image || 'https://via.placeholder.com/150'}
                  alt={adminData?.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-800 text-white p-2 rounded-full shadow-lg">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left translate-y-6">
                <h2 className="text-2xl   sm:text-3xl font-bold text-gray-900">{adminData?.name}</h2>
                <p className="text-green-800 font-medium text-lg capitalize">{adminData?.role?.replace('_', ' ')}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    adminData?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {adminData?.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 sm:mt-0 bg-green-800 hover:bg-green-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                <span className="font-medium">Edit Profile</span>
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-gray-900 font-medium">{adminData?.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="text-gray-900 font-medium">{adminData?.designation || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="text-gray-900 font-medium">{adminData?.createdAt ? formatDate(adminData.createdAt) : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Biography</h3>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {adminData?.bio || 'No biography provided yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Permissions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {adminData?.permissions && Array.isArray(adminData.permissions) && adminData.permissions.length > 0 ? (
                  adminData.permissions.map((permission: string, index: number) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
                    >
                      {permission.replace(/_/g, ' ')}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center py-4">No permissions available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Update Profile</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2  ">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="mb-3">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover border-2 border-green-200"
                    />
                  </div>
                )}

                {/* File Upload */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Manual URL Input */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Or paste image URL"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="flex-1 px-6 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






