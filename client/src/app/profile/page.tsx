"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { useAuth } from "../contexts/auth-context";
import { apiRequest } from "../utils/api";

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
  const [error, setError] = useState("");
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [router, isLoggedIn]);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");
      const response = await apiRequest("/api/users/profile");
      const profileData = await response.json();
      console.log("Profile data received:", profileData);

      // Pobierz pliki użytkownika
      console.log("Fetching user files...");
      const filesResponse = await apiRequest("/api/files/user");
      console.log("Files response status:", filesResponse.status);
      const filesData = await filesResponse.json();
      console.log("Files data received:", filesData);

      setProfile({
        ...profileData,
        files: filesData || [],
      });
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return;
    }

    setDeletingFiles((prev) => new Set(prev).add(fileId));

    try {
      const response = await apiRequest(`/file/${fileId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        // Refresh profile data to update the file list
        await fetchProfile();
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete file" }));
        setError(errorData.message || "Failed to delete file");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-64 items-center justify-center">
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl">
        <div className="text-center text-red-600">{error}</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl">
        <div className="text-center">Profile not found</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="font-bold text-2xl">{profile.username}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-500 text-sm">Member since {formatDate(profile.createdAt)}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 font-bold text-xl">My Files ({profile.files.length})</h2>

        {profile.files.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No files uploaded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">File Name</th>
                  <th className="p-2 text-left">Upload Date</th>
                  <th className="p-2 text-left">Downloads</th>
                  <th className="p-2 text-left">Protection</th>
                  <th className="p-2 text-left">Expires</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile.files.map((file) => (
                  <tr key={file.fileId} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{file.originalFileName}</div>
                      <div className="text-gray-500 text-xs">{file.fileId}</div>
                    </td>
                    <td className="p-2 text-gray-600 text-sm">{formatDate(file.createdAt)}</td>
                    <td className="p-2 text-sm">
                      {file.downloadCount}
                      {file.downloadLimit && ` / ${file.downloadLimit}`}
                    </td>
                    <td className="p-2">
                      {file.isPasswordProtected && (
                        <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                          Password Protected
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-gray-600 text-sm">
                      {file.expiryDate ? formatDateTime(file.expiryDate) : "Never"}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <a
                          href={getFileUrl(file.fileId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Share Link
                        </a>
                        <Button
                          onClick={() => handleDeleteFile(file.fileId)}
                          disabled={deletingFiles.has(file.fileId)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:border-red-400 hover:text-red-800"
                        >
                          {deletingFiles.has(file.fileId) ? "Deleting..." : "Delete"}
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
