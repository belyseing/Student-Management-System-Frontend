'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  AcademicCapIcon,
  StarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  const courses = [
    {
      title: 'Computer Science',
      instructor: 'Dr. Sarah Wilson',
      students: '2,847',
      rating: 4.9,
      duration: '16 weeks',
    },
    {
      title: 'Business Administration',
      instructor: 'Prof. Michael Chen',
      students: '1,923',
      rating: 4.8,
      duration: '12 weeks',
    },
    {
      title: 'Digital Marketing',
      instructor: 'Emma Rodriguez',
      students: '3,156',
      rating: 4.9,
      duration: '8 weeks',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b1e] via-[#132a33] to-[#081214] text-white relative overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#11191f] border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent">SMS</h1>
                <p className="text-sm text-gray-400 font-medium">Student Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-6 py-2.5 font-semibold text-white hover:text-green-300 bg-green-700 hover:bg-green-800 transition-all duration-300 rounded-lg"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-16 min-h-[calc(100vh-200px)] items-center">
            {/* Left Panel: Form */}
            <div className="bg-[#1a2c2f] p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-white">Sign in to SMS</h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm text-white mb-1" htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-[#0f1b1d] text-white placeholder-gray-400 focus:outline-none focus:ring-green-700 focus:border-green-600"
                    placeholder="belyse@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-1" htmlFor="password">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-[#0f1b1d] text-white focus:outline-none focus:ring-green-700 focus:border-green-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox accent-green-700" />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>

                  <Link href="/forgot-password" className="text-sm text-green-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-800 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-500 transition"
                >
                  Sign In
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-300">
                Don’t have an account?{' '}
                <Link href="/register" className="text-green-400 font-bold underline">
                  Register here
                </Link>
              </p>
            </div>

            {/* Right Panel: Dashboard Preview */}
            <div className="relative h-full min-h-[700px] lg:min-h-[800px]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-gray-900/20 rounded-3xl blur-3xl"></div>
              <div className="relative w-full h-full bg-[#172325] rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">School Portal</h3>
                      <p className="text-green-200 text-sm">Welcome back!</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 h-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-xl border border-green-700/40">
                      <div className="text-2xl font-bold text-green-100">2,847</div>
                      <div className="text-sm text-green-200">Active Students</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-xl border border-blue-700/40">
                      <div className="text-2xl font-bold text-blue-100">156</div>
                      <div className="text-sm text-blue-200">Courses</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Popular Courses</h4>
                    <div className="space-y-3">
                      {courses.slice(0, 2).map((course, index) => (
                        <div
                          key={index}
                          className="bg-[#1f2f31] rounded-xl p-4 shadow-sm border border-white/10 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-green-600 rounded-lg flex items-center justify-center">
                              <BookOpenIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white text-sm">{course.title}</div>
                              <div className="text-xs text-gray-400">{course.students} students</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-white">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0f1b1d] rounded-xl p-4 border border-white/10">
                    <h5 className="text-sm font-semibold text-white mb-3">Student Activity</h5>
                    <div className="flex items-end space-x-2 h-20">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-800 to-green-600 rounded-t opacity-90"
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 bg-gradient-to-r from-gray-900 via-green-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="border-t border-white/10 pt-8">
              <p className="text-white">
                © 2025 Student Management System. Built with for education.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
