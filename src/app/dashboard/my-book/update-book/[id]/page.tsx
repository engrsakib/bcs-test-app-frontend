
// "use client";

// import  { useEffect, useState, useRef } from "react";
// import {
//   FileText,
//   Tag,
//   AlignLeft,
//   Type,
//   Bold,
//   Italic,
//   Underline,
//   Upload,
//   Image as ImageIcon,
//   List,
//   ListOrdered,
//   Heading,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import getCookie from "@/util/GetCookie";

// const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/books`;

// export default function UpdateBookTemplate() {
//   const { id } = useParams();
//   const router = useRouter();
//   const editorRef = useRef<HTMLDivElement>(null);

//   const [loading, setLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     title: "",
//     thumbnail_url: "",
//     buy_url: "",
//     sold_platform: "",
//     price: "",
//     is_published: true,
//     description: "",
//   });

//   // ============================================
//   // FETCH EXISTING BOOK DETAILS
//   // ============================================
//   const fetchBookDetails = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/${id}`);
//       const data = await res.json();
//       const book = data?.data;

//       setFormData({
//         title: book.title,
//         thumbnail_url: book.thumbnail_url,
//         buy_url: book.buy_url,
//         sold_platform: book.sold_platform,
//         price: book.price,
//         is_published: book.is_published,
//         description: book.description,
//       });

//       if (editorRef.current) {
//         editorRef.current.innerHTML = book.description || "";
//       }
//     } catch (err) {
//       console.log("Error loading book:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchBookDetails();
//   }, [id]);

//   // ============================================
//   // RICH TEXT EDITOR ACTIONS
//   // ============================================
//   const formatText = (command: any) => {
//     document.execCommand(command, false, undefined);
//     if (editorRef.current) {
//       setFormData({ ...formData, description: editorRef.current.innerHTML });
//     }
//   };

//   const addList = (type:any) => {
//     document.execCommand(type, false, undefined);
//     if (editorRef.current) {
//       setFormData({ ...formData, description: editorRef.current.innerHTML });
//     }
//   };

//   const addHeading = () => {
//     document.execCommand("formatBlock", false, "h3");
//     if (editorRef.current) {
//       setFormData({ ...formData, description: editorRef.current.innerHTML });
//     }
//   };

//   // ============================================
//   // HANDLE UPDATE
//   // ============================================
//   const handleUpdate = async () => {
//     Swal.fire({
//       title: "Updating Book...",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     try {
//       const access_token = getCookie("access_token");

//       const payload = {
//         title: formData.title,
//         thumbnail_url: formData.thumbnail_url, // must be hosted URL
//         buy_url: formData.buy_url,
//         sold_platform: formData.sold_platform,
//         price: Number(formData.price),
//         is_published: Boolean(formData.is_published),
//         description: formData.description,
//       };

//       const res = await fetch(`${BASE_URL}/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: access_token || "",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       Swal.close();

//       if (res.ok) {
//         Swal.fire("Success!", "Book updated successfully!", "success").then(() => {
//           router.push("/dashboard/my-book/view-book");
//         });
//       } else {
//         Swal.fire("Error", result.message, "error");
//       }
//     } catch (err) {
//       Swal.close();
//       Swal.fire("Error", "Something went wrong!", "error");
//     }
//   };

//   if (loading)
//     return <p className="text-center p-6 text-lg">Loading book details...</p>;

//   // ============================================
//   // UI TEMPLATE
//   // ============================================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl shadow-lg">
//           <h1 className="text-white text-3xl font-bold flex items-center gap-3">
//             <FileText className="w-8 h-8" /> Update Book
//           </h1>
//         </div>

//         {/* Body */}
//         <div className="bg-white p-6 rounded-b-2xl shadow-xl space-y-6">

//           {/* Title */}
//           <div>
//             <label className="font-semibold text-gray-700 flex gap-2">
//               <Type className="w-5 h-5 text-teal-600" /> Book Title
//             </label>
//             <input
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               placeholder="Enter book title"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             />
//           </div>

//           {/* Thumbnail Upload */}
//           <div>
//             <label className="font-semibold text-gray-700 flex gap-2">
//               <ImageIcon className="w-5 h-5 text-teal-600" /> Thumbnail Upload (URL Only)
//             </label>

//             <input
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               placeholder="https://your-cloudinary-image-url"
//               value={formData.thumbnail_url}
//               onChange={(e) =>
//                 setFormData({ ...formData, thumbnail_url: e.target.value })
//               }
//             />

//             <div className="w-40 h-28 bg-gray-200 mt-3 rounded-xl shadow overflow-hidden">
//               {formData.thumbnail_url ? (
//                 <img src={formData.thumbnail_url} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-500">
//                   No Image
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sold Platform */}
//           <div>
//             <label className="font-semibold text-gray-700 flex gap-2">
//               <Tag className="w-5 h-5 text-teal-600" /> Sold Platform
//             </label>
//             <select
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               value={formData.sold_platform}
//               onChange={(e) =>
//                 setFormData({ ...formData, sold_platform: e.target.value })
//               }
//             >
//               <option value="">Select Platform</option>
//               <option value="rokomari">Rokomari</option>
//               <option value="wafilife">Wafi Life</option>
//               <option value="others">Others</option>
//             </select>
//           </div>

//           {/* Buy URL */}
//           <div>
//             <label className="font-semibold text-gray-700">Buy URL</label>
//             <input
//               placeholder="https://example.com/book"
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               value={formData.buy_url}
//               onChange={(e) =>
//                 setFormData({ ...formData, buy_url: e.target.value })
//               }
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="font-semibold text-gray-700">Price (৳)</label>
//             <input
//               type="number"
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               placeholder="Enter book price"
//               value={formData.price}
//               onChange={(e) =>
//                 setFormData({ ...formData, price: e.target.value })
//               }
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="font-semibold text-gray-700">Status</label>
//             <select
//               className="w-full px-4 py-3 border rounded-xl mt-2"
//               value={formData.is_published ? "published" : "unpublished"}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   is_published: e.target.value === "published",
//                 })
//               }
//             >
//               <option value="published">Published</option>
//               <option value="unpublished">Unpublished</option>
//             </select>
//           </div>

//           {/* Description (Rich Text Editor) */}
//           <div>
//             <label className="font-semibold text-gray-700 flex gap-2 mb-2">
//               <AlignLeft className="w-5 h-5 text-teal-600" /> Description
//             </label>

//             {/* Toolbar */}
//             <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg shadow">
//               <button onClick={() => formatText("bold")}><Bold /></button>
//               <button onClick={() => formatText("italic")}><Italic /></button>
//               <button onClick={() => formatText("underline")}><Underline /></button>
//               <button onClick={() => addList("insertUnorderedList")}><List /></button>
//               <button onClick={() => addList("insertOrderedList")}><ListOrdered /></button>
//               <button onClick={() => addHeading()}><Heading /></button>
//             </div>

//             {/* Editor */}
//             <div
//               ref={editorRef}
//               contentEditable
//               className="mt-3 border rounded-xl p-4 min-h-[180px] bg-white shadow-inner focus:outline-none"
//               onInput={(e) => {
//                 if (e.currentTarget) {
//                   setFormData({
//                     ...formData,
//                     description: e.currentTarget.innerHTML,
//                   });
//                 }
//               }}
//             ></div>
//           </div>

//           {/* Update Button */}
//           <button
//             className="w-full py-3 bg-teal-600 text-white rounded-xl mt-4 shadow hover:bg-teal-700 transition"
//             onClick={handleUpdate}
//           >
//             Update Book
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }















"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FileText,
  Tag,
  AlignLeft,
  Type,
  Bold,
  Italic,
  Underline,
  Upload,
  Image as ImageIcon,
  List,
  ListOrdered,
  Heading,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import getCookie from "@/util/GetCookie";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/books`;

export default function UpdateBookTemplate() {
  const { id } = useParams();
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    thumbnail_url: "",
    buy_url: "",
    sold_platform: "",
    price: "",
    is_published: true,
    description: "",
  });

  // ===========================
  // FETCH EXISTING BOOK DATA
  // ===========================
  const fetchBookDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      const data = await res.json();
      const book = data?.data;

      setFormData({
        title: book?.title,
        thumbnail_url: book?.thumbnail_url,
        buy_url: book?.buy_url,
        sold_platform: book?.sold_platform,        // 🔥 enum exact value
        price: book?.price,
        is_published: book?.is_published,
        description: book?.description,
      });

      // Fill editor
      if (editorRef.current) {
        editorRef.current.innerHTML = book?.description || "";
      }
    } catch (err) {
      console.log("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookDetails();
  }, [id]);

  // ===========================
  // RICH TEXT EDITOR FUNCTIONS
  // ===========================
  const formatText = (command:any) => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) {
      setFormData({ ...formData, description: editorRef.current.innerHTML });
    }
  };

  const addList = (type:any) => {
    document.execCommand(type, false, undefined);
    if (editorRef.current) {
      setFormData({ ...formData, description: editorRef.current.innerHTML });
    }
  };

  const addHeading = () => {
    document.execCommand("formatBlock", false, "h3");
    if (editorRef.current) {
      setFormData({ ...formData, description: editorRef.current.innerHTML });
    }
  };

  // ===========================
  // UPDATE BOOK API CALL
  // ===========================
  const handleUpdate = async () => {
    Swal.fire({
      title: "Updating Book...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const token = getCookie("access_token");

      const payload = {
        title: formData.title,
        thumbnail_url: formData.thumbnail_url,    // must be hosted URL
        buy_url: formData.buy_url,
        sold_platform: formData.sold_platform,    // 🔥 correct enum
        price: Number(formData.price),
        is_published: Boolean(formData.is_published),
        description: formData.description,
      };

      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      Swal.close();

      if (!res.ok) {
        return Swal.fire("Error", result?.message || "Failed to update!", "error");
      }

      Swal.fire("Success!", "Book updated successfully!", "success").then(() =>
        router.push("/dashboard/my-book/view-book")
      );
    } catch (error) {
      Swal.close();
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

 if (loading)
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-green-600">
        Loading...
      </p>
    </div>
  );


  // ===========================
  // FULL UI TEMPLATE
  // ===========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl shadow-lg">
          <h1 className="text-white text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8" /> Update Book
          </h1>
        </div>

        {/* BODY */}
        <div className="bg-white p-6 rounded-b-2xl shadow-xl space-y-6">

          {/* TITLE */}
          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Type className="w-5 h-5 text-teal-600" /> Book Title
            </label>
            <input
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* THUMBNAIL URL */}
          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600" /> Thumbnail Upload (URL Only)
            </label>

            <input
              className="w-full px-4 py-3 border rounded-xl mt-2"
              placeholder="https://image-url.com"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
            />

            {/* PREVIEW */}
            <div className="w-40 h-28 bg-gray-200 mt-3 rounded-xl shadow overflow-hidden">
              {formData.thumbnail_url ? (
                <img src={formData.thumbnail_url} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* SOLD PLATFORM */}
          <div>
            <label className="font-semibold text-gray-700 flex gap-2">
              <Tag className="w-5 h-5 text-teal-600" /> Sold Platform
            </label>

            <select
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.sold_platform}
              onChange={(e) =>
                setFormData({ ...formData, sold_platform: e.target.value })
              }
            >
              <option value="">Select Platform</option>
              <option value="rokomari">Rokomari</option>
              <option value="wafi_life">Wafi Life</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* BUY URL */}
          <div>
            <label className="font-semibold text-gray-700">Buy URL</label>
            <input
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.buy_url}
              onChange={(e) => setFormData({ ...formData, buy_url: e.target.value })}
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="font-semibold text-gray-700">Price (৳)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="font-semibold text-gray-700">Status</label>
            <select
              className="w-full px-4 py-3 border rounded-xl mt-2"
              value={formData.is_published ? "published" : "unpublished"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published: e.target.value === "published",
                })
              }
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-semibold text-gray-700 flex gap-2 mb-2">
              <AlignLeft className="w-5 h-5 text-teal-600" /> Description
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg shadow">
              <button onClick={() => formatText("bold")}><Bold /></button>
              <button onClick={() => formatText("italic")}><Italic /></button>
              <button onClick={() => formatText("underline")}><Underline /></button>
              <button onClick={() => addList("insertUnorderedList")}><List /></button>
              <button onClick={() => addList("insertOrderedList")}><ListOrdered /></button>
              <button onClick={() => addHeading()}><Heading /></button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="mt-3 border rounded-xl p-4 min-h-[180px] bg-white shadow-inner focus:outline-none"
              onInput={(e) =>
                setFormData({
                  ...formData,
                  description: e.currentTarget.innerHTML,
                })
              }
            ></div>
          </div>

          {/* SUBMIT */}
          <button
            className="w-full py-3 bg-teal-600 text-white rounded-xl mt-4 shadow hover:bg-teal-700 transition"
            onClick={handleUpdate}
          >
            Update Book
          </button>

        </div>
      </div>
    </div>
  );
}
