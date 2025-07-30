'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { 
  UserIcon, 
  PencilIcon, 
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  TrashIcon,
  UserPlusIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  courseOfStudy: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
  profilePicture?: string;
  role: 'student' | 'admin'; 
}

const StudentDetailsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    courseOfStudy: string;
    enrollmentYear: number;
    status: Student['status'];
  }>({
    fullName: '',
    email: '',
    phone: '',
    courseOfStudy: '',
    enrollmentYear: new Date().getFullYear(),
    status: 'Active',
  });

  
  const mockStudents: Student[] = [
    {
      id: '2',
      fullName: 'John Doe',
      email: 'john.doe@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Computer Science',
      enrollmentYear: 2023,
      status: 'Active',
      role: 'student',
    },
    {
      id: '3',
      fullName: 'Jane Smith',
      email: 'jane.smith@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Software Engineering',
      enrollmentYear: 2022,
      status: 'Active',
      role: 'student',
    },
    {
      id: '4',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Data Science',
      enrollmentYear: 2021,
      status: 'Graduated',
      role: 'student',
    },
    {
      id: '5',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Computer Science',
      enrollmentYear: 2024,
      status: 'Active',
      role: 'student',
    },
  ];

  useEffect(() => {
    
    const pathParts = window.location.pathname.split('/');
    const studentId = pathParts[pathParts.length - 1];
   
    const foundStudent = mockStudents.find(s => s.id === studentId);
    
    if (foundStudent) {
      setStudent(foundStudent);
      setFormData({
        fullName: foundStudent.fullName,
        email: foundStudent.email,
        phone: foundStudent.phone || '',
        courseOfStudy: foundStudent.courseOfStudy,
        enrollmentYear: foundStudent.enrollmentYear,
        status: foundStudent.status,
      });
    } else {
      setError('Student not found');
    }
    
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) : value
    }));
    setError('');
  };

  const handleSave = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.courseOfStudy.trim()) {
      setError('Please fill in all required fields');
      return;
    }

   
    if (student) {
      const updatedStudent: Student = {
        ...student,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        courseOfStudy: formData.courseOfStudy,
        enrollmentYear: formData.enrollmentYear,
        status: formData.status,
        role: student.role, 
      };
      
      setStudent(updatedStudent);
      setIsEditing(false);
      setSuccess('Student information updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        email: student.email,
        phone: student.phone || '',
        courseOfStudy: student.courseOfStudy,
        enrollmentYear: student.enrollmentYear,
        status: student.status,
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
    
      alert('Student deleted successfully!');
      router.push('/students');
    }
  };

  const handlePromoteToAdmin = () => {
    if (confirm('Are you sure you want to promote this student to admin?')) {
     
      alert('Student promoted to admin successfully!');
    
      if (student) {
        setStudent({ ...student, role: 'admin' });
      }
    }
  };

  const getStatusColor = (status: Student['status']) => {
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i + 4);

  if (loading) {
    return (
     <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="flex items-center justify-center min-h-[24rem]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
     <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
            <p className="text-gray-600 mb-4">The student you're looking for doesn't exist.</p>
            <Link
              href="/students"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Students
            </Link>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
   <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
    
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/students"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
                <p className="text-gray-600">View and manage student information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handlePromoteToAdmin}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                    <span>Promote</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

        
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {student.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-16 h-16 text-gray-600" />
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {student.fullName}
                  </h2>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                    
                    {student.phone && (
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span className="text-sm">{student.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span className="text-sm">{student.courseOfStudy}</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm">Class of {student.enrollmentYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{student.fullName}</p>
                    )}
                  </div>

           
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{student.email}</p>
                    )}
                  </div>

           
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{student.phone || '-'}</p>
                    )}
                  </div>

              
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course of Study
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="courseOfStudy"
                        value={formData.courseOfStudy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{student.courseOfStudy}</p>
                    )}
                  </div>

               
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollment Year
                    </label>
                    {isEditing ? (
                      <select
                        name="enrollmentYear"
                        value={formData.enrollmentYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">{student.enrollmentYear}</p>
                    )}
                  </div>

            
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default StudentDetailsPage;
