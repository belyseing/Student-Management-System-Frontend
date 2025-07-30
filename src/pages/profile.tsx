'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { 
  UserIcon, 
  PencilIcon, 
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    courseOfStudy: user?.courseOfStudy || '',
    enrollmentYear: user?.enrollmentYear || new Date().getFullYear(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) : value
    }));
    setError('');
  };

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (user?.role === 'student' && !formData.courseOfStudy.trim()) {
      setError('Course of study is required for students');
      return;
    }

    updateUser({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      courseOfStudy: formData.courseOfStudy || undefined,
      enrollmentYear: formData.enrollmentYear,
    });

    setIsEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      courseOfStudy: user?.courseOfStudy || '',
      enrollmentYear: user?.enrollmentYear || new Date().getFullYear(),
    });
    setIsEditing(false);
    setError('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateUser({ profilePicture: imageUrl });
        setSuccess('Profile picture updated!');
        setTimeout(() => setSuccess(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i + 4);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Graduated':
        return 'bg-blue-100 text-blue-800';
      case 'Dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
         
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-xs sm:text-base text-gray-600">Manage your account information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto text-xs sm:text-base"
              >
                <PencilIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          
          <div className="mb-4 sm:mb-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-4 flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-green-700">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4 flex items-center space-x-2">
                <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">  
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-200 h-full">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Profile Picture</h3>
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 sm:w-32 h-20 sm:h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 overflow-hidden">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-10 sm:w-16 h-10 sm:h-16 text-gray-600" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-7 sm:w-10 h-7 sm:h-10 bg-green-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <CameraIcon className="w-3 sm:w-5 h-3 sm:h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Click the camera icon to upload a new picture
                  </p>
                </div>

               
                <div className="mt-3 sm:mt-6 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium capitalize ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-green-800' 
                      : 'bg-blue-100 text-green-800'
                  }`}>
                    {user?.role}
                  </span>
                </div>

               
                {user?.role === 'student' && user?.status && (
                  <div className="mt-1 sm:mt-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

           
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-200 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 gap-2 sm:gap-4">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Personal Information</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-blue-900 text-white text-xs sm:text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                 
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-3 text-gray-800 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-900 py-1 sm:py-2">{user?.fullName}</p>
                    )}
                  </div>

                 
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-3 py-1  text-gray-800 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-900 py-1 sm:py-2">{user?.email}</p>
                    )}
                  </div>

                
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-3 text-gray-800  py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-900 py-1 sm:py-2">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                
                  {user?.role === 'student' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Course of Study
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="courseOfStudy"
                          value={formData.courseOfStudy}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 text-gray-800 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Computer Science"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-900 py-1 sm:py-2">{user?.courseOfStudy}</p>
                      )}
                    </div>
                  )}

                
                  {user?.role === 'student' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Expected Graduation Year
                      </label>
                      {isEditing ? (
                        <select
                          name="enrollmentYear"
                          value={formData.enrollmentYear}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3  text-gray-800 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-900 py-1 sm:py-2">{user?.enrollmentYear}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Account Type
                </label>
                <p className="text-xs sm:text-sm text-gray-900 capitalize">{user?.role}</p>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Member Since
                </label>
                <p className="text-xs sm:text-sm text-gray-900">January 2025</p>
              </div>

              {user?.role === 'student' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Student ID
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">STU{user.id.padStart(6, '0')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Academic Status
                    </label>
                    <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;