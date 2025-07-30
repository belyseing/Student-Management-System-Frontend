'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  AcademicCapIcon,
  StarIcon,
  BookOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail('admin@university.edu');
      setPassword('admin123');
    } else {
      setEmail('john.doe@student.edu');
      setPassword('student123');
    }
  };

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
    <div className="min-h-screen bg-gray-100 text-gray-800 relative overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent">SMS</h1>
                <p className="text-sm text-gray-600 font-medium">Student Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/register"
                className="px-6 py-2.5 font-semibold text-white hover:text-green-100 bg-green-700 hover:bg-green-800 transition-all duration-300 rounded-lg"
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
            <div className="bg-gray-50 p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto border border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign in to SMS</h2>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                  <ExclamationCircleIcon className="w-5 h-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="belyse@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                    Password:
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-green-600" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>

                  <p className="text-sm text-green-600 hover:underline">
                    Forgot password?
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold rounded-lg shadow hover:from-green-600 hover:to-green-500 transition disabled:opacity-70"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-green-600 font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            <div className="relative h-full min-h-[700px] lg:min-h-[800px]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-gray-100 rounded-3xl blur-3xl"></div>
              <div className="relative w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">School Portal</h3>
                      <p className="text-green-100 text-sm">Welcome back!</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 h-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-700 to-green-600 p-4 rounded-xl border border-green-600/40">
                      <div className="text-2xl font-bold text-green-50">2,847</div>
                      <div className="text-sm text-green-100">Active Students</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-700 to-blue-600 p-4 rounded-xl border border-blue-600/40">
                      <div className="text-2xl font-bold text-blue-50">156</div>
                      <div className="text-sm text-blue-100">Courses</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular Courses</h4>
                    <div className="space-y-3">
                      {courses.slice(0, 2).map((course, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-600 rounded-lg flex items-center justify-center">
                              <BookOpenIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-sm">{course.title}</div>
                              <div className="text-xs text-gray-500">{course.students} students</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-800">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-800 mb-3">Student Activity</h5>
                    <div className="flex items-end space-x-2 h-20">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-600 to-green-500 rounded-t opacity-90"
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

      <footer className="mt-32 bg-white text-gray-700  border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div>
              <p className="text-gray-600">
                © 2025 Student Management System. Built for education.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;