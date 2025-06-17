'use client';

import { Button } from '../components/button';
import { useAuth } from '../contexts/auth-context';
import { apiRequest } from '../utils/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FileInfo {
  fileId: string;
  originalFileName: string;
  isPasswordProtected: boolean;
  downloadLimit?: number;
  downloadCount: number;
  expiryDate?: string;
  createdAt: string;
}

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
  files: FileInfo[];
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [router, isLoggedIn]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const response = await apiRequest('/api/users/profile');
      const profileData = await response.json();
      console.log('Profile data received:', profileData);
      
      // Pobierz pliki użytkownika
      console.log('Fetching user files...');
      const filesResponse = await apiRequest('/api/files/user');
      console.log('Files response status:', filesResponse.status);
      const filesData = await filesResponse.json();
      console.log('Files data received:', filesData);
      
      setProfile({
        ...profileData,
        files: filesData || []
      });
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileUrl = (fileId: string) => {
    return `/file/${fileId}`;
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    setDeletingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await apiRequest(`/file/${fileId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        // Refresh profile data to update the file list
        await fetchProfile();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete file' }));
        setError(errorData.message || 'Failed to delete file');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-64">
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto">
        <div className="text-red-600 text-center">{error}</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="max-w-4xl mx-auto">
        <div className="text-center">Profile not found</div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500">Member since {formatDate(profile.createdAt)}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">My Files ({profile.files.length})</h2>
        
        {profile.files.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">File Name</th>
                  <th className="text-left p-2">Upload Date</th>
                  <th className="text-left p-2">Downloads</th>
                  <th className="text-left p-2">Protection</th>
                  <th className="text-left p-2">Expires</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile.files.map((file) => (
                  <tr key={file.fileId} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{file.originalFileName}</div>
                      <div className="text-xs text-gray-500">{file.fileId}</div>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="p-2 text-sm">
                      {file.downloadCount}
                      {file.downloadLimit && ` / ${file.downloadLimit}`}
                    </td>
                    <td className="p-2">
                      {file.isPasswordProtected && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Password Protected
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {file.expiryDate ? formatDateTime(file.expiryDate) : 'Never'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <a
                          href={getFileUrl(file.fileId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Share Link
                        </a>
                        <Button
                          onClick={() => handleDeleteFile(file.fileId)}
                          disabled={deletingFiles.has(file.fileId)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800 border-red-300 hover:border-red-400"
                        >
                          {deletingFiles.has(file.fileId) ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage; 