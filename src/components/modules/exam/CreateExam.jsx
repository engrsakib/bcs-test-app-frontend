

'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaMinus, 
  FaTimes, 
  FaListUl,
  FaCalendarAlt,
  FaClock,
  FaCheckDouble,
  FaUserFriends,
  FaChevronRight // Import kora holo
} from 'react-icons/fa';

// LocalStorage Keys
const QUESTIONS_STORAGE_KEY = 'allQuestions';
const SELECTED_QUESTIONS_KEY = 'selectedExamQuestions';
const ALL_EXAMS_KEY = 'allExams';

// --- Sample Data (Seed Data) ---
const sampleData = [
  { id: 1, title: 'Math Problem 1: Algebra', mark: '5', answerType: 'MCQ', questionType: 'Math', description: 'Solve for x: 2x + 5 = 15', mathFormula: "2x + 5 = 15", blanks: [{ id: 101, options: ['3', '4', '5', '6'], correctAnswer: '3' }], updatedAt: '2025-10-30T10:00:00Z' },
  { id: 2, title: 'General Knowledge: Capitals', mark: '2', answerType: 'Written', questionType: 'General', description: 'What is the capital of Japan?', mathFormula: "", blanks: [], updatedAt: '2025-10-29T11:00:00Z' },
  { id: 3, title: 'Physics: Newtons Law', mark: '10', answerType: 'MCQ', questionType: 'Math', description: 'What is Newtons second law?', mathFormula: "F = ma", blanks: [{ id: 102, options: ['F=ma', 'E=mc^2', 'P=IV', 'V=IR'], correctAnswer: '1' }], updatedAt: '2025-10-28T12:00:00Z' },
  // ... (baki data)
];

// Reusable Input Component (✅ Dark mode bad deya hoyeche)
const Input = ({ label, id, icon, ...props }) => {
  const Icon = icon;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          id={id}
          {...props}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                     bg-white text-gray-900 ${Icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
};

// --- Question Card Component (✅ Dark mode bad deya hoyeche) ---
const QuestionCard = ({ question, onAdd, isAdded }) => (
  <div 
    className={`p-4 border rounded-lg flex flex-col justify-between transition-all 
               ${isAdded ? 'bg-green-50 border-green-300' 
                         : 'bg-white border-gray-200 hover:shadow-md'}`}
  >
    <div>
      <h4 
        className={`font-semibold text-sm truncate ${isAdded ? 'text-green-800' : 'text-gray-800'}`} 
        title={question.title}
      >
        {question.title}
      </h4>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span 
          className={`px-2 py-0.5 rounded-full text-xs font-medium 
                     ${question.questionType === 'Math' ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-purple-100 text-purple-800'}`}
        >
          {question.questionType}
        </span>
        <span 
          className={`px-2 py-0.5 rounded-full text-xs font-medium 
                     ${question.answerType === 'MCQ' ? 'bg-yellow-100 text-yellow-800' 
                                                      : 'bg-indigo-100 text-indigo-800'}`}
        >
          {question.answerType}
        </span>
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <span className="text-sm font-bold text-gray-700">{question.mark} Mark</span>
      <button
        type="button"
        onClick={onAdd}
        disabled={isAdded}
        className={`p-1.5 rounded-full transition-all 
                   ${isAdded ? 'bg-green-500 text-white cursor-not-allowed' 
                             : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        title={isAdded ? 'Added' : 'Add Question'}
      >
        {isAdded ? <FaCheckDouble size={12} /> : <FaPlus size={12} />}
      </button>
    </div>
  </div>
);

// --- Question Selector Modal (✅ Dark mode bad deya hoyeche) ---
const QuestionSelectorModal = ({ isOpen, onClose, allQuestions, selectedIds, onAdd, onRemove, onSearch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Add Questions to Exam</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Search Bar (Inside Modal) */}
        <div className="p-4 border-b border-gray-200 sticky top-[73px] bg-white z-10">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search questions by title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Question Cards Grid */}
        <div className="p-4 overflow-y-auto">
          {allQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allQuestions.map((q) => {
                const isAdded = selectedIds.includes(q.id);
                return (
                  <QuestionCard 
                    key={q.id} 
                    question={q} 
                    isAdded={isAdded}
                    onAdd={() => isAdded ? onRemove(q.id) : onAdd(q.id)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No questions found matching your search.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-gray-50 z-10">
           <button 
             type="button" 
             onClick={onClose} 
             className="w-full px-4 py-2 bg-[#2B6A5B] text-white font-semibold rounded-lg hover:bg-green-700"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Create Exam Form Component ---
export default function CreateExamForm() {
  // --- States ---
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields states
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState(''); // in minutes
  const [examMark, setExamMark] = useState('');
  const [examinee, setExaminee] = useState('');

  // --- Data Loading ---
  useEffect(() => {
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    let questionsData = [];
    if (storedQuestions) {
      questionsData = JSON.parse(storedQuestions);
    } else {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(sampleData));
      questionsData = sampleData;
    }
    setAllQuestions(questionsData);

    const storedSelectedIds = localStorage.getItem(SELECTED_QUESTIONS_KEY);
    if (storedSelectedIds) {
      setSelectedQuestionIds(JSON.parse(storedSelectedIds));
    }
  }, []);

  // --- Question Management Logic ---
  useEffect(() => {
    localStorage.setItem(SELECTED_QUESTIONS_KEY, JSON.stringify(selectedQuestionIds));
  }, [selectedQuestionIds]);

  const addQuestion = (id) => {
    if (!selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds((prevIds) => [...prevIds, id]);
    }
  };

  const removeQuestion = (id) => {
    setSelectedQuestionIds((prevIds) => prevIds.filter((qId) => qId !== id));
  };

  const availableQuestions = allQuestions
    .filter((q) => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const selectedQuestionsFull = selectedQuestionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean); 

  // --- Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const calculatedMark = selectedQuestionsFull.reduce((total, q) => total + (Number(q.mark) || 0), 0);
    
    const examData = {
      id: Date.now(),
      examName,
      examDate,
      examTime: `${examTime} minutes`,
      totalMark: examMark || calculatedMark, 
      examinee,
      selectedQuestionIds, 
    };

    // --- LOCALSTORAGE-E SAVE KORA ---
    const storedExams = localStorage.getItem(ALL_EXAMS_KEY);
    const allExams = storedExams ? JSON.parse(storedExams) : [];
    const updatedExams = [...allExams, examData];
    localStorage.setItem(ALL_EXAMS_KEY, JSON.stringify(updatedExams));

    console.log("--- Creating Exam (Data for Backend) ---");
    console.log(JSON.stringify(examData, null, 2));
    
    alert('Exam created and saved to LocalStorage!');
    
    // Form Reset
    setExamName('');
    setExamDate('');
    setExamTime('');
    setExamMark('');
    setExaminee('');
    setSelectedQuestionIds([]);
    localStorage.removeItem(SELECTED_QUESTIONS_KEY);
  };

  return (
    // ✅ Dark mode bad deya hoyeche
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        // ✅ Dark mode bad deya hoyeche
        className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl space-y-6"
      >
        {/* --- ✅ Notun Header Title o Description --- */}
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details below to schedule a new exam and add questions from your question bank.
          </p>
        </div>
        
        {/* --- Exam Details Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Exam Name"
            id="examName"
            icon={FaListUl}
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g., BCS Preliminary Mock Test 1"
            required
          />
          <Input
            label="Examinee Group"
            id="examinee"
            icon={FaUserFriends}
            type="text"
            value={examinee}
            onChange={(e) => setExaminee(e.target.value)}
            placeholder="e.g., BCS Candidates"
            required
          />
          <Input
            label="Exam Date and Time"
            id="examDate"
            icon={FaCalendarAlt}
            type="datetime-local" 
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
          <Input
            label="Exam Time (in Minutes)"
            id="examTime"
            icon={FaClock}
            type="number"
            value={examTime}
            onChange={(e) => setExamTime(e.target.value)}
            placeholder="e.g., 60"
            required
          />
           <Input
            label="Total Mark (Optional)"
            id="examMark"
            icon={FaCheckDouble}
            type="number"
            value={examMark}
            onChange={(e) => setExamMark(e.target.value)}
            placeholder="Auto-calculates if left blank"
          />
           <div className="md:col-span-1 flex items-end pb-2">
            <p className="text-sm text-gray-600">
              Auto-Mark: <span className="font-bold">{selectedQuestionsFull.reduce((total, q) => total + (Number(q.mark) || 0), 0)}</span>
            </p>
           </div>
        </div>

        {/* --- Add Question Button & Selected List --- */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-lg font-medium text-gray-800">
              Selected Questions ({selectedQuestionIds.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
            >
              <FaPlus size={14} />
              Add / View Questions
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto space-y-2 bg-gray-50">
            {selectedQuestionsFull.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No questions added yet.</p>
            ) : (
              selectedQuestionsFull.map((q, index) => (
                <div key={q.id} className="flex justify-between items-center p-2.5 bg-white rounded-md shadow-sm">
                  <span className="text-sm text-gray-900 truncate pr-4" title={q.title}>
                    {index + 1}. {q.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                    title="Remove Question"
                  >
                    <FaMinus size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- ✅ Submit Button (Green Color) --- */}
        <div className="pt-5 border-t border-gray-200">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white 
                       bg-emerald-600 hover:bg-emerald-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Confirm & Create Exam
          </button>
        </div>
      </form>

      {/* --- Question Selector Modal --- */}
      <QuestionSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allQuestions={availableQuestions}
        selectedIds={selectedQuestionIds}
        onAdd={addQuestion}
        onRemove={removeQuestion}
        onSearch={setSearchTerm}
      />
    </div>
  );
}

