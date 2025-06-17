"use client";

import { Copy, Download, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/button";

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
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null | undefined>(undefined);

  useEffect(() => {
    loadFileMetadata();
  }, []);

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
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const handleDownload = async (withPassword = false) => {
    setIsLoading(true);
    setError("");

    try {
      const url = new URL(`http://localhost:8081/api/files/download/${id}`);
      if (withPassword && password) {
        url.searchParams.append("password", password);
      }

      const response = await fetch(url.toString());

      if (response.ok) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = fileMetadata?.originalFileName || `file-${id}`;

        if (contentDisposition) {
          // Try multiple patterns to extract filename
          const patterns = [
            /filename\*=UTF-8''([^;]+)/, // filename*=UTF-8''filename.txt
            /filename="([^"]+)"/, // filename="filename.txt"
            /filename=([^;]+)/, // filename=filename.txt
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
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Download failed" }));

        if (response.status === 401) {
          setNeedsPassword(true);
          setError("Password required or incorrect");
        } else if (response.status === 410) {
          setError("This file has expired");
        } else if (response.status === 429) {
          setError("Download limit has been reached");
        } else {
          setError(errorData.message || "Download failed");
        }
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (fileMetadata === undefined) {
    return (
      <main className="mx-auto max-w-md text-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p>Loading file information...</p>
        </div>
      </main>
    );
  }

  if (fileMetadata === null) {
    return (
      <main className="mx-auto max-w-md text-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 font-bold text-2xl text-red-600">File Not Found</h1>
          <p className="text-gray-600">
            The file you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <Download className="mx-auto mb-4 text-indigo-600" size={48} />
          <h1 className="mb-2 font-bold text-2xl">{fileMetadata.originalFileName}</h1>
          <div className="space-y-1 text-gray-600">
            <p>Size: {formatFileSize(fileMetadata.fileSize)}</p>
            <p>
              Downloads: {fileMetadata.downloadCount}
              {fileMetadata.downloadLimit ? ` / ${fileMetadata.downloadLimit}` : ""}
            </p>
            {fileMetadata.expiryDate && (
              <p>Expires: {new Date(fileMetadata.expiryDate).toLocaleString()}</p>
            )}
          </div>
        </div>

        {needsPassword && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <Lock size={16} className="text-yellow-600" />
              <span className="font-medium text-gray-700 text-sm">
                This file is password protected
              </span>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleDownload(true);
                }
              }}
            />
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
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
            {isLoading ? "Downloading..." : "Download File"}
          </Button>

          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                // Could add toast notification here
              } catch (err) {
                console.error("Failed to copy:", err);
              }
            }}
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
          >
            <Copy size={16} />
            Copy Share Link
          </Button>
        </div>

        {!needsPassword && (
          <p className="mt-3 text-center text-gray-500 text-xs">
            Click download to get the file or copy the link to share
          </p>
        )}
      </div>
    </main>
  );
};

export default FileDownloadPage;
