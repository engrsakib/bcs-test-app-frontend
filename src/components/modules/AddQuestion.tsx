// components/AddQuestionForm.tsx

'use client';

import React, { useState } from 'react';
import MathLiveEditor from './MathLiveEditor'; // MathLive এডিটর ইম্পোর্ট করুন

export default function AddQuestionForm() {
  
  // 1. সাধারণ টেক্সট সেভ করার জন্য (যেমন: "Solve for x:")
  const [questionText, setQuestionText] = useState('নিচের সমীকরণটির সমাধান কর:');

  // 2. MathLive থেকে আসা LaTeX ফর্মুলা সেভ করার জন্য
  const [formulaLatex, setFormulaLatex] = useState('x^2 + 5x + 6 = 0');

  // ফর্ম সাবমিট হলে কী হবে
  const handleSubmit = () => {
    const questionData = {
      text: questionText,
      formula: formulaLatex, // <-- এই কাঁচা LaTeX কোডটিই ব্যাকএন্ডে পাঠাবেন
    };

    console.log('ব্যাকএন্ডে এই ডেটা পাঠানো হবে:', questionData);
    alert('ডেটা সেভ করা হয়েছে (কনসোল দেখুন)');
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', padding: '20px', margin: 'auto' }}>
      <h2 style={{ color: '#FFF' }}>নতুন প্রশ্ন যোগ করুন</h2>

      {/* --- ফিল্ড ১: সাধারণ টেক্সট --- */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#DDD', display: 'block', marginBottom: '8px' }}>
          প্রশ্নের বিবরণ (Text):
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="প্রশ্নের উপরের অংশ লিখুন..."
          style={{
            width: '100%',
            minHeight: '80px',
            backgroundColor: '#2d3748',
            color: '#e2e8f0',
            border: '1px solid #4a5568',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '16px',
          }}
        />
      </div>

      {/* --- ফিল্ড ২: MathLive এডিটর --- */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ color: '#DDD', display: 'block', marginBottom: '8px' }}>
          গাণিতিক ফর্মুলা (MathLive):
        </label>
        <MathLiveEditor 
          value={formulaLatex} 
          onChange={setFormulaLatex} 
        />
      </div>

      {/* --- সাবমিট বাটন --- */}
      <button 
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '18px',
          backgroundColor: '#3182ce',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Save Question
      </button>

      {/* --- ডেমো: ব্যাকএন্ডে কী যাবে তার প্রিভিউ --- */}
      <div style={{ marginTop: '30px', backgroundColor: '#1a202c', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ color: '#FFF' }}>ব্যাকএন্ডে সেভ হবে:</h3>
        <pre style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify({ text: questionText, formula: formulaLatex }, null, 2)}
        </pre>
      </div>
    </div>
  );
}