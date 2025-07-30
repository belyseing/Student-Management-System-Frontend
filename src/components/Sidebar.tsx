'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  AcademicCapIcon, 
 
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['admin', 'student'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      roles: ['admin', 'student'],
    },
    {
      name: 'Students',
      href: '/students',
      icon: AcademicCapIcon,
      roles: ['admin'],
    },
  ];

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-green-800">SMS</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Student Management</p>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;