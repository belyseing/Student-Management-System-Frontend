'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  AcademicCapIcon,
  StarIcon,
  BookOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const router = useRouter();
  
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
        setError('API configuration error. Please contact an administrator.');
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Login failed. Please check your credentials.');
      }

      const { user, token } = result;
      const userRole = user?.role;

      if (!userRole || !token) {
        throw new Error('Login response from server was invalid.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user?._id);

      switch (userRole.toLowerCase()) {
        case 'student':
          router.push('/dashboard');
          break;
        case 'admin':
          router.push('/students');
          break;
        default:
          router.push('/');
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    { title: 'Computer Science', students: '2,847', rating: 4.9 },
    { title: 'Business Administration', students: '1,923', rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
     
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent">TechUni</h1>
                <p className="text-sm text-gray-600 font-medium">Student Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/register" className="px-6 py-2.5 font-semibold text-white bg-green-700 hover:bg-green-800 transition-all duration-300 rounded-lg">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>


      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto border border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign in to TechUni</h2>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 border border-red-200">
                  <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., admin@university.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-green-600 font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>

           
            <div className="relative h-full min-h-[700px] lg:min-h-[00px]">
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
                    <div className="bg-gradient-to-br from-blue-300 to-blue-600 p-4 rounded-xl border border-blue-600/40">
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
                          <div className="flex items-center space-x-4 ">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-600 rounded-lg flex items-center justify-center">
                              <BookOpenIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-sm">{course.title}</div>
                              <div className="text-xs text-gray-500">{course.students} students</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-800 ">{course.rating} </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white text-gray-700 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Student Management System. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;