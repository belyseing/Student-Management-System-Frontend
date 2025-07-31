'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout'; // Adjust path if needed
import ProtectedRoute from '../components/ProtectedRoute'; // Adjust path if needed
import { 
  UserIcon, 
  PencilIcon, 
  CheckIcon,
  XMarkIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';


interface UserProfile {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  courseOfStudy?: string;
  enrollmentYear?: number;
  image?: string;
  profilePicture?: string; 
  role?: 'student' | 'admin';
  status?: 'Active' | 'Graduated' | 'Dropped';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 
const DEFAULT_AVATAR = '/default-avatar.png'; 


const UPLOAD_FIELD_NAME = 'image'; 


const getSafeImageUrl = (path?: string): string => {
  if (!path) return DEFAULT_AVATAR;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  return `${API_BASE_URL}/${path}`;
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const previewUrlRef = useRef<string | null>(null);

 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR);


  useEffect(() => {
    return () => {
      if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          let msg = `Failed to fetch profile data. Status ${response.status}`;
          try {
            const err = await response.json();
            if (err.message) msg += `: ${err.message}`;
          } catch {} 
          throw new Error(msg);
        }

        const data = await response.json();
        const userData: UserProfile = data.user || data;
        setUser(userData);
        const finalImage = userData.profilePicture ?? userData.image;
        setImagePreview(getSafeImageUrl(finalImage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const blobUrl = URL.createObjectURL(file);
  
      if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = blobUrl;
      setImagePreview(blobUrl); 
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!user.fullName?.trim()) {
      setError('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('fullName', user.fullName || '');
    formData.append('phone', user.phone || '');
    
    if (imageFile) {
      formData.append(UPLOAD_FIELD_NAME, imageFile); 
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me/${user._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMsg += `: ${errorData.message}`;
          else errorMsg += `: ${JSON.stringify(errorData)}`;
        } catch {
          const text = await response.text();
          errorMsg += `: ${text}`;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      const updatedUser: UserProfile = result.user || result;

      setUser(updatedUser);
      const newImagePath = updatedUser.profilePicture ?? updatedUser.image;
      setImagePreview(getSafeImageUrl(newImagePath));
      setImageFile(null);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    
    if (user) {
      const finalImage = user.profilePicture ?? user.image;
      setImagePreview(getSafeImageUrl(finalImage));
      setImageFile(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{success}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  {isEditing && (
                    <label
                      htmlFor="imageUpload"
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                    >
                      <CameraIcon className="w-5 h-5 text-gray-600" />
                      <input title='v' id="imageUpload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold">{user?.fullName}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <span className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
            </div>

          
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button onClick={handleSave} disabled={saving} className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-green-400">
                        <CheckIcon className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button onClick={handleCancel} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input title="g" type="text" name="fullName" value={user?.fullName || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.fullName || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-gray-500 py-2">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input title="g" type="text" name="phone" value={user?.phone || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.phone || 'Not Provided'}</p>
                    )}
                  </div>
                  {user?.role === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <p className="text-gray-900 py-2 font-mono">STU-{user?._id?.slice(-6).toUpperCase()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;