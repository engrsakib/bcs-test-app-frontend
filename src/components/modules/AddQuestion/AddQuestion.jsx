







'use client';

import React, { useState, useEffect } from 'react';
// MathEditor component-er sothik path-ti ekhane din
import MathEditor from  "@/components/modules/permission/MathEditor"


const QUESTIONS_STORAGE_KEY = 'allQuestions';


const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      {children}
    </select>
  </div>
);

export default function CreateQuestionForm() { 
  // Ei state-ti ekhon localStorage theke data load korbe
  const [allQuestions, setAllQuestions] = useState([]);
  
  const [title, setTitle] = useState('');
  const [mark, setMark] = useState('');
  const [answerType, setAnswerType] = useState('MCQ');
  const [questionType, setQuestionType] = useState('General');
  const [description, setDescription] = useState(''); 
  const [mathFormula, setMathFormula] = useState(''); 
  const [blanks, setBlanks] = useState([
    { id: 1, options: ['', '', '', ''], correctAnswer: '' },
  ]);

  // ✅ Step 1: Component load hole localStorage aage check korun
  useEffect(() => {
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (storedQuestions) {
      setAllQuestions(JSON.parse(storedQuestions));
    }
    // Sample data ekhane rakhar dorkar nei, 
    // CreateExamForm ekti default list toiri korbei jodi data na pay
  }, []); // Shudhu prothombar load hobe


  // ... baki function-gulo (handleBlankOptionChange, addBlank, etc.)...
  const handleBlankOptionChange = (blankIndex, optionIndex, value) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex].options[optionIndex] = value;
    setBlanks(newBlanks);
  };
  const handleCorrectAnswerChange = (blankIndex, value) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex].correctAnswer = value;
    setBlanks(newBlanks);
  };
  const addBlank = () => {
    setBlanks([
      ...blanks,
      { id: Date.now(), options: ['', '', '', ''], correctAnswer: '' },
    ]);
  };
  const removeBlank = (index) => {
    if (blanks.length <= 1) return;
    const newBlanks = blanks.filter((_, i) => i !== index);
    setBlanks(newBlanks);
  };

  // --- ✅ Step 2: Submit function-e localStorage SAVE korun ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      id: Date.now(), // Notun ID
      title,
      mark,
      answerType,
      questionType,
      description: description, 
      mathFormula: questionType === 'Math' ? mathFormula : '', 
      blanks: answerType === 'MCQ' ? blanks : [],
      updatedAt: new Date().toISOString() // Ekti update time jog kora holo
    };
    
    // Notun question-ti ke purono list-er sathe jog korun
    const updatedQuestions = [...allQuestions, newQuestion];

    // ✅ Step 3: Pura list-ti localStorage-e SAVE korun
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
    
    // State-o update korun (jodi demo list-e dekhte chan)
    setAllQuestions(updatedQuestions); 

    // Console log backend developer-er jonno
    console.log("--- Question Saved to LocalStorage (allQuestions) ---");
    console.log(JSON.stringify(newQuestion, null, 2));

    // Form reset korun
    setTitle('');
    setMark('');
    setAnswerType('MCQ');
    setQuestionType('General');
    setDescription(''); 
    setMathFormula(''); 
    setBlanks([{ id: 1, options: ['', '', '', ''], correctAnswer: '' }]);

    alert('প্রশ্ন সফলভাবে LocalStorage-এ সেভ করা হয়েছে!');
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Create New Question</h1>

        {/* --- Basic Info (Title, Mark, Types) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Question Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title..."
            required
          />
          <Input
            label="Mark"
            type="number"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            placeholder="Enter question mark..."
            required
          />
          <Select
            label="Answer Type"
            value={answerType}
            onChange={(e) => setAnswerType(e.target.value)}
          >
            <option value="MCQ">MCQ (Fill in the Blanks)</option>
            <option value="Written">Written</option>
          </Select>
          <Select
            label="Question Type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Math">Math</option>
          </Select>
        </div>

        {/* --- Description (Always visible) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter question description (if any)..."
          ></textarea>
        </div>

        {/* --- Conditional Rendering (Math) --- */}
        {questionType === 'Math' && (
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Math Formula
            </label>
            <MathEditor value={mathFormula} onChange={setMathFormula} />
          </div>
        )}

        {/* --- Conditional Rendering (MCQ) --- */}
        {answerType === 'MCQ' && (
          <div className="space-y-6 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800">
              Answer Blanks (MCQ Options)
            </h2>
            {blanks.map((blank, blankIndex) => (
              <div
                key={blank.id}
                className="p-4 border border-gray-300 rounded-md relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Blank {blankIndex + 1}
                  </h3>
                  {blanks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBlank(blankIndex)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Blank
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blank.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      label={`Option ${optionIndex + 1}`}
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleBlankOptionChange(
                          blankIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Enter option ${optionIndex + 1}`}
                      required
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <Select
                    label="Correct Answer"
                    value={blank.correctAnswer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(blankIndex, e.target.value)
                    }
                    required
                  >
                    <option value="">Choose correct answer</option>
                    {blank.options.map((opt, index) => (
                      opt && (
                        <option key={index} value={index + 1}>
                          {opt}
                        </option>
                      )
                    ))}
                  </Select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addBlank}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700"
            >
              + Add Another Blank
            </button>
          </div>
        )}

        {/* --- Submit Button --- */}
        <div className="pt-5">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirm & Add Question
          </button>
        </div>
      </form>

      {/* --- Demo Section (Ekhon localStorage-er data dekhabe) --- */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Added Questions (Demo from LocalStorage)
        </h2>
        <div className="space-y-4">
          {allQuestions.length === 0 ? (
            <p className="text-gray-500 text-center">No questions added yet.</p>
          ) : (
            // Shudhu shesh 5-ti proshno dekhano hocche
            allQuestions.slice(-5).reverse().map((q, index) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-lg shadow-md border"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {q.title} ({q.mark} Marks)
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Type: {q.questionType} | Answer: {q.answerType}
                </p>
                {q.description && (
                  <p className="text-gray-700 whitespace-pre-wrap mb-2 border-l-4 border-gray-200 pl-2">
                    {q.description}
                  </p>
                )}
                {q.questionType === 'Math' && q.mathFormula && (
                  <div className="p-2 border rounded-md bg-gray-50">
                    <MathEditor value={q.mathFormula} onChange={() => {}} readOnly={true} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
