'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    courseOfStudy: '',
    enrollmentYear: new Date().getFullYear(),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) : value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return setError('Full name is required'), false;
    if (!formData.email.trim()) return setError('Email is required'), false;
    if (!formData.email.includes('@')) return setError('Enter a valid email'), false;
    if (formData.password.length < 6) return setError('Password too short'), false;
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match'), false;
    if (!formData.courseOfStudy.trim()) return setError('Course of study is required'), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        courseOfStudy: formData.courseOfStudy,
        enrollmentYear: formData.enrollmentYear,
      });

      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i + 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b1e] via-[#132a33] to-[#081214] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-700 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join the Student Management System</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-600/10 border border-red-400 rounded-lg p-4 flex items-center space-x-2 text-red-300">
                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-600/10 border border-green-400 rounded-lg p-4 flex items-center space-x-2 text-green-300">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <InputField id="fullName" label="Full Name *" value={formData.fullName} onChange={handleChange} />
            <InputField id="email" label="Email Address *" type="email" value={formData.email} onChange={handleChange} />
            <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} />
            <InputField
              id="courseOfStudy"
              label="Course of Study *"
              value={formData.courseOfStudy}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
            <div>
              <label htmlFor="enrollmentYear" className="block text-sm font-medium text-gray-300 mb-2">
                Expected Graduation Year
              </label>
              <select
                id="enrollmentYear"
                name="enrollmentYear"
                value={formData.enrollmentYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <PasswordField
              id="password"
              label="Password *"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              toggleShow={() => setShowPassword((prev) => !prev)}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword((prev) => !prev)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 underline">
              Sign in here
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = 'text', value, onChange, placeholder = '' }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={label.includes('*')}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const PasswordField = ({ id, label, value, onChange, show, toggleShow }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
      />
      <button type="button" onClick={toggleShow} className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {show ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
      </button>
    </div>
  </div>
);

export default RegisterPage;