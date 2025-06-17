'use client';

import { Button } from '../../components/button';
import { Download, Lock, Copy } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FileMetadata {
  fileId: string;
  originalFileName: string;
  fileSize: number;
  isPasswordProtected: boolean;
  downloadLimit?: number;
  downloadCount: number;
  expiryDate?: string;
  createdAt: string;
}

const FileDownloadPage = () => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null | undefined>(undefined);

  useEffect(() => {
    loadFileMetadata();
  }, [id]);

  const loadFileMetadata = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/files/${id}/metadata`);
      if (response.ok) {
        const metadata = await response.json();
        setFileMetadata(metadata);
        setNeedsPassword(metadata.isPasswordProtected);
      } else {
        setFileMetadata(null);
      }
    } catch {
      setFileMetadata(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (withPassword = false) => {
    setIsLoading(true);
    setError('');

    try {
      const url = new URL(`http://localhost:8081/api/files/download/${id}`);
      if (withPassword && password) {
        url.searchParams.append('password', password);
      }

      const response = await fetch(url.toString());

      if (response.ok) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = fileMetadata?.originalFileName || `file-${id}`;
        
        if (contentDisposition) {
          // Try multiple patterns to extract filename
          const patterns = [
            /filename\*=UTF-8''([^;]+)/,  // filename*=UTF-8''filename.txt
            /filename="([^"]+)"/,         // filename="filename.txt"
            /filename=([^;]+)/            // filename=filename.txt
          ];
          
          for (const pattern of patterns) {
            const match = contentDisposition.match(pattern);
            if (match) {
              filename = decodeURIComponent(match[1]);
              break;
            }
          }
        }

        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
        
        if (response.status === 401) {
          setNeedsPassword(true);
          setError('Password required or incorrect');
        } else if (response.status === 410) {
          setError('This file has expired');
        } else if (response.status === 429) {
          setError('Download limit has been reached');
        } else {
          setError(errorData.message || 'Download failed');
        }
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (fileMetadata === undefined) {
    return (
      <main className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Loading file information...</p>
        </div>
      </main>
    );
  }

  if (fileMetadata === null) {
    return (
      <main className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">File Not Found</h1>
          <p className="text-gray-600">The file you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <Download className="mx-auto mb-4 text-indigo-600" size={48} />
          <h1 className="text-2xl font-bold mb-2">{fileMetadata.originalFileName}</h1>
          <div className="text-gray-600 space-y-1">
            <p>Size: {formatFileSize(fileMetadata.fileSize)}</p>
            <p>Downloads: {fileMetadata.downloadCount}{fileMetadata.downloadLimit ? ` / ${fileMetadata.downloadLimit}` : ''}</p>
            {fileMetadata.expiryDate && (
              <p>Expires: {new Date(fileMetadata.expiryDate).toLocaleString()}</p>
            )}
          </div>
        </div>

        {needsPassword && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">This file is password protected</span>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDownload(true);
                }
              }}
            />
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleDownload(needsPassword)}
            disabled={isLoading || (needsPassword && !password)}
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Downloading...' : 'Download File'}
          </Button>

          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                // Could add toast notification here
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Copy size={16} />
            Copy Share Link
          </Button>
        </div>

        {!needsPassword && (
          <p className="text-xs text-gray-500 text-center mt-3">
            Click download to get the file or copy the link to share
          </p>
        )}
      </div>
    </main>
  );
};

export default FileDownloadPage;
