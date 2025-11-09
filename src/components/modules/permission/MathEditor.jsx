
// 'use client';

// import React, { useEffect, useRef } from 'react';


// export default function MathEditor({ value, onChange }) {
//   const mathEditorRef = useRef(null);

//   // 1️⃣ MathLive স্ক্রিপ্টটি লোড করুন (আপনার কোড)
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

//   // 2️⃣ Event listener যোগ করুন
//   useEffect(() => {
//     const currentEditor = mathEditorRef.current;

//     if (currentEditor) {
//       // যখনই ইউজার MathEditor-এ টাইপ করবে, এই ফাংশনটি কল হবে
//       const handleInput = (event) => {
//         // onChange(event.target.value) কল করার মাধ্যমে
//         // এটি CreateQuestionForm-এর 'setMathFormula'-কে কল করবে।
//         onChange(event.target.value);
//       };

//       // সরাসরি DOM এলিমেন্টে 'input' ইভেন্ট যোগ করা হলো
//       currentEditor.addEventListener('input', handleInput);

//       // কম্পোনেন্টটি destroy হওয়ার আগে event listener মুছে ফেলা হলো
//       return () => {
//         currentEditor.removeEventListener('input', handleInput);
//       };
//     }
//   }, [onChange]); // onChange ফাংশন পরিবর্তন হলে এটি আবার রান হবে

//   // 3️⃣ ফর্ম রিসেট হলে বা ভ্যালু বাইরে থেকে পরিবর্তন হলে এডিটর আপডেট করুন
//   useEffect(() => {
//     if (mathEditorRef.current && mathEditorRef.current.value !== value) {
//       mathEditorRef.current.value = value;
//     }
//   }, [value]);

//   return (
//     <>
//       {/* ref ব্যবহার করে DOM এলিমেন্টটি ধরা হয়েছে।
//         প্রাথমিক ভ্যালুটি চাইল্ড হিসেবে পাস করা হয়েছে।
//       */}
//       <math-field ref={mathEditorRef}>
//         {value}
//       </math-field>

//       {/* --- আপনার দেওয়া কাস্টম CSS --- */}
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

















'use client';
import React, { useEffect, useRef } from 'react';

export default function MathEditor({ value, onChange, readOnly = false }) {
  const mathEditorRef = useRef(null);


  useEffect(() => {
    const scriptId = 'mathlive-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/mathlive?module';
    script.type = 'module';
    script.async = true;
    script.onload = () => console.log('✅ MathLive loaded');
    document.head.appendChild(script);
  }, []);

  // 2️⃣ Wait until <math-field> is defined
  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.MathfieldElement && mathEditorRef.current) {
        clearInterval(checkReady);

        const mathField = mathEditorRef.current;

        // Proper listener for MathLive
        const handleChange = (evt) => {
          const newValue = evt.target.getValue
            ? evt.target.getValue()
            : evt.target.value;
          onChange(newValue);
        };

        mathField.addEventListener('input', handleChange);
        mathField.addEventListener('change', handleChange);

        return () => {
          mathField.removeEventListener('input', handleChange);
          mathField.removeEventListener('change', handleChange);
        };
      }
    }, 200);

    return () => clearInterval(checkReady);
  }, [onChange]);

  // 3️⃣ External value update
  useEffect(() => {
    if (mathEditorRef.current && mathEditorRef.current.getValue) {
      const currentVal = mathEditorRef.current.getValue();
      if (currentVal !== value) {
        mathEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <>
      <math-field ref={mathEditorRef} readOnly={readOnly}>
        {value}
      </math-field>

      <style jsx global>{`
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
      `}</style>
    </>
  );
}
