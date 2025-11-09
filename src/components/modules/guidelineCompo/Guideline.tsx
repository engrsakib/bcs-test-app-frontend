

"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Clock, Tag, AlignLeft, Type, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import Swal from 'sweetalert2';

const CreateGuideline = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    category: '',
    status: 'published', 
    description: ''
  });

  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyTextStyle = (style: 'bold' | 'italic' | 'underline') => {
    setTextStyle(prev => ({
      ...prev,
      [style]: !prev[style]
    }));
  };

  const handleDescriptionChange = (e:any) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter a title for the guideline',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!formData.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Category Required',
        text: 'Please select a category',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Description Required',
        text: 'Please enter a description',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    console.log('=== FORM DATA FOR BACKEND ===');
    console.log({
      title: formData.title,
      date: formData.date,
      time: formData.time,
      dateTime: `${formData.date} ${formData.time}`,
      category: formData.category,
      status: formData.status, // ✅ Added status
      description: formData.description,
      textFormatting: textStyle
    });
    console.log('============================');

    // Success SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Guideline Created!',
      text: `"${formData.title}" has been ${formData.status === 'published' ? 'published' : 'saved as draft'}`,
      confirmButtonColor: '#0d9488',
      confirmButtonText: 'OK'
    });

    // Optional: Reset form after success
    // handleReset();
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Reset Form?',
      text: 'Are you sure you want to reset all fields?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reset!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].slice(0, 5),
          category: '',
          status: 'published',
          description: ''
        });
        setTextStyle({ bold: false, italic: false, underline: false });
        
        Swal.fire({
          icon: 'success',
          title: 'Form Reset!',
          text: 'All fields have been cleared',
          confirmButtonColor: '#0d9488',
          timer: 1500
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-t-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Guideline</h1>
              <p className="text-teal-50 text-sm sm:text-base mt-1">MCQ Application Guidelines Setup</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <Type className="w-5 h-5 text-teal-600" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter guideline title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <Calendar className="w-5 h-5 text-teal-600" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <Clock className="w-5 h-5 text-teal-600" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <Tag className="w-5 h-5 text-teal-600" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select category</option>
                <option value="general">General Guidelines</option>
                <option value="exam">Exam Guidelines</option>
                <option value="mcq">MCQ Guidelines</option>
                <option value="rules">Rules & Regulations</option>
                <option value="instructions">Instructions</option>
              </select>
            </div>

            {/* ✅ Active Status Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <FileText className="w-5 h-5 text-teal-600" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>

          {/* Description Field with Text Editor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
              <AlignLeft className="w-5 h-5 text-teal-600" />
              Description
            </label>
            
            {/* Text Editor Toolbar */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-t-xl p-2 sm:p-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTextStyle('bold')}
                className={`p-2 rounded-lg transition-all ${
                  textStyle.bold 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Bold"
              >
                <Bold className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => applyTextStyle('italic')}
                className={`p-2 rounded-lg transition-all ${
                  textStyle.italic 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Italic"
              >
                <Italic className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => applyTextStyle('underline')}
                className={`p-2 rounded-lg transition-all ${
                  textStyle.underline 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Underline"
              >
                <Underline className="w-5 h-5" />
              </button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button
                type="button"
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-all"
                title="Bullet List"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-all"
                title="Numbered List"
              >
                <ListOrdered className="w-5 h-5" />
              </button>
            </div>

            {/* Text Area */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Write your guideline description here..."
              rows={8}
              className={`w-full px-4 py-3 border-2 border-t-0 border-gray-200 rounded-b-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none
                ${textStyle.bold ? 'font-bold' : ''}
                ${textStyle.italic ? 'italic' : ''}
                ${textStyle.underline ? 'underline' : ''}
              `}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Guideline
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="sm:w-32 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-teal-50 border-2 border-teal-200 rounded-xl p-4 sm:p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-teal-900 mb-1">Guideline Status</h3>
              <p className="text-sm text-teal-700">
                <strong>Published:</strong> Guideline will be visible to users immediately.<br/>
                <strong>Unpublished:</strong> Guideline will be saved as draft and not visible to users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGuideline;