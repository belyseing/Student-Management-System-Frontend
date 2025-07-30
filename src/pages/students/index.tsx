'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { 
  UserIcon, 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserPlusIcon
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
}

const StudentsIndexPage: React.FC = () => {
  const { user } = useAuth();
  
 
  const [students, setStudents] = useState<Student[]>([
    {
      id: '2',
      fullName: 'John Doe',
      email: 'john.doe@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Computer Science',
      enrollmentYear: 2023,
      status: 'Active',
    },
    {
      id: '3',
      fullName: 'Jane Smith',
      email: 'jane.smith@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Software Engineering',
      enrollmentYear: 2022,
      status: 'Active',
    },
    {
      id: '4',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Data Science',
      enrollmentYear: 2021,
      status: 'Graduated',
    },
    {
      id: '5',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Computer Science',
      enrollmentYear: 2024,
      status: 'Active',
    },
    {
      id: '6',
      fullName: 'David Brown',
      email: 'david.brown@student.edu',
      phone: '+250 734567891',
      courseOfStudy: 'Cybersecurity',
      enrollmentYear: 2023,
      status: 'Dropped',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseOfStudy: '',
    enrollmentYear: new Date().getFullYear(),
    status: 'Active' as const,
  });


  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.courseOfStudy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = !filterCourse || student.courseOfStudy === filterCourse;
      const matchesStatus = !filterStatus || student.status === filterStatus;
      
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, searchTerm, filterCourse, filterStatus]);


  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(students.map(s => s.courseOfStudy)));
  }, [students]);

  const handleAddStudent = () => {
    if (!newStudent.fullName || !newStudent.email || !newStudent.courseOfStudy) {
      alert('Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: String(students.length + 1),
      ...newStudent,
    };

    setStudents([...students, student]);
    setNewStudent({
      fullName: '',
      email: '',
      phone: '',
      courseOfStudy: '',
      enrollmentYear: new Date().getFullYear(),
      status: 'Active',
    });
    setShowAddModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: Student['status']) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ));
  };

  const getStatusColor = (status: string) => {
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.status === 'Active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Graduates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.status === 'Graduated').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueCourses.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

   
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
        
              <div className="flex-1 text-black">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

            
              <div className="w-full lg:w-48 text-black">
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

       
              <div className="w-full lg:w-48 text-black">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
            </div>
          </div>

       
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Course</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Year</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            {student.profilePicture ? (
                              <img
                                src={student.profilePicture}
                                alt={student.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-6 h-6 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.fullName}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {student.courseOfStudy}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {student.enrollmentYear}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student.id, e.target.value as Student['status'])}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(student.status)}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Dropped">Dropped</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/students/${student.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            )}
          </div>
        </div>

 
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Student</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course of Study *
                  </label>
                  <input
                    type="text"
                    value={newStudent.courseOfStudy}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, courseOfStudy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Graduation Year
                  </label>
                  <select
                    value={newStudent.enrollmentYear}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, enrollmentYear: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default StudentsIndexPage;