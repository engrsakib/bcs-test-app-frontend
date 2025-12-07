
// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Video,
//   Link as LinkIcon,
//   Image as ImageIcon,
//   ToggleLeft,
//   ToggleRight,
//   Save,
//   X,
//   Upload,
// } from "lucide-react";
// import Swal from "sweetalert2";

// export default function CreateVideo() {


//   const router = useRouter();
// // const CLOUD_NAME = "drbq8i19k";   // তোমার Cloudinary cloud name
// const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!; // তোমার Cloudinary cloud name
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;


//   const [uploading, setUploading] = useState(false);

//   const [formData, setFormData] = useState({
//     videoLink: "",
//     title: "",
//     description: "",
//     thumbnailLink: "",
//     isPublished: false,
//   });

//   const [errors, setErrors] = useState({
//     videoLink: "",
//     title: "",
//     thumbnailLink: "",
//   });

//   // Validate YT
//   const isValidYouTubeUrl = (url: string) => {
//     const youtubeRegex =
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
//     return youtubeRegex.test(url);
//   };

//   // Handle input
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name as keyof typeof errors]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Publish toggle
//   const handleToggle = () => {
//     setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
//   };

// const handleFileUpload = async (e: any) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   setUploading(true);

//   const form = new FormData();
//   form.append("file", file);
//   form.append("upload_preset", UPLOAD_PRESET);

//   try {
//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
//       {
//         method: "POST",
//         body: form,
//       }
//     );

//     const data = await res.json();
//     console.log("From Created Youtube:", data);

//     if (!data.secure_url) {
//       throw new Error(data.error?.message || "Upload failed");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       thumbnailLink: data.secure_url,
//     }));

//     Swal.fire({
//       icon: "success",
//       title: "Thumbnail Uploaded!",
//       confirmButtonColor: "#16a34a",
//     });
//   } catch (error: any) {
//     Swal.fire({
//       icon: "error",
//       title: "Upload Failed!",
//       text: error.message,
//     });
//   } finally {
//     setUploading(false);
//   }
// };




//   // Validate form
//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {
//       videoLink: "",
//       title: "",
//       thumbnailLink: "",
//     };

//     if (!formData.videoLink.trim()) {
//       newErrors.videoLink = "YouTube video link is required";
//       isValid = false;
//     } else if (!isValidYouTubeUrl(formData.videoLink)) {
//       newErrors.videoLink = "Please enter a valid YouTube URL";
//       isValid = false;
//     }

//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//       isValid = false;
//     } else if (formData.title.trim().length < 5) {
//       newErrors.title = "Title must be at least 5 characters";
//       isValid = false;
//     }

//     if (!formData.thumbnailLink.trim()) {
//       newErrors.thumbnailLink = "Thumbnail is required (upload first)";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Thumbnail preview
//   const thumbnailPreview = useMemo(() => {
//     if (formData.thumbnailLink) return formData.thumbnailLink;
//     return null;
//   }, [formData.thumbnailLink]);

//   // Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "Fix the errors before submitting",
//         confirmButtonColor: "#16a34a",
//       });
//       return;
//     }

//     Swal.fire({
//       title: "Creating Video...",
//       text: "Please wait",
//       allowOutsideClick: false,
      
//     });

//     try {
//       console.log("=== FINAL VIDEO DATA ===");
//       console.log(formData);

//       Swal.close();

//       Swal.fire({
//         icon: "success",
//         title: "Video Created!",
//         confirmButtonColor: "#16a34a",
//       }).then(() => router.push("/dashboard/youtube/view-video"));
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         confirmButtonColor: "#16a34a",
//       });
//     }
//   };

//   // Reset
//   const handleReset = () => {
//     setFormData({
//       videoLink: "",
//       title: "",
//       description: "",
//       thumbnailLink: "",
//       isPublished: false,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="bg-white rounded-xl shadow p-6 mb-4 border border-gray-200">
//           <div className="flex gap-3 items-center">
//             <div className="w-12 h-12 bg-green-800 rounded-xl flex justify-center items-center">
//               <Video className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold">Create YouTube Video</h1>
//               <p className="text-sm text-gray-600">Add a new video</p>
//             </div>
//           </div>
//         </div>

//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl shadow p-6 border border-gray-200 space-y-6"
//         >

//           {/* YouTube Link */}
//           <div>
//             <label className="flex items-center gap-2 mb-2 font-semibold">
//               <LinkIcon className="w-4 h-4 text-green-800" />
//               YouTube Video Link *
//             </label>
//             <input
//               type="text"
//               name="videoLink"
//               value={formData.videoLink}
//               onChange={handleChange}
//               placeholder="https://youtube.com/watch?v=..."
//               className={`w-full px-4 py-3 border rounded-lg ${
//                 errors.videoLink ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.videoLink && (
//               <p className="text-red-600 text-sm mt-1">{errors.videoLink}</p>
//             )}
//           </div>

//           {/* Title */}
//           <div>
//             <label className="flex items-center gap-2 mb-2 font-semibold">
//               <Video className="w-4 h-4 text-green-800" />
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Video title"
//               className={`w-full px-4 py-3 border rounded-lg ${
//                 errors.title ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.title && (
//               <p className="text-red-600 text-sm mt-1">{errors.title}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="font-semibold mb-2 block">
//               Description (Optional)
//             </label>
//             <textarea
//               name="description"
//               rows={4}
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border rounded-lg border-gray-300"
//             ></textarea>
//           </div>

//           {/* CLOUDINARY UPLOAD */}
//           <div>
//             <label className="flex items-center gap-2 font-semibold mb-2">
//               <ImageIcon className="w-4 h-4 text-green-800" />
//               Thumbnail Image *
//             </label>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="thumbnailUpload"
//             />

//             <label
//               htmlFor="thumbnailUpload"
//               className="cursor-pointer inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-lg"
//             >
//               <Upload className="w-5 h-5" />
//               {uploading ? "Uploading..." : "Upload Thumbnail"}
//             </label>

//             {errors.thumbnailLink && (
//               <p className="text-red-600 text-sm mt-1">
//                 {errors.thumbnailLink}
//               </p>
//             )}

//             {thumbnailPreview && (
//               <img
//                 src={thumbnailPreview}
//                 className="w-full max-w-xs mt-4 rounded-lg border border-gray-300"
//               />
//             )}
//           </div>

//           {/* Publish Toggle */}
//           <div className="flex items-center justify-between bg-gray-50 p-4 border border-gray-300 rounded-lg">
//             <div className="flex items-center gap-3">
//               {formData.isPublished ? (
//                 <ToggleRight className="w-6 h-6 text-green-800" />
//               ) : (
//                 <ToggleLeft className="w-6 h-6 text-gray-500" />
//               )}
//               <div>
//                 <p className="font-semibold">Publish Status</p>
//                 <p className="text-sm text-gray-600">
//                   {formData.isPublished ? "Public" : "Hidden"}
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleToggle}
//               className={`h-8 w-14 rounded-full flex items-center transition ${
//                 formData.isPublished ? "bg-green-700" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`h-6 w-6 bg-white rounded-full transform transition ${
//                   formData.isPublished ? "translate-x-7" : "translate-x-1"
//                 }`}
//               ></span>
//             </button>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-4 border-t border-gray-300">
//             <button
//               type="submit"
//               className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-600"
//             >
//               Create Video
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
//             >
//               Reset Form
//             </button>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// }












"use client";

import { ENV } from '@/config/env';
import getCookie from '@/util/GetCookie';
import { AlignLeft, Bold, Italic, Underline, List, ListOrdered, Type, FileText, Upload, X, Loader2, CheckCircle } from 'lucide-react';
import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';

export default function CreateGuideline() {
  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    thumbnail_url: '',
    description: '',
    is_published: true
  });

  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const handleInputChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const applyTextFormat = (command:any, value = null) => {
    document.execCommand(command, false, value as any);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, description: htmlContent }));
    }
  };

  const handleThumbnailUpload = async (e:any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 10MB',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', UPLOAD_PRESET);
      uploadData.append('cloud_name', CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: uploadData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        thumbnail_url: data.secure_url
      }));
      setThumbnailPreview(data.secure_url);

      Swal.fire({
        icon: 'success',
        title: 'Upload Success!',
        text: 'Thumbnail uploaded successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.',
        confirmButtonColor: '#0d9488'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
    setThumbnailPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Title',
        text: 'Please enter a title',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!formData.video_url.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Video URL',
        text: 'Please enter a video URL',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Description',
        text: 'Please enter a description',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch(`${ENV.BASE_URL}/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getCookie('access_token') || ''
        },
        body: JSON.stringify(formData)
      });

      const checkedData = await response.clone().json().catch(() => ({}));
      console.log('Response Data:', checkedData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create guideline');
      }

      const result = await response.json();
      console.log('Success:', result);
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'YouTube video created successfully',
        confirmButtonColor: '#0d9488',
        timer: 3000
      });
      
      handleReset();
      
    } catch (error) {
      console.error('Error creating guideline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create video. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: errorMessage,
        confirmButtonColor: '#0d9488'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      video_url: '',
      thumbnail_url: '',
      description: '',
      is_published: true
    });
    setThumbnailPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-t-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Create YouTube Video</h1>
              <p className="text-teal-50 text-sm sm:text-base mt-1">MCQ Application Guidelines Setup</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4 flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">YouTube video created successfully!</span>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 sm:p-8 space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <Type className="w-5 h-5 text-teal-600" />
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter guideline title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <FileText className="w-5 h-5 text-teal-600" />
              Video URL *
            </label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <Upload className="w-5 h-5 text-teal-600" />
              Thumbnail Image
            </label>
            
            {!thumbnailPreview ? (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 transition-all ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-2" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <FileText className="w-5 h-5 text-teal-600" />
              Status
            </label>
            <select
              name="is_published"
              value={formData.is_published ? 'true' : 'false'}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.value === 'true' }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white transition-all"
            >
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>

          {/* Description with Rich Text Editor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <AlignLeft className="w-5 h-5 text-teal-600" />
              Description *
            </label>

            {/* Toolbar */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-t-xl p-3 flex flex-wrap gap-2">
              <button 
                type="button" 
                onClick={() => applyTextFormat('bold')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => applyTextFormat('italic')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => applyTextFormat('underline')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-5 h-5" />
              </button>
              <div className="w-px bg-gray-300 mx-2"></div>
              <button 
                type="button" 
                onClick={() => applyTextFormat('insertUnorderedList')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                title="Bullet List"
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => applyTextFormat('insertOrderedList')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-5 h-5" />
              </button>
            </div>

            {/* Rich Text Editor Box */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="w-full min-h-[200px] px-4 py-3 border-2 border-t-0 border-gray-200 rounded-b-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
              data-placeholder="Write your guideline description here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Guideline'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="sm:w-32 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>


      </div>
      
      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contentEditable]:focus {
          outline: none;
        }
        [contentEditable] strong {
          font-weight: bold;
        }
        [contentEditable] em {
          font-style: italic;
        }
        [contentEditable] u {
          text-decoration: underline;
        }
        [contentEditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        [contentEditable] ol {
          list-style-type: decimal;
          margin-left: 20px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        [contentEditable] li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}