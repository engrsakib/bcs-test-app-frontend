





// "use client";

// import React, { useState } from 'react';
// import { FileText, Calendar, Clock, Tag, AlignLeft, Type, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
// import Swal from 'sweetalert2';

// const CreateGuideline = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     date: new Date().toISOString().split('T')[0],
//     time: new Date().toTimeString().split(' ')[0].slice(0, 5),
//     category: '',
//     status: 'published', 
//     description: ''
//   });

//   const [textStyle, setTextStyle] = useState({
//     bold: false,
//     italic: false,
//     underline: false
//   });

//   const handleInputChange = (e:any) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const applyTextStyle = (style: 'bold' | 'italic' | 'underline') => {
//     setTextStyle(prev => ({
//       ...prev,
//       [style]: !prev[style]
//     }));
//   };

//   const handleDescriptionChange = (e:any) => {
//     setFormData(prev => ({
//       ...prev,
//       description: e.target.value
//     }));
//   };

//   const handleSubmit = () => {
//     // Validation
//     if (!formData.title.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Title Required',
//         text: 'Please enter a title for the guideline',
//         confirmButtonColor: '#0d9488'
//       });
//       return;
//     }

//     if (!formData.category) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Category Required',
//         text: 'Please select a category',
//         confirmButtonColor: '#0d9488'
//       });
//       return;
//     }

//     if (!formData.description.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Description Required',
//         text: 'Please enter a description',
//         confirmButtonColor: '#0d9488'
//       });
//       return;
//     }

//     console.log('=== FORM DATA FOR BACKEND ===');
//     console.log({
//       title: formData.title,
//       date: formData.date,
//       time: formData.time,
//       dateTime: `${formData.date} ${formData.time}`,
//       category: formData.category,
//       status: formData.status, // ✅ Added status
//       description: formData.description,
//       textFormatting: textStyle
//     });
//     console.log('============================');

//     // Success SweetAlert
//     Swal.fire({
//       icon: 'success',
//       title: 'Guideline Created!',
//       text: `"${formData.title}" has been ${formData.status === 'published' ? 'published' : 'saved as draft'}`,
//       confirmButtonColor: '#0d9488',
//       confirmButtonText: 'OK'
//     });

//     // Optional: Reset form after success
//     // handleReset();
//   };

//   const handleReset = () => {
//     Swal.fire({
//       title: 'Reset Form?',
//       text: 'Are you sure you want to reset all fields?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#0d9488',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, reset!',
//       cancelButtonText: 'Cancel'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setFormData({
//           title: '',
//           date: new Date().toISOString().split('T')[0],
//           time: new Date().toTimeString().split(' ')[0].slice(0, 5),
//           category: '',
//           status: 'published',
//           description: ''
//         });
//         setTextStyle({ bold: false, italic: false, underline: false });
        
//         Swal.fire({
//           icon: 'success',
//           title: 'Form Reset!',
//           text: 'All fields have been cleared',
//           confirmButtonColor: '#0d9488',
//           timer: 1500
//         });
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-t-2xl p-6 sm:p-8 shadow-lg">
//           <div className="flex items-center gap-3">
//             <div className="bg-white bg-opacity-20 p-3 rounded-full">
//               <FileText className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Guideline</h1>
//               <p className="text-teal-50 text-sm sm:text-base mt-1">MCQ Application Guidelines Setup</p>
//             </div>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="bg-white rounded-b-2xl shadow-xl p-6 sm:p-8 space-y-6">
//           {/* Title Field */}
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//               <Type className="w-5 h-5 text-teal-600" />
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Enter guideline title"
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//             />
//           </div>

//           {/* Date and Time Row */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//                 <Calendar className="w-5 h-5 text-teal-600" />
//                 Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//                 <Clock className="w-5 h-5 text-teal-600" />
//                 Time
//               </label>
//               <input
//                 type="time"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Category and Status Row */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Category Field */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//                 <Tag className="w-5 h-5 text-teal-600" />
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
//               >
//                 <option value="">Select category</option>
//                 <option value="general">General Guidelines</option>
//                 <option value="exam">Exam Guidelines</option>
//                 <option value="mcq">MCQ Guidelines</option>
//                 <option value="rules">Rules & Regulations</option>
//                 <option value="instructions">Instructions</option>
//               </select>
//             </div>

//             {/* ✅ Active Status Field */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//                 <FileText className="w-5 h-5 text-teal-600" />
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
//               >
//                 <option value="published">Published</option>
//                 <option value="unpublished">Unpublished</option>
//               </select>
//             </div>
//           </div>

//           {/* Description Field with Text Editor */}
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
//               <AlignLeft className="w-5 h-5 text-teal-600" />
//               Description
//             </label>
            
//             {/* Text Editor Toolbar */}
//             <div className="bg-gray-50 border-2 border-gray-200 rounded-t-xl p-2 sm:p-3 flex flex-wrap gap-2">
//               <button
//                 type="button"
//                 onClick={() => applyTextStyle('bold')}
//                 className={`p-2 rounded-lg transition-all ${
//                   textStyle.bold 
//                     ? 'bg-teal-600 text-white' 
//                     : 'bg-white text-gray-600 hover:bg-gray-100'
//                 }`}
//                 title="Bold"
//               >
//                 <Bold className="w-5 h-5" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyTextStyle('italic')}
//                 className={`p-2 rounded-lg transition-all ${
//                   textStyle.italic 
//                     ? 'bg-teal-600 text-white' 
//                     : 'bg-white text-gray-600 hover:bg-gray-100'
//                 }`}
//                 title="Italic"
//               >
//                 <Italic className="w-5 h-5" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyTextStyle('underline')}
//                 className={`p-2 rounded-lg transition-all ${
//                   textStyle.underline 
//                     ? 'bg-teal-600 text-white' 
//                     : 'bg-white text-gray-600 hover:bg-gray-100'
//                 }`}
//                 title="Underline"
//               >
//                 <Underline className="w-5 h-5" />
//               </button>
//               <div className="w-px bg-gray-300 mx-1"></div>
//               <button
//                 type="button"
//                 className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-all"
//                 title="Bullet List"
//               >
//                 <List className="w-5 h-5" />
//               </button>
//               <button
//                 type="button"
//                 className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-all"
//                 title="Numbered List"
//               >
//                 <ListOrdered className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Text Area */}
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleDescriptionChange}
//               placeholder="Write your guideline description here..."
//               rows={8}
//               className={`w-full px-4 py-3 border-2 border-t-0 border-gray-200 rounded-b-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none
//                 ${textStyle.bold ? 'font-bold' : ''}
//                 ${textStyle.italic ? 'italic' : ''}
//                 ${textStyle.underline ? 'underline' : ''}
//               `}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               Create Guideline
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="sm:w-32 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Info Card */}
//         <div className="mt-6 bg-teal-50 border-2 border-teal-200 rounded-xl p-4 sm:p-6">
//           <div className="flex gap-3">
//             <div className="flex-shrink-0">
//               <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold text-teal-900 mb-1">Guideline Status</h3>
//               <p className="text-sm text-teal-700">
//                 <strong>Published:</strong> Guideline will be visible to users immediately.<br/>
//                 <strong>Unpublished:</strong> Guideline will be saved as draft and not visible to users.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateGuideline;













"use client";

import React, { useState } from 'react';
import { 
  FileText, Tag, AlignLeft, Type,
  Bold, Italic, Underline, Image as ImageIcon, Upload, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { ENV } from '@/config/env';
import getCookie from '@/util/GetCookie';

// BACKEND ENUMS
const GUIDELINE_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  ADMIN_APPROVAL: "admin_approval",
};

const GUIDELINE_CATEGORY = {
  GENERAL: "general",
  TECHNICAL: "technical",
  EXAM: "exam",
  BCS_PREPARATION: "bcs_preparation",
  PRIMARY_TEACHER: "primary_teacher_preparation",
  TEACHER_NIBONDHON: "teacher_nibondhon_preparation",
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const CreateGuideline = () => {

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: GUIDELINE_STATUS.ACTIVE,
    description: "",
    thumbnail_url: "",
  });

  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e: any) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const applyTextStyle = (style: "bold" | "italic" | "underline") => {
    setTextStyle(prev => ({ ...prev, [style]: !prev[style] }));
  };

  // ============================================================
  // 🔥 CLOUDINARY UPLOADER
  // ============================================================
  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData(prev => ({ ...prev, thumbnail_url: data.secure_url }));

        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Thumbnail image uploaded successfully.",
          confirmButtonColor: "#10b981"
        });
      } else {
        Swal.fire("Upload Failed", "Cloudinary didn't return a valid image URL", "error");
      }

    } catch (error) {
      Swal.fire("Error", "Cloudinary upload failed", "error");
    }

    setUploading(false);
  };

  // ============================================================
  // 🔥 SUBMIT HANDLER
  // ============================================================
  const handleSubmit = async () => {
    
    if (!formData.title.trim()) return Swal.fire("Missing Title", "Please enter guideline title", "warning");
    if (!formData.category) return Swal.fire("Missing Category", "Please select a category", "warning");
    if (!formData.thumbnail_url.trim()) return Swal.fire("Missing Thumbnail", "Please upload a thumbnail image", "warning");
    if (!formData.description.trim()) return Swal.fire("Missing Description", "Please enter guideline description", "warning");

    setSubmitting(true);

    try {
      const res = await fetch(`${ENV.BASE_URL}/guideline/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("access_token") || "",
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Guideline Created Successfully!",
          text: data.message,
          confirmButtonColor: "#0d9488",
        });

        setFormData({
          title: "",
          category: "",
          status: GUIDELINE_STATUS.ACTIVE,
          description: "",
          thumbnail_url: "",
        });

      } else {
        Swal.fire("Error", data.message || "Failed to create guideline", "error");
      }

    } catch (error) {
      Swal.fire("Error", "Network or server error", "error");
    }

    setSubmitting(false);
  };

  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FileText className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Guideline</h1>
              <p className="text-teal-100">MCQ Application Guidelines Setup</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="bg-white p-8 rounded-b-2xl shadow-xl space-y-6">

          {/* TITLE */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <Type className="text-teal-600" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter guideline title"
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <Tag className="text-teal-600" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            >
              <option value="">Select category</option>
              {Object.entries(GUIDELINE_CATEGORY).map(([key, value]) => (
                <option key={value} value={value}>{value.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <FileText className="text-teal-600" /> Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            >
              {Object.entries(GUIDELINE_STATUS).map(([k, v]) => (
                <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          {/* THUMBNAIL UPLOADER */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <ImageIcon className="text-teal-600" /> Thumbnail Image
            </label>

            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2">
                <Upload size={18} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {uploading && (
                <span className="flex items-center gap-2 text-teal-600 font-medium">
                  <Loader2 className="animate-spin" size={18} /> Uploading...
                </span>
              )}
            </div>

            {formData.thumbnail_url && (
              <div className="mt-4">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail Preview"
                  className="w-48 h-32 object-cover rounded-xl shadow-md border"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex gap-2 text-gray-700 font-semibold">
              <AlignLeft className="text-teal-600" /> Description
            </label>

            <div className="flex gap-2 bg-gray-100 p-3 rounded-t-xl border">
              <button onClick={() => applyTextStyle("bold")} className="p-2"><Bold /></button>
              <button onClick={() => applyTextStyle("italic")} className="p-2"><Italic /></button>
              <button onClick={() => applyTextStyle("underline")} className="p-2"><Underline /></button>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={6}
              className={`w-full border rounded-b-xl p-4 mt-0
                ${textStyle.bold ? "font-bold" : ""}
                ${textStyle.italic ? "italic" : ""}
                ${textStyle.underline ? "underline" : ""}
              `}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold text-white 
              ${submitting ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}
            `}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Creating...
              </span>
            ) : (
              "Create Guideline"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreateGuideline;






