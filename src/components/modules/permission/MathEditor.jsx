



// "use client";

// import React, { useRef, useState, useEffect } from "react";


// export default function MathEditor() {
//   // 1️⃣ স্ক্রিপ্ট লোড করার জন্য useEffect
//   useEffect(() => {
//     const scriptId = "mathlive-script";

//     if (document.getElementById(scriptId)) return;

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://unpkg.com/mathlive?module";
//     script.type = "module";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   // 2️⃣ Output state
//   const [latexValue, setLatexValue] = useState("...বাটনে ক্লিক করুন...");

//   // 3️⃣ MathField ধরার জন্য ref
//   const mathEditorRef = useRef(null);

//   // 4️⃣ বাটনে ক্লিক করলে value console-এ দেখানো হবে
//   const handleSubmit = async () => {
//     const current = mathEditorRef.current;
//     if (current) {
//       const latexData = current.value;
//       console.log("🎯 Latex Output:", latexData);
//       setLatexValue(latexData);
//     } else {
//       console.warn("⚠️ Math field এখনো লোড হয়নি!");
//     }
//   };

//   return (
//     <>
//       <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           গণিত এডিটর (React + TypeScript)
//         </h1>

//         <p className="text-gray-600 mb-4 text-center">
//           নিচের ফিল্ডে গণিতের সমীকরণ লিখুন। এটি স্বয়ংক্রিয়ভাবে LaTeX কোডে রূপান্তরিত হবে।
//         </p>

//         {/* ✅ MathLive Editor */}
//         <math-field ref={mathEditorRef}>
//           f(x) = \sin(x) + \frac{1}{2}
//         </math-field>

//         {/* ✅ Submit Button */}
//         <button
//           onClick={handleSubmit}
//           className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
//         >
//           ব্যাকএন্ডে পাঠানোর জন্য ডেটা দেখুন
//         </button>

//         {/* ✅ Output Preview */}
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">
//             ব্যাকএন্ডে এই ডেটা সেভ হবে (LaTeX ফরম্যাট):
//           </h2>
//           <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
//             {latexValue}
//           </pre>
//         </div>
//       </div>

//       {/* ✅ Custom CSS */}
//       <style jsx global>{`
//         math-field {
//           display: block;
//           border: 1px solid #ccc;
//           border-radius: 0.5rem;
//           padding: 0.5rem 1rem;
//           font-size: 1.25rem;
//           background: #ffffff;
//           width: 100%;
//           box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
//         }
//         math-field:focus-within {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 2px #bfdbfe;
//           outline: none;
//         }
//       `}</style>
//     </>
//   );
// }











"use client";

import React, { useRef, useState, useEffect } from "react";

export default function MathEditor() {
  // 1️⃣ স্ক্রিপ্ট লোড করার জন্য useEffect
  useEffect(() => {
    const scriptId = "mathlive-script";

    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://unpkg.com/mathlive?module";
    script.type = "module";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // 2️⃣ Output state (ডিফল্ট ভ্যালু দিয়ে শুরু করা হলো)
  const [latexValue, setLatexValue] = useState("f(x) = \\sin(x) + \\frac{1}{2}");

  // 3️⃣ MathField ধরার জন্য ref
  const mathEditorRef = useRef(null);

  // 4️⃣ বাটনে ক্লিক করলে state আপডেট হবে
  const handleSubmit = async () => {
    // ref object-er 'current' property-r moddhe DOM element-ti thake
    const current = mathEditorRef.current;
    if (current) {
      // .value property diye LaTeX data ber kora hocche
      const latexData = current.value;
      console.log("🎯 Latex Output:", latexData);
      setLatexValue(latexData);
    } else {
      console.warn("⚠️ Math field এখনো লোড হয়নি!");
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          গণিত এডিটর (React + JSX)
        </h1>

        <p className="text-gray-600 mb-4 text-center">
          নিচের ফিল্ডে গণিতের সমীকরণ লিখুন।
        </p>

        {/* ✅ MathLive Editor (ইনপুট) */}
        {/* 'ref' attribute diye ref-ti connect kora hocche */}
        <math-field ref={mathEditorRef}>
          {latexValue}
        </math-field>

        {/* ✅ Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
        >
          আপডেট করে দেখুন
        </button>

        {/* ✅ Output Preview (LaTeX) */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            ব্যাকএন্ডে এই ডেটা সেভ হবে (LaTeX ফরম্যাট):
          </h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
            {latexValue}
          </pre>
        </div>

        {/* --- নতুন সেকশন: LaTeX থেকে আসল ফরম্যাট দেখানো --- */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            LaTeX থেকে অরিজিনাল ফরম্যাট:
          </h2>
          {/* ✅ 'read-only' এট্রিবিউট এটিকে এডিট করা থেকে বিরত রাখে। */}
          <math-field 
            read-only 
            className="static-math-display"
          >
            {latexValue}
          </math-field>
        </div>
        {/* --- শেষ --- */}

      </div>

      {/* ✅ Custom CSS */}
      <style jsx global>{`
        /* ইনপুট এডিটরের স্টাইল */
        math-field {
          display: block;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 1.25rem;
          background: #ffffff;
          width: 100%;
          box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
        }
        math-field:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #bfdbfe;
          outline: none;
        }

        /* শুধু দেখানোর জন্য (read-only) ফিল্ডের স্টাইল */
        math-field.static-math-display[read-only] {
          border: 1px solid #e5e7eb; /* হালকা বর্ডার */
          background-color: #f9fafb; /* হালকা ব্যাকগ্রাউন্ড */
          box-shadow: none;
          padding: 0.5rem 1rem;
          font-size: 1.25rem;
        }
      `}</style>
    </>
  );
}








