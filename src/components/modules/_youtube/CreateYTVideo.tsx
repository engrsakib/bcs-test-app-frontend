// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Video,
//   Link as LinkIcon,
//   Image,
//   ToggleLeft,
//   ToggleRight,
//   Save,
//   X,
// } from "lucide-react";
// import Swal from "sweetalert2";

// export default function CreateVideo() {
//   const router = useRouter();

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

//   // Validate YouTube URL
//   const isValidYouTubeUrl = (url: string) => {
//     const youtubeRegex =
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
//     return youtubeRegex.test(url);
//   };

//   // Validate Image URL
//   const isValidImageUrl = (url: string) => {
//     const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i;
//     return (
//       imageRegex.test(url) ||
//       url.includes("youtube.com") ||
//       url.includes("ytimg.com")
//     );
//   };

//   // Handle input change
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
//       newErrors.thumbnailLink = "Thumbnail link is required";
//       isValid = false;
//     } else if (!isValidImageUrl(formData.thumbnailLink)) {
//       newErrors.thumbnailLink = "Please enter a valid image URL";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Thumbnail preview
//   const thumbnailPreview = useMemo(() => {
//     if (formData.thumbnailLink && !errors.thumbnailLink) {
//       return formData.thumbnailLink;
//     }
//     return null;
//   }, [formData.thumbnailLink, errors.thumbnailLink]);

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "Please fix all errors before submitting",
//         confirmButtonColor: "#16a34a",
//       });
//       return;
//     }

//     await Swal.fire({
//       title: "Creating Video...",
//       text: "Please wait while we save your video",
//       allowOutsideClick: false,
     
//     });

//     try {
//       console.log("=== VIDEO DATA ===", formData);

//       await new Promise((r) => setTimeout(r, 1200));

//       Swal.fire({
//         icon: "success",
//         title: "Video Created Successfully!",
//         text: "Your video is now added",
//         confirmButtonColor: "#16a34a",
//         confirmButtonText: "View Videos",
//       }).then(() => router.push("/dashboard/youtube/view-video"));
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Something went wrong!",
//         confirmButtonColor: "#16a34a",
//       });
//     }
//   };

//   // Reset form
//   const handleReset = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will clear the entire form!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Reset",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setFormData({
//           videoLink: "",
//           title: "",
//           description: "",
//           thumbnailLink: "",
//           isPublished: false,
//         });
//         setErrors({
//           videoLink: "",
//           title: "",
//           thumbnailLink: "",
//         });

//         Swal.fire({
//           icon: "success",
//           title: "Form Reset",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="bg-white rounded-t-xl shadow-sm p-6 border border-gray-200">
//           <div className="flex gap-3 items-center">
//             <div className="w-12 h-12 bg-green-900 rounded-xl flex justify-center items-center shadow-lg">
//               <Video className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Create YouTube Video</h1>
//               <p className="text-sm text-gray-600">Add a new learning video</p>
//             </div>
//           </div>
//         </div>

//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-b-xl shadow-sm p-6 border border-gray-200 space-y-6"
//         >
//           {/* Video Link */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <LinkIcon className="w-4 h-4 text-green-900" />
//               YouTube Video Link <span className="text-green-900">*</span>
//             </label>

//             <input
//               type="text"
//               name="videoLink"
//               value={formData.videoLink}
//               onChange={handleChange}
//               placeholder="https://youtube.com/watch?v=..."
//               className={`w-full px-4 py-3 border rounded-lg bg-white ${
//                 errors.videoLink
//                   ? "border-red-500 bg-red-50"
//                   : "border-gray-300"
//               }`}
//             />

//             {errors.videoLink && (
//               <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                 <X className="w-4 h-4" /> {errors.videoLink}
//               </p>
//             )}
//           </div>

//           {/* Title */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Video className="w-4 h-4 text-green-900" />
//               Title <span className="text-green-900">*</span>
//             </label>

//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Video Title"
//               className={`w-full px-4 py-3 border rounded-lg bg-white ${
//                 errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
//               }`}
//             />

//             {errors.title && (
//               <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                 <X className="w-4 h-4" /> {errors.title}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm text-gray-700 font-semibold mb-2 block">
//               Description (Optional)
//             </label>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//               className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg"
//             />
//           </div>

//           {/* Thumbnail */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Image className="w-4 h-4 text-green-900" />
//               Thumbnail Link <span className="text-green-900">*</span>
//             </label>

//             <input
//               type="text"
//               name="thumbnailLink"
//               value={formData.thumbnailLink}
//               onChange={handleChange}
//               placeholder="https://example.com/image.jpg"
//               className={`w-full px-4 py-3 border rounded-lg bg-white ${
//                 errors.thumbnailLink
//                   ? "border-red-500 bg-red-50"
//                   : "border-gray-300"
//               }`}
//             />

//             {errors.thumbnailLink && (
//               <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                 <X className="w-4 h-4" /> {errors.thumbnailLink}
//               </p>
//             )}

//             {thumbnailPreview && (
//               <div className="mt-3 p-3 bg-gray-100 rounded-lg">
//                 <p className="text-xs text-gray-600 mb-2">Thumbnail Preview:</p>

//                 <img
//                   src={thumbnailPreview}
//                   className="w-full max-w-xs rounded-lg border border-gray-300"
//                   onError={(e) => {
//                     const img = e.target as HTMLImageElement;
//                     if (!img.src.includes("placeholder.com")) {
//                       img.src =
//                         "https://via.placeholder.com/320x180?text=Invalid+Image";
//                     }
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Publish Toggle */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
//             <div className="flex items-center gap-3">
//               {formData.isPublished ? (
//                 <ToggleRight className="w-6 h-6 text-green-900" />
//               ) : (
//                 <ToggleLeft className="w-6 h-6 text-gray-500" />
//               )}

//               <div>
//                 <p className="text-sm font-semibold text-gray-700">
//                   Publish Status
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {formData.isPublished ? "Public" : "Hidden"}
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleToggle}
//               className={`h-8 w-14 rounded-full flex items-center transition ${
//                 formData.isPublished ? "bg-green-600" : "bg-gray-300"
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
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-800 hover:bg-green-500 text-white rounded-lg shadow-md"
//             >
//               <Save className="w-5 h-5" />
//               Create Video
//             </button>

//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
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

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";

export default function CreateVideo() {


  const router = useRouter();
// const CLOUD_NAME = "drbq8i19k";   // তোমার Cloudinary cloud name
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!; // তোমার Cloudinary cloud name
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;


  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    videoLink: "",
    title: "",
    description: "",
    thumbnailLink: "",
    isPublished: false,
  });

  const [errors, setErrors] = useState({
    videoLink: "",
    title: "",
    thumbnailLink: "",
  });

  // Validate YT
  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Publish toggle
  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  };

const handleFileUpload = async (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();
    console.log("From Created Youtube:", data);

    if (!data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }

    setFormData((prev) => ({
      ...prev,
      thumbnailLink: data.secure_url,
    }));

    Swal.fire({
      icon: "success",
      title: "Thumbnail Uploaded!",
      confirmButtonColor: "#16a34a",
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Upload Failed!",
      text: error.message,
    });
  } finally {
    setUploading(false);
  }
};




  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      videoLink: "",
      title: "",
      thumbnailLink: "",
    };

    if (!formData.videoLink.trim()) {
      newErrors.videoLink = "YouTube video link is required";
      isValid = false;
    } else if (!isValidYouTubeUrl(formData.videoLink)) {
      newErrors.videoLink = "Please enter a valid YouTube URL";
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
      isValid = false;
    }

    if (!formData.thumbnailLink.trim()) {
      newErrors.thumbnailLink = "Thumbnail is required (upload first)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Thumbnail preview
  const thumbnailPreview = useMemo(() => {
    if (formData.thumbnailLink) return formData.thumbnailLink;
    return null;
  }, [formData.thumbnailLink]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Fix the errors before submitting",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    Swal.fire({
      title: "Creating Video...",
      text: "Please wait",
      allowOutsideClick: false,
      
    });

    try {
      console.log("=== FINAL VIDEO DATA ===");
      console.log(formData);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Video Created!",
        confirmButtonColor: "#16a34a",
      }).then(() => router.push("/dashboard/youtube/view-video"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#16a34a",
      });
    }
  };

  // Reset
  const handleReset = () => {
    setFormData({
      videoLink: "",
      title: "",
      description: "",
      thumbnailLink: "",
      isPublished: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-4 border border-gray-200">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-green-800 rounded-xl flex justify-center items-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create YouTube Video</h1>
              <p className="text-sm text-gray-600">Add a new video</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 border border-gray-200 space-y-6"
        >

          {/* YouTube Link */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <LinkIcon className="w-4 h-4 text-green-800" />
              YouTube Video Link *
            </label>
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.videoLink ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.videoLink && (
              <p className="text-red-600 text-sm mt-1">{errors.videoLink}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <Video className="w-4 h-4 text-green-800" />
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Video title"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold mb-2 block">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg border-gray-300"
            ></textarea>
          </div>

          {/* CLOUDINARY UPLOAD */}
          <div>
            <label className="flex items-center gap-2 font-semibold mb-2">
              <ImageIcon className="w-4 h-4 text-green-800" />
              Thumbnail Image *
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="thumbnailUpload"
            />

            <label
              htmlFor="thumbnailUpload"
              className="cursor-pointer inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-lg"
            >
              <Upload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Thumbnail"}
            </label>

            {errors.thumbnailLink && (
              <p className="text-red-600 text-sm mt-1">
                {errors.thumbnailLink}
              </p>
            )}

            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="w-full max-w-xs mt-4 rounded-lg border border-gray-300"
              />
            )}
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between bg-gray-50 p-4 border border-gray-300 rounded-lg">
            <div className="flex items-center gap-3">
              {formData.isPublished ? (
                <ToggleRight className="w-6 h-6 text-green-800" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <p className="font-semibold">Publish Status</p>
                <p className="text-sm text-gray-600">
                  {formData.isPublished ? "Public" : "Hidden"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`h-8 w-14 rounded-full flex items-center transition ${
                formData.isPublished ? "bg-green-700" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-6 w-6 bg-white rounded-full transform transition ${
                  formData.isPublished ? "translate-x-7" : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-300">
            <button
              type="submit"
              className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-600"
            >
              Create Video
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Reset Form
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
