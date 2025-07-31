'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';

import {
  UserIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  TrashIcon,
  UserPlusIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface StudentFromAPI {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  courseOfStudy: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
  profilePicture?: string;
  role: 'student' | 'admin';
  createdAt?: string;
}

interface DisplayStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseOfStudy: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
  profilePicture?: string;
  role: 'student' | 'admin';
}

const StudentDetailsPage: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<DisplayStudent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseOfStudy: '',
    enrollmentYear: new Date().getFullYear(),
    status: 'Active' as DisplayStudent['status'],
  });

  useEffect(() => {
    if (!studentId) {
      setError('Student ID not found in URL.');
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found. Please log in.");

        const response = await fetch(`${apiBaseUrl}/students/one/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Student not found.");
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch student data');
        }

        const data: StudentFromAPI = await response.json();

        const transformedStudent: DisplayStudent = {
          id: data._id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || 'N/A',
          courseOfStudy: data.courseOfStudy,
          enrollmentYear: data.enrollmentYear,
          status: data.status,
          role: data.role,
          profilePicture: data.profilePicture,
        };

        setStudent(transformedStudent);
        setFormData({
          fullName: transformedStudent.fullName,
          email: transformedStudent.email,
          phone: transformedStudent.phone === 'N/A' ? '' : transformedStudent.phone,
          courseOfStudy: transformedStudent.courseOfStudy,
          enrollmentYear: transformedStudent.enrollmentYear,
          status: transformedStudent.status,
        });

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, apiBaseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) : value
    }));
    setError('');
  };

  const handleSave = async () => {
    if (!student) {
      toast.error("Cannot save. Student data is not loaded correctly.");
      return;
    }
    if (!formData || !student) {
      toast.error("Cannot save. Student data is not loaded correctly.");
      return;
    }

    if (!formData.fullName?.trim() || !formData.email?.trim() || !formData.courseOfStudy?.trim()) {
      toast.error('Full Name, Email, and Course of Study are required.');
      return;
    }

    setIsSaving(true);
    const submissionData = new FormData();

    submissionData.append('fullName', formData.fullName);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone);
    submissionData.append('courseOfStudy', formData.courseOfStudy);
    submissionData.append('enrollmentYear', (formData.enrollmentYear ?? new Date().getFullYear()).toString());
    submissionData.append('status', formData.status);

    if (selectedImage) {
      submissionData.append('image', selectedImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed.");
      }

      const updatedData: StudentFromAPI = await response.json();

      const updatedStudent: DisplayStudent = {
        id: updatedData._id,
        fullName: updatedData.fullName,
        email: updatedData.email,
        phone: updatedData.phone || '',
        courseOfStudy: updatedData.courseOfStudy,
        enrollmentYear: updatedData.enrollmentYear,
        status: updatedData.status,
        role: updatedData.role,
        profilePicture: updatedData.profilePicture || '/default-avatar.png',
      };

      setStudent(updatedStudent);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      toast.success('Student information updated successfully!');

    } catch (error: any) {
      toast.error(error.message || 'Failed to update student.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!student) {
      toast.error("Cannot cancel. Student data not loaded.");
      return;
    }
    if (student) {
      setFormData({
        fullName: student.fullName,
        email: student.email,
        phone: student.phone === 'N/A' ? '' : student.phone,
        courseOfStudy: student.courseOfStudy,
        enrollmentYear: student.enrollmentYear,
        status: student.status,
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (!student) {
      toast.error("Cannot delete. Student data not loaded.");
      return;
    }
    if (student && window.confirm('Are you sure you want to delete this student? This action is irreversible.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/students/${student.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Delete operation failed.");

        toast.success('Student deleted successfully!');
        router.push('/students');
      } catch (error) {
        toast.error('Failed to delete student.');
        console.error(error);
      }
    }
  };

  const handlePromoteToAdmin = async () => {
    if (student && window.confirm('Are you sure you want to promote this student to an Admin role?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("You are not authenticated.");

        const response = await fetch(`${apiBaseUrl}/users/change-role/${student.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: 'admin' })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Promotion failed.");
        }

        setStudent({ ...student, role: 'admin' });
        toast.success('Student promoted to Admin!');

      } catch (error: any) {
        toast.error(error.message || 'Failed to promote student.');
        console.error(error);
      }
    }
  };

  const getStatusColor = (status: DisplayStudent['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Graduated': return 'bg-blue-100 text-blue-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i + 4);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="flex items-center justify-center min-h-[24rem]">
            Loading....
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !student) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error ? "An Error Occurred" : "Student Not Found"}</h2>
            <p className="text-gray-600 mb-4">{error || "The student you're looking for doesn't exist."}</p>
            <Link href="/students" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
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
            <Link href="/students" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg">
                    <PencilIcon className="w-4 h-4" /> <span>Edit</span>
                  </button>
                  {student.role !== 'admin' && (
                    <button onClick={handlePromoteToAdmin} className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg">
                      <UserPlusIcon className="w-4 h-4" /> <span>Promote</span>
                    </button>
                  )}
                  <button onClick={handleDelete} className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg">
                    <TrashIcon className="w-4 h-4" /> <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-center">
                <UserIcon className="w-32 h-32 text-gray-400 bg-gray-200 p-4 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-1">{student.fullName}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
                {student.role === 'admin' && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button onClick={handleSave} className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded">
                      <CheckIcon className="w-4 h-4" /> <span>Save</span>
                    </button>
                    <button onClick={handleCancel} className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded">
                      <XMarkIcon className="w-4 h-4" /> <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? <input title='h' type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-2 border rounded-lg" /> : <p className="text-gray-900 py-2">{student.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? <input title='h' type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-lg" /> : <p className="text-gray-900 py-2">{student.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? <input title='j' type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded-lg" /> : <p className="text-gray-900 py-2">{student.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  {isEditing ? <input title='j' type="text" name="courseOfStudy" value={formData.courseOfStudy} onChange={handleInputChange} className="w-full p-2 border rounded-lg" /> : <p className="text-gray-900 py-2">{student.courseOfStudy}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  {isEditing ? <select title='s' name="enrollmentYear" value={formData.enrollmentYear} onChange={handleInputChange} className="w-full p-2 border rounded-lg">{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}</select> : <p className="text-gray-900 py-2">{student.enrollmentYear}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {isEditing ? <select title='s' name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded-lg"><option value="Active">Active</option><option value="Graduated">Graduated</option><option value="Dropped">Dropped</option></select> : <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>{student.status}</span>}
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