'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';


import {
  UserIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';


interface StudentFromAPI {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  course: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
  profilePicture?: string;
  createdAt?: string; 
}


interface DisplayStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
  profilePicture?: string;
}

const StudentsIndexPage: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [students, setStudents] = useState<DisplayStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  

  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    password: '', 
    phone: '',
    course: '',
    enrollmentYear: new Date().getFullYear(),
    status: 'Active' as const,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch(`${apiBaseUrl}/students`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch students');
        }

        const data: StudentFromAPI[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API response is not an array as expected.");
        }
        
        const sortedData = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });

        const transformedStudents: DisplayStudent[] = sortedData.map((student) => ({
          id: student._id,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone || 'N/A',
          course: student.course,
          enrollmentYear: student.enrollmentYear,
          status: student.status,
          profilePicture: student.profilePicture,
        }));

        setStudents(transformedStudents);

      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [apiBaseUrl]);


  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (student.fullName?.toLowerCase() ?? '').includes(searchLower) ||
        (student.email?.toLowerCase() ?? '').includes(searchLower) ||
        (student.course?.toLowerCase() ?? '').includes(searchLower);
      
      const matchesCourse = !filterCourse || student.course === filterCourse;
      const matchesStatus = !filterStatus || student.status === filterStatus;
      
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, searchTerm, filterCourse, filterStatus]);

 
 const uniqueCourses = useMemo(() => {
  return Array.from(new Set(students.map(s => s.course).filter(Boolean)));
}, [students]);

 
  const handleAddStudent = async () => {
 
    if (!newStudent.fullName || !newStudent.email || !newStudent.course || !newStudent.password) {
      toast.error('Please fill in all required fields, including password');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing. Please log in again.');
        return;
      }
      
      const response = await fetch(`${apiBaseUrl}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`,
        },
       
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add student');
      }

      const createdStudent: StudentFromAPI = await response.json();
      
      const displayStudent: DisplayStudent = {
        id: createdStudent._id,
        fullName: createdStudent.fullName,
        email: createdStudent.email,
        phone: createdStudent.phone || 'N/A',
        course: createdStudent.course,
        enrollmentYear: createdStudent.enrollmentYear,
        status: createdStudent.status,
        profilePicture: createdStudent.profilePicture,
      };
      
     
      setStudents(prev => [displayStudent, ...prev]);
      toast.success('Student added successfully!');
      setShowAddModal(false);
      
      
      setNewStudent({
        fullName: '',
        email: '',
        password: '', 
        phone: '',
        course: '',
        enrollmentYear: new Date().getFullYear(),
        status: 'Active',
      });

    } catch (error: any) {
      toast.error(error.message || 'An error occurred while adding the student.');
      console.error(error);
    }
  };


  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const originalStudents = [...students];
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/students/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Delete failed.");
        }
        toast.success("Student deleted successfully.");

      } catch (error) {
        toast.error("Failed to delete student.");
        setStudents(originalStudents);
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: DisplayStudent['status']) => {
    const originalStudents = [...students];
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/students/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Status update failed.");
        }
        toast.success("Status updated.");

    } catch (error) {
        toast.error("Failed to update status.");
        setStudents(originalStudents);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Graduated': return 'bg-blue-100 text-blue-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i + 4);

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="space-y-6">
  
         
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>
              <p className="text-gray-600">Manage student accounts and information</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
             <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'Active').length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Graduates</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'Graduated').length}</p>
            </div>
             <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueCourses.length}</p>
            </div>
          </div>

         
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
             <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <select
                  title="Filter by course"
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full lg:w-48 px-3 py-2 border rounded-lg"
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
                <select
                  title="Filter by status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full lg:w-48 px-3 py-2 border rounded-lg"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Dropped">Dropped</option>
                </select>
             </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                    Loading...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-6">Student</th>
                      <th className="text-left py-3 px-6">Course</th>
                      <th className="text-left py-3 px-6">Year</th>
                      <th className="text-left py-3 px-6">Status</th>
                      <th className="text-left py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <p className="font-medium">{student.fullName}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </td>
                          <td className="py-4 px-6">{student.course}</td>
                          <td className="py-4 px-6">{student.enrollmentYear}</td>
                          <td className="py-4 px-6">
                            <select
                              title={`Change status for ${student.fullName}`}
                              value={student.status}
                              onChange={(e) => handleStatusChange(student.id, e.target.value as DisplayStudent['status'])}
                              className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(student.status)}`}
                            >
                              <option value="Active">Active</option>
                              <option value="Graduated">Graduated</option>
                              <option value="Dropped">Dropped</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Link href={`/students/${student.id}`} title="View Details">
                                <EyeIcon className="w-4 h-4 text-blue-600"/>
                              </Link>
                              <button onClick={() => handleDeleteStudent(student.id)} title="Delete Student">
                                <TrashIcon className="w-4 h-4 text-red-600"/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-12">
                                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No students found for the current filters.</p>
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-lg p-6 w-full max-w-md">
                 <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
                 <div className="space-y-4">
                    <input
                        type="text"
                        value={newStudent.fullName}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Full Name *"
                    />
                    <input
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Email *"
                    />
                   
                    <input
                        type="password"
                        value={newStudent.password}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Password *"
                        autoComplete="new-password"
                    />
                     <input
                        type="tel"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Phone"
                    />
                    <input
                        type="text"
                        value={newStudent.course}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, courseOfStudy: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Course of Study *"
                    />
                    <select
                        title="Select enrollment year"
                        value={newStudent.enrollmentYear}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, enrollmentYear: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                 </div>
                 <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button onClick={handleAddStudent} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Student</button>
                 </div>
             </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default StudentsIndexPage;