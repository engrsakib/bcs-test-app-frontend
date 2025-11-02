// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; 
// import { 
//   FaEdit, 
//   FaTrashAlt, 
//   FaCalendarAlt, 
//   FaUserFriends, 
//   FaCheckDouble, 
//   FaClock,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearch,
//   FaFileSignature
// } from 'react-icons/fa';

// const ALL_EXAMS_KEY = 'allExams';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   let startPage = Math.max(1, currentPage - 2);
//   let endPage = Math.min(totalPages, currentPage + 2);

//   if (totalPages <= 5) {
//     startPage = 1;
//     endPage = totalPages;
//   } else {
//     if (currentPage <= 3) {
//       startPage = 1;
//       endPage = 5;
//     } else if (currentPage + 2 >= totalPages) {
//       startPage = totalPages - 4;
//       endPage = totalPages;
//     }
//   }

//   const pageNumbersToShow = pages.slice(startPage - 1, endPage);

//   return (
//     <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6">
//       <button 
//         onClick={() => onPageChange(currentPage - 1)} 
//         disabled={currentPage === 1} 
//         className="px-2 sm:px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
//       >
//         <FaChevronLeft size={12} />
//       </button>

//       {startPage > 1 && (
//         <>
//           <button
//             onClick={() => onPageChange(1)}
//             className="px-2 sm:px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
//           >
//             1
//           </button>
//           {startPage > 2 && <span className="text-gray-500">...</span>}
//         </>
//       )}

//       {pageNumbersToShow.map((page) => (
//         <button 
//           key={page} 
//           onClick={() => onPageChange(page)} 
//           className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
//             currentPage === page
//               ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold'
//               : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {endPage < totalPages && (
//         <>
//           {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
//           <button
//             onClick={() => onPageChange(totalPages)}
//             className="px-2 sm:px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
//           >
//             {totalPages}
//           </button>
//         </>
//       )}

//       <button 
//         onClick={() => onPageChange(currentPage + 1)} 
//         disabled={currentPage === totalPages} 
//         className="px-2 sm:px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
//       >
//         <FaChevronRight size={12} />
//       </button>
//     </div>
//   );
// };

// export default function ViewAllExamsTable() {
//   const [exams, setExams] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   useEffect(() => {
//     const storedExams = localStorage.getItem(ALL_EXAMS_KEY);
//     if (storedExams) {
//       const parsedExams = JSON.parse(storedExams);
//       const sortedExams = parsedExams.sort((a, b) => b.id - a.id);
//       setExams(sortedExams);
//     }
//   }, []);

//   const filteredExams = exams.filter(exam =>
//     (exam.examName || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleUpdate = (id) => {
//     alert(`Edit functionality for Exam ID ${id} is not implemented yet.`);
//   };

//   const handleDelete = (id) => {
//     if (confirm(`Apni ki nishchit ei exam-ti (ID: ${id}) delete korte chan?`)) {
//       const updatedExams = exams.filter(exam => exam.id !== id);
//       setExams(updatedExams);
//       localStorage.setItem(ALL_EXAMS_KEY, JSON.stringify(updatedExams));
//       alert('Exam deleted successfully from localStorage.');
//       if (currentExams.length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     }
//   };

//   const formatDate = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     try {
//       const date = new Date(dateTimeString);
//       return date.toLocaleString('en-US', {
//         day: '2-digit', month: 'short', year: 'numeric',
//         hour: '2-digit', minute: '2-digit'
//       });
//     } catch (e) {
//       return dateTimeString;
//     }
//   };

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl"
//       >
//         <div className="mb-6 text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-500">
//             All Scheduled Exams
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
//             Manage all scheduled exams for the BCS Exam Hub.
//           </p>
//         </div>

//         {/* Search + Per Page */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
//           <div className="relative w-full md:max-w-md">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1); 
//               }}
//               placeholder="Search by Exam Name..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
//             />
//             <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           </div>
          
//           <div className="flex items-center gap-2 w-full md:w-auto">
//              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Show:</label>
//              <select
//                 id="itemsPerPage"
//                 value={itemsPerPage}
//                 onChange={handleItemsPerPageChange}
//                 className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//              >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//              </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//             <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">SI</th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   <span className="flex items-center gap-1.5"><FaFileSignature size={12} /> Exam Name</span>
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
//                   <span className="flex items-center gap-1.5"><FaUserFriends size={12} /> Group</span>
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
//                    <span className="flex items-center gap-1.5"><FaCalendarAlt size={12} /> Date & Time</span>
//                 </th>
//                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                    <span className="flex items-center gap-1.5"><FaClock size={12} /> Time</span>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                    <span className="flex items-center gap-1.5"><FaCheckDouble size={12} /> Mark</span>
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Q.s</th>
//                 <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               <AnimatePresence>
//                 {currentExams.length === 0 ? (
//                   <motion.tr
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                   >
//                     <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
//                       No exams found matching your search.
//                     </td>
//                   </motion.tr>
//                 ) : (
//                   currentExams.map((exam, index) => (
//                     <motion.tr 
//                       key={exam.id}
//                       layout
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
//                       transition={{ duration: 0.3, delay: index * 0.05 }}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                     >
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                         {startIndex + index + 1}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm font-semibold truncate max-w-[150px] sm:max-w-xs" title={exam.examName}>
//                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-500">
//                           {exam.examName}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
//                         {exam.examinee}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden lg:table-cell">
//                         {formatDate(exam.examDate)}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
//                         {exam.examTime}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
//                         {exam.totalMark}
//                       </td>
//                       <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
//                         {exam.selectedQuestionIds.length}
//                       </td>
//                       <td className="px-4 py-4 text-center text-sm font-medium space-x-2">
//                         <button
//                           onClick={() => handleUpdate(exam.id)}
//                           className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md"
//                         >
//                           <FaEdit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(exam.id)}
//                           className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"
//                         >
//                           <FaTrashAlt size={16} />
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))
//                 )}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </motion.div>
//     </div>
//   );
// }



















'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaEdit, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaCheckDouble, 
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFileSignature,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const ALL_EXAMS_KEY = 'allExams';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    }
  }

  const pageNumbersToShow = pages.slice(startPage - 1, endPage);

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4 sm:mt-6">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="p-2 sm:px-3 sm:py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 text-xs sm:text-sm"
        aria-label="Previous page"
      >
        <FaChevronLeft size={12} />
      </button>
      {startPage > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)} 
            className="hidden xs:inline-block px-2 sm:px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm"
          >
            1
          </button>
          {startPage > 2 && <span className="hidden xs:inline-block text-gray-500 text-xs sm:text-sm">...</span>}
        </>
      )}
      {pageNumbersToShow.map((page) => (
        <button 
          key={page} 
          onClick={() => onPageChange(page)} 
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            currentPage === page
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="hidden xs:inline-block text-gray-500 text-xs sm:text-sm">...</span>}
          <button 
            onClick={() => onPageChange(totalPages)} 
            className="hidden xs:inline-block px-2 sm:px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm"
          >
            {totalPages}
          </button>
        </>
      )}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="p-2 sm:px-3 sm:py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 text-xs sm:text-sm"
        aria-label="Next page"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

// Mobile Card View Component
const MobileExamCard = ({ exam, index, onUpdate, onDelete, startIndex }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateTimeString;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-3"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{startIndex + index + 1}
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              {exam.selectedQuestionIds.length} Q's
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {exam.examName}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUserFriends size={12} className="text-gray-400" />
              <span>{exam.examinee || 'No group specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock size={12} className="text-gray-400" />
              <span>{exam.examTime || 'No time specified'}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? <FaTimes size={14} /> : <FaBars size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt size={12} className="text-gray-400" />
                <span>{formatDate(exam.examDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckDouble size={12} className="text-gray-400" />
                <span>Total Marks: {exam.totalMark || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => onUpdate(exam.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
              >
                <FaEdit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(exam.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
              >
                <FaTrashAlt size={14} />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ViewAllExamsTable() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedExams = localStorage.getItem(ALL_EXAMS_KEY);
    if (storedExams) {
      const parsedExams = JSON.parse(storedExams);
      const sortedExams = parsedExams.sort((a, b) => b.id - a.id);
      setExams(sortedExams);
    }

    // Check screen size and set up resize listener
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredExams = exams.filter(exam =>
    (exam.examName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleUpdate = (id) => {
    alert(`Edit functionality for Exam ID ${id} is not implemented yet.`);
  };

  const handleDelete = (id) => {
    if (confirm(`Apni ki nishchit ei exam-ti (ID: ${id}) delete korte chan?`)) {
      const updatedExams = exams.filter(exam => exam.id !== id);
      setExams(updatedExams);
      localStorage.setItem(ALL_EXAMS_KEY, JSON.stringify(updatedExams));
      alert('Exam deleted successfully from localStorage.');
      if (currentExams.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateTimeString;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)
          `,
          backgroundSize: "100% 100%",
          opacity: 0.2,
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8"
      >
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-xl">
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">
              All Scheduled Exams
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
              Manage all scheduled exams for the BCS Exam Hub.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4 mb-4">
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
                placeholder="Search by Exam Name..."
                className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="itemsPerPage" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                Show:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="w-full md:w-auto px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>

          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-3">
              <AnimatePresence>
                {currentExams.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-gray-500"
                  >
                    No exams found matching your search.
                  </motion.div>
                ) : (
                  currentExams.map((exam, index) => (
                    <MobileExamCard
                      key={exam.id}
                      exam={exam}
                      index={index}
                      startIndex={startIndex}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">SI</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><FaFileSignature size={12} /> Exam Name</span>
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                      <span className="flex items-center gap-1.5"><FaUserFriends size={12} /> Group</span>
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                      <span className="flex items-center gap-1.5"><FaCalendarAlt size={12} /> Date & Time</span>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                      <span className="flex items-center gap-1.5"><FaClock size={12} /> Time</span>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                      <span className="flex items-center gap-1.5"><FaCheckDouble size={12} /> Mark</span>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium uppercase tracking-wider">Q.s</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {currentExams.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="8" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                          No exams found matching your search.
                        </td>
                      </motion.tr>
                    ) : (
                      currentExams.map((exam, index) => (
                        <motion.tr 
                          key={exam.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs" title={exam.examName}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">
                              {exam.examName}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                            {exam.examinee}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                            {formatDate(exam.examDate)}
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                            {exam.examTime}
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                            {exam.totalMark}
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-700">
                            {exam.selectedQuestionIds.length}
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleUpdate(exam.id)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 hover:bg-indigo-100 rounded-md"
                              title="Edit Exam"
                            >
                              <FaEdit size={14} className="sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(exam.id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-100 rounded-md"
                              title="Delete Exam"
                            >
                              <FaTrashAlt size={14} className="sm:w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}