'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEdit,
  FaTrash,
  FaUserCog,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaUser,
  FaUserTie,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const USERS_KEY = 'bcsExamUsers';

// Primary Colors
const PRIMARY_COLOR = '#2B6A5B';
const PRIMARY_LIGHT = '#E8F5F2';
const PRIMARY_DARK = '#1F4D42';

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    }
  }

  const pageNumbersToShow = pages.slice(startPage - 1, endPage);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Previous page"
        >
          <FaChevronLeft size={14} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </>
        )}

        {pageNumbersToShow.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-[#2B6A5B] text-white border border-[#2B6A5B]'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Next page"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// Action Menu Modal Component
const ActionMenuModal = ({ isOpen, onClose, position, user, onEdit, onDelete, onManagePermissions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateX(-100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onEdit(user);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <FaEdit className="text-blue-600" size={14} />
          Edit User
        </button>
        
        <button
          onClick={() => {
            onManagePermissions(user);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <FaUserCog className="text-purple-600" size={14} />
          Manage Permissions
        </button>
        
        <div className="border-t border-gray-200 my-1"></div>
        
        <button
          onClick={() => {
            onDelete(user);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
        >
          <FaTrash size={14} />
          Delete User
        </button>
      </div>
    </div>
  );
};

// User Table Component
export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [actionMenu, setActionMenu] = useState({ isOpen: false, userId: null, position: { top: 0, left: 0 } });

  // Sample data initialization
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const sampleUsers = [
        {
          id: 1,
          name: 'Dr. Mohammad Rahman',
          email: 'rahman@bcs.gov.bd',
          role: 'admin',
          status: 'active',
          joinDate: '2023-01-15'
        },
        {
          id: 2,
          name: 'Anika Chowdhury',
          email: 'anika.chowdhury@bcs.gov.bd',
          role: 'examiner',
          status: 'active',
          joinDate: '2023-02-20'
        },
        {
          id: 3,
          name: 'Shafiq Islam',
          email: 'shafiq.islam@bcs.gov.bd',
          role: 'moderator',
          status: 'inactive',
          joinDate: '2023-03-10'
        },
        {
          id: 4,
          name: 'Tasnim Ahmed',
          email: 'tasnim.ahmed@bcs.gov.bd',
          role: 'examiner',
          status: 'active',
          joinDate: '2023-04-05'
        },
        {
          id: 5,
          name: 'Rahim Khan',
          email: 'rahim.khan@bcs.gov.bd',
          role: 'viewer',
          status: 'pending',
          joinDate: '2023-05-12'
        },
        {
          id: 6,
          name: 'Fatima Begum',
          email: 'fatima.begum@bcs.gov.bd',
          role: 'examiner',
          status: 'active',
          joinDate: '2023-06-18'
        },
        {
          id: 7,
          name: 'Jamil Hossain',
          email: 'jamil.hossain@bcs.gov.bd',
          role: 'moderator',
          status: 'inactive',
          joinDate: '2023-07-22'
        },
        {
          id: 8,
          name: 'Nusrat Jahan',
          email: 'nusrat.jahan@bcs.gov.bd',
          role: 'admin',
          status: 'active',
          joinDate: '2023-08-30'
        }
      ];
      setUsers(sampleUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
    }
  }, []);

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openActionMenu = (userId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActionMenu({
      isOpen: true,
      userId,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  const closeActionMenu = () => {
    setActionMenu({ isOpen: false, userId: null, position: { top: 0, left: 0 } });
  };

  const handleEdit = (user) => {
    Swal.fire({
      title: 'Edit User',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <select id="swal-role" class="swal2-input">
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="examiner" ${user.role === 'examiner' ? 'selected' : ''}>Examiner</option>
          <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
          <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
        </select>
        <select id="swal-status" class="swal2-input">
          <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
          <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>Pending</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: PRIMARY_COLOR,
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Update User',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const email = document.getElementById('swal-email').value;
        const role = document.getElementById('swal-role').value;
        const status = document.getElementById('swal-status').value;

        if (!name || !email) {
          Swal.showValidationMessage('Please enter name and email');
          return false;
        }

        return { name, email, role, status };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = users.map(u => 
          u.id === user.id ? { ...u, ...result.value } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        
        Swal.fire({
          title: 'Success!',
          text: 'User updated successfully',
          icon: 'success',
          confirmButtonColor: PRIMARY_COLOR
        });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete user ${user.name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: PRIMARY_COLOR,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted successfully',
          icon: 'success',
          confirmButtonColor: PRIMARY_COLOR
        });

        if (currentUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    });
  };

  const handleManagePermissions = (user) => {
    Swal.fire({
      title: `Manage Permissions - ${user.name}`,
      html: `
        <div class="text-left space-y-3">
          <div class="flex items-center justify-between">
            <span>Create Exams</span>
            <input type="checkbox" ${user.role === 'admin' || user.role === 'examiner' ? 'checked' : ''} class="rounded border-gray-300">
          </div>
          <div class="flex items-center justify-between">
            <span>Edit Exams</span>
            <input type="checkbox" ${user.role === 'admin' || user.role === 'examiner' ? 'checked' : ''} class="rounded border-gray-300">
          </div>
          <div class="flex items-center justify-between">
            <span>Delete Exams</span>
            <input type="checkbox" ${user.role === 'admin' ? 'checked' : ''} class="rounded border-gray-300">
          </div>
          <div class="flex items-center justify-between">
            <span>View Reports</span>
            <input type="checkbox" checked class="rounded border-gray-300">
          </div>
          <div class="flex items-center justify-between">
            <span>Manage Users</span>
            <input type="checkbox" ${user.role === 'admin' ? 'checked' : ''} class="rounded border-gray-300">
          </div>
        </div>
      `,
      confirmButtonColor: PRIMARY_COLOR,
      confirmButtonText: 'Save Permissions'
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-red-500" size={16} />;
      case 'examiner': return <FaUserTie className="text-blue-500" size={16} />;
      case 'moderator': return <FaUserCog className="text-green-500" size={16} />;
      default: return <FaUser className="text-gray-500" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center gap-1 w-fit`}>
            <FaCheckCircle size={10} />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800 flex items-center gap-1 w-fit`}>
            <FaTimesCircle size={10} />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit`}>
            <FaCircle size={10} />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            BCS Exam Hub - <span style={{ color: PRIMARY_COLOR }}>User Management</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage user accounts, roles, and permissions for the Bangladesh Civil Service Examination System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Filters and Search Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name or email..."
                    className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6A5B] focus:border-[#2B6A5B] transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" size={14} />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full sm:w-40 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6A5B] focus:border-[#2B6A5B] bg-white appearance-none transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Show:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6A5B] focus:border-[#2B6A5B] bg-white transition-colors"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {currentUsers.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FaUser className="text-gray-300 mb-2" size={32} />
                          <p>No users found matching your criteria</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                              <span className="font-semibold text-[#2B6A5B]">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => openActionMenu(user.id, e)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                              aria-label="Action menu"
                            >
                              <FaEllipsisV size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Menu Modal */}
      <ActionMenuModal
        isOpen={actionMenu.isOpen}
        onClose={closeActionMenu}
        position={actionMenu.position}
        user={users.find(u => u.id === actionMenu.userId)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManagePermissions={handleManagePermissions}
      />
    </div>
  );
}