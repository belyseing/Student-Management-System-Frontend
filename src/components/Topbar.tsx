'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BellIcon, 
  UserIcon, 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    fullName: string;
    email: string;
    image?: string;
    role?: string;
}

const Topbar: React.FC = () => {
    const router = useRouter();


    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

  
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!token || !userId || !apiBaseUrl) {
                console.warn("User data or API config not found for profile fetching.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiBaseUrl}/users/me/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                
              
                if (data.user) {
                    setUser(data.user);
                }

            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUser(null); 
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

   
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
           
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

  
    const firstName = user?.fullName?.split(' ')[0] ?? 'User';
    const userRole = user?.role ?? 'student';

   
    if (loading) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200 animate-pulse">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="flex items-center space-x-4">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

 
    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            router.push('/');
        } catch (error) {
            console.error('An error occurred during local logout:', error);
           
            router.push('/');
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
             
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Welcome back, {firstName}!
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    
                    <button 
                        title="Notifications"
                        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                   
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                              
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.fullName ?? 'User Profile'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.fullName ?? 'User Name'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {userRole}
                                </p>
                            </div>
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </button>

                       
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.fullName ?? 'User Name'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email ?? 'user@example.com'}
                                    </p>
                                </div>
                                
                                <Link
                                    href="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span>View Profile</span>
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;