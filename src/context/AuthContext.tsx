'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'student';
  profilePicture?: string;
  courseOfStudy?: string;
  enrollmentYear?: number;
  status?: 'Active' | 'Graduated' | 'Dropped';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  courseOfStudy?: string;
  enrollmentYear?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mockUsers: User[] = [
    {
      id: '1',
      fullName: 'Quicktech Admin',
      email: 'admin@quicktech.com',
      phone: '+250 788 123 456',
      role: 'admin',
      profilePicture: '',
    },
    {
      id: '2',
      fullName: 'Ingabire Belyse',
      email: 'belyse@student.edu',
      phone: '+250 788 234 567',
      role: 'student',
      courseOfStudy: 'Computer Science',
      enrollmentYear: 2023,
      status: 'Active',
    },
    {
      id: '3',
      fullName: 'Mpore Igor',
      email: 'igor@student.edu',
      phone: '+250 788 345 678',
      role: 'student',
      courseOfStudy: 'Software Engineering',
      enrollmentYear: 2022,
      status: 'Active',
    },
  ];

  const mockCredentials: Record<string, string> = {
    'admin@quicktech.com': 'QuicktechAdmin2024!',
    'belyse@student.edu': 'BelysePassword123!',
    'igor@student.edu': 'IgorPassword456!'
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const mockUser = mockUsers.find(u => u.email === email);
      const correctPassword = mockCredentials[email];

      if (!mockUser || password !== correctPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      const mockToken = `mock-jwt-token-${mockUser.id}`;
      
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }

      const newUser: User = {
        id: String(mockUsers.length + 1),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: 'student', 
        courseOfStudy: userData.courseOfStudy,
        enrollmentYear: userData.enrollmentYear,
        status: 'Active',
      };

      mockUsers.push(newUser);
      mockCredentials[userData.email] = userData.password;

      const mockToken = `mock-jwt-token-${newUser.id}`;
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};