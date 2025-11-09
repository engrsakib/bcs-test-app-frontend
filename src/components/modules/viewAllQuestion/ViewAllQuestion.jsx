

"use client"

import React, { useState, useEffect } from 'react'; 
import MathEditor from "@/components/modules/permission/MathEditor";
import { 
  FaSearch, 
  FaPencilAlt, 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight, 
  FaTimes 
} from 'react-icons/fa';


const sampleData = [
  { id: 1, title: 'Math Problem 1: Algebra', mark: '5', answerType: 'MCQ', questionType: 'Math', description: 'Solve for x: 2x + 5 = 15', mathFormula: "2x + 5 = 15", blanks: [{ id: 101, options: ['3', '4', '5', '6'], correctAnswer: '3' }], updatedAt: '2025-10-30T10:00:00Z' },
  { id: 2, title: 'General Knowledge: Capitals', mark: '2', answerType: 'Written', questionType: 'General', description: 'What is the capital of Japan?', mathFormula: "", blanks: [], updatedAt: '2025-10-29T11:00:00Z' },
  { id: 3, title: 'Physics: Newtons Law', mark: '10', answerType: 'MCQ', questionType: 'Math', description: 'What is Newtons second law?', mathFormula: "F = ma", blanks: [{ id: 102, options: ['F=ma', 'E=mc^2', 'P=IV', 'V=IR'], correctAnswer: '1' }], updatedAt: '2025-10-28T12:00:00Z' },
  { id: 4, title: 'History: World War II', mark: '5', answerType: 'Written', questionType: 'General', description: 'When did WWII end?', mathFormula: "", blanks: [], updatedAt: '2025-10-27T14:00:00Z' },
  { id: 5, title: 'Chemistry: Water', mark: '3', answerType: 'MCQ', questionType: 'Math', description: 'What is the chemical formula for water?', mathFormula: "H_2O", blanks: [{ id: 103, options: ['CO2', 'H2O', 'O2', 'NaCl'], correctAnswer: '2' }], updatedAt: '2025-10-26T15:00:00Z' },
  { id: 6, title: 'Literature: Shakespeare', mark: '5', answerType: 'Written', questionType: 'General', description: 'Name a famous play by Shakespeare.', mathFormula: "", blanks: [], updatedAt: '2025-10-25T16:00:00Z' },
  { id: 7, title: 'Math Problem 2: Geometry', mark: '10', answerType: 'MCQ', questionType: 'Math', description: 'Area of a circle?', mathFormula: "A = \\pi r^2", blanks: [{ id: 104, options: ['pi*r', '2*pi*r', 'pi*r^2', 'pi*d'], correctAnswer: '3' }], updatedAt: '2025-10-24T17:00:00Z' },
  { id: 8, title: 'Biology: Photosynthesis', mark: '5', answerType: 'MCQ', questionType: 'General', description: 'What gas do plants absorb?', mathFormula: "", blanks: [{ id: 105, options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: '3' }], updatedAt: '2025-10-23T18:00:00Z' },
  { id: 9, title: 'Math Problem 3: Calculus', mark: '15', answerType: 'Written', questionType: 'Math', description: 'Find the derivative of x^2', mathFormula: "\\frac{d}{dx} x^2", blanks: [], updatedAt: '2025-10-22T19:00:00Z' },
  { id: 10, title: 'General Knowledge: Rivers', mark: '3', answerType: 'Written', questionType: 'General', description: 'Longest river in the world?', mathFormula: "", blanks: [], updatedAt: '2025-10-21T20:00:00Z' },
];

// LocalStorage Key
const QUESTIONS_STORAGE_KEY = 'allQuestions';


export default function ViewAllQuestionsTable() {
  // --- State Initialization ---
  // ✅ Step 1: Initialize state khali array diye shuru korun
  const [questions, setQuestions] = useState([]);
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [editing, setEditing] = useState(null); // question being edited
  const [search, setSearch] = useState('');

  // --- ✅ Step 2: LocalStorage theke data Load korun ---
  useEffect(() => {
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    
    if (storedQuestions) {
      // Jodi data thake, sheta load korun
      setQuestions(JSON.parse(storedQuestions));
    } else {
      // Jodi data na thake (prothombar visit), sampleData set korun
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(sampleData));
      setQuestions(sampleData);
    }
  }, []); // [] dependency mane shudhu component load howar shomoy ekbar cholbe

  // derived state
  const filtered = questions.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (q.title || '').toLowerCase().includes(s) ||
      (q.description || '').toLowerCase().includes(s) ||
      (q.questionType || '').toLowerCase().includes(s) ||
      (q.answerType || '').toLowerCase().includes(s)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  // actions
  const handleDelete = (id) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    
    setQuestions((prev) => {
      const updatedQuestions = prev.filter((p) => p.id !== id);
      // ✅ Step 3: Delete korar por localStorage update korun
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
      return updatedQuestions;
    });
  };

  const openEdit = (q) => {
    setEditing({ ...q });
  };

  const saveEdit = () => {
    if (!editing) return;
    const updated = { ...editing, updatedAt: new Date().toISOString() };
    
    setQuestions((prev) => {
      const updatedQuestions = prev.map((p) => (p.id === updated.id ? updated : p));
      // ✅ Step 4: Edit save korar por localStorage update korun
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQuestions));
      return updatedQuestions;
    });
    
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  // simple truncation helper
  const truncate = (text, n = 60) => (text && text.length > n ? text.slice(0, n) + '...' : text);
  
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '—';
    }
  };

  // Helper to render badges
  const TypeBadge = ({ text }) => {
    let colors = 'bg-gray-100 text-gray-800'; // default
    if (text === 'Math') colors = 'bg-blue-100 text-blue-800';
    if (text === 'General') colors = 'bg-purple-100 text-purple-800';
    if (text === 'MCQ') colors = 'bg-green-100 text-green-800';
    if (text === 'Written') colors = 'bg-yellow-100 text-yellow-800';
    
    return (
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${colors}`}>
        {text}
      </span>
    );
  };


  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">All Created Questions</h1>
            <p className="text-sm text-gray-600 mt-1">View all questions — edit, delete, or search them easily.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Improved Search Bar */}
            <div className="relative w-full sm:w-72">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search title, description, type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>6 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </header>

        {/* Table container */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blanks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edited</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No questions found.
                  </td>
                </tr>
              ) : (
                pageItems.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{start + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{truncate(q.title, 40)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <TypeBadge text={q.questionType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <TypeBadge text={q.answerType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{q.mark}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{truncate(q.description, 50)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{q.blanks ? q.blanks.length : 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(q.updatedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {/* Icon buttons for actions */}
                      <div className="inline-flex gap-4">
                        <button
                          onClick={() => openEdit(q)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{Math.min(filtered.length, start + 1)}</span>
              {' '}to <span className="font-medium">{Math.min(filtered.length, start + pageItems.length)}</span>
              {' '}of <span className="font-medium">{filtered.length}</span> questions
            </div>

            <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
              >
                <FaChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              
              <div className="px-4 py-2 border-l border-r border-gray-300 text-sm font-medium">
                Page {page} / {totalPages}
              </div>
              
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
              >
                <span>Next</span>
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- Edit Modal (Redesigned) --- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Question</h3>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  value={editing.title || ''} 
                  onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mark</label>
                  <input 
                    value={editing.mark || ''} 
                    onChange={(e) => setEditing((s) => ({ ...s, mark: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer Type</label>
                  <select 
                    value={editing.answerType || 'MCQ'} 
                    onChange={(e) => setEditing((s) => ({ ...s, answerType: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Written">Written</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select 
                    value={editing.questionType || 'General'} 
                    onChange={(e) => setEditing((s) => ({ ...s, questionType: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Math">Math</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editing.description || ''} 
                  onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} 
                  rows={4} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              {editing.questionType === 'Math' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Math Formula</label>
                  <MathEditor 
                    value={editing.mathFormula || ''} 
                    onChange={(val) => setEditing((s) => ({ ...s, mathFormula: val }))} 
                  />
                </div>
              )}

              {/* Blanks editor (basic) */}
              {editing.answerType === 'MCQ' && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-800">Blanks (MCQ Options)</h4>
                  {(editing.blanks || []).map((b, bi) => (
                    <div key={b.id} className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-700">Blank {bi + 1}</div>
                        <button 
                          onClick={() => {
                            if ((editing.blanks || []).length <= 1) return;
                            setEditing((s) => ({ ...s, blanks: s.blanks.filter((_,i) => i !== bi) }));
                          }} 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Ensure 4 options are always mapped, even if blank */}
                        {[0, 1, 2, 3].map((oi) => (
                          <input 
                            key={oi} 
                            value={b.options[oi] || ''} 
                            placeholder={`Option ${oi + 1}`}
                            onChange={(e) => {
                              const newOptions = [...(b.options || [])];
                              newOptions[oi] = e.target.value;
                              
                              const newBlanks = (editing.blanks || []).map((bb, idx) => 
                                idx === bi ? { ...bb, options: newOptions } : bb
                              );
                              setEditing((s) => ({ ...s, blanks: newBlanks }));
                            }} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        <select 
                          value={b.correctAnswer || ''} 
                          onChange={(e) => {
                            const newBlanks = (editing.blanks || []).map((bb, idx) => 
                              idx === bi ? { ...bb, correctAnswer: e.target.value } : bb
                            );
                            setEditing((s) => ({ ...s, blanks: newBlanks }));
                          }} 
                          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Choose correct</option>
                          {(b.options || []).map((opt, oi) => 
                            opt && (<option key={oi} value={String(oi + 1)}>{opt}</option>)
                          )}
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <button 
                      onClick={() => {
                        const newBlank = { id: Date.now(), options: ['', '', '', ''], correctAnswer: '' };
                        setEditing((s) => ({ ...s, blanks: [...(s.blanks || []), newBlank] }));
                      }} 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      + Add Blank
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={cancelEdit} 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit} 
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

