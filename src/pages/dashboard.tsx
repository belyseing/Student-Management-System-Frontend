'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { UserIcon } from '@heroicons/react/24/outline';
import { 
  BookOpenIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const studentData = {
    currentCourses: 4,
    completedCourses: 12,
    gpa: 3.7,
    upcomingAssignments: 3,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b1e] via-[#132a33] to-[#081214] text-white relative overflow-hidden">
      <ProtectedRoute>
        <Layout>
          <div className="space-y-6 pb-20"> 
           
            <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.fullName.split(' ')[0]}!
              </h1>
              <p className="opacity-90">
                Ready to continue your learning journey?
              </p>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.currentCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.completedCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current GPA</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.gpa}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assignments Due</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.upcomingAssignments}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Advanced Web Development</h4>
                      <span className="text-sm text-green-600 font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Next assignment due: Aug 15</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Database Systems</h4>
                      <span className="text-sm text-blue-600 font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Midterm: Aug 20</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Software Engineering</h4>
                      <span className="text-sm text-purple-600 font-medium">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Project presentation: Aug 25</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BellIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Assignment reminder</p>
                      <p className="text-xs text-gray-500">Web Development project due in 3 days</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Midterm Schedule</p>
                      <p className="text-xs text-gray-500">Database Systems midterm on Aug 20</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Grade Updated</p>
                      <p className="text-xs text-gray-500">Software Engineering assignment graded: A</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-10"> 
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Update Profile</span>
                </button>
                
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Courses</span>
                </button>
                
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">View Grades</span>
                </button>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    </div>
  );
};

export default DashboardPage;




