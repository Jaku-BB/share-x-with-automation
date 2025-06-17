"use client";

import { ArrowUpFromLine, Copy, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/app/components/button";
import { FilePreview } from "~/app/components/file-preview";
import { classNameMerge } from "~/app/utils/class-name-merge";
import { toast, Toaster } from "sonner";
import { apiRequest } from "../utils/api";
import { useAuth } from "../contexts/auth-context";

interface FormData {
  fileList: FileList;
  password?: string;
  downloadLimit?: number;
  expiryDate?: string;
}

const BASE_URL = typeof window !== 'undefined' && window.location 
  ? `${window.location.protocol}//${window.location.host}` 
  : 'http://localhost:3000';

export const FileForm = () => {
  const [isFileOverInput, setIsFileOverInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const { handleSubmit, register, formState, watch, setError, reset } =
    useForm<FormData>();

  const fileInputValue = watch("fileList");
  const fileInputError = formState.errors.fileList;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router, isLoggedIn]);

  const onFormSubmission: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted with data:", data);
    
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting...");
      router.push('/login');
      return;
    }

    const requestBody = new FormData();
    requestBody.append("file", data.fileList[0]);
    
    if (data.password) {
      requestBody.append("password", data.password);
    }
    
    if (data.downloadLimit && data.downloadLimit > 0) {
      requestBody.append("downloadLimit", data.downloadLimit.toString());
    }
    
    if (data.expiryDate) {
      requestBody.append("expiryDate", new Date(data.expiryDate).toISOString());
    }

    try {
      setIsLoading(true);
      console.log("Sending file upload request...");

      const response = await apiRequest("/api/files/upload", {
        method: "POST",
        body: requestBody,
      });
      
      console.log("Response received:", response.status);

      if (!response.ok) {
        switch (response.status) {
          case 400:
            return setError("fileList", {
              message: "File is required!",
            });

          case 413:
            return setError("fileList", {
              message: "File size should be less than 100 MB!",
            });

          default:
            return toast.error("Error!", {
              description: "Please, try again...",
            });
        }
      }

      reset();
      setShowAdvanced(false);

      const { fileId } = (await response.json()) as { fileId: string };

      toast.success("File uploaded successfully!", {
        description: "Opening file page in new tab...",
        duration: 2000,
      });

      // Otwórz w nowej karcie od razu
      window.open(`/file/${fileId}`, '_blank');
    } catch (error) {
      toast.error("Error!", {
        description: "Please, try again...",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
        <p className="text-gray-600 mb-6 text-lg">Please log in to upload files</p>
        <Button onClick={() => router.push('/login')} size="lg">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onFormSubmission)}
        >
          <div className="flex flex-col gap-4">
            <label
              className={classNameMerge(
                'flex flex-col gap-4 has-[[aria-invalid="true"]]:bg-rose-50 has-[[aria-invalid="true"]]:border-rose-400 relative border-2 border-dashed group has-[:focus]:outline has-[:focus]:outline-2 has-[:focus]:outline-offset-2 has-[:focus]:outline-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-center py-8 px-6 border-gray-300 items-center rounded-xl cursor-pointer',
                isFileOverInput && "border-indigo-400 bg-indigo-50",
              )}
              onDragEnter={() => setIsFileOverInput(true)}
              onDragLeave={() => setIsFileOverInput(false)}
            >
              <ArrowUpFromLine
                className={classNameMerge(
                  'transition-colors duration-200 group-has-[:focus]:text-indigo-400 group-hover:text-indigo-400 group-has-[[aria-invalid="true"]]:text-rose-400',
                  isFileOverInput ? "text-indigo-400" : "text-gray-400",
                )}
                size={40}
              />
              <div className="space-y-2">
                <span className="text-gray-700 font-semibold text-lg">
                  Drop your file or click here
                </span>
                <span className="text-sm text-gray-500 block">
                  Maximum file size: 100 MB
                </span>
              </div>
              <input
                type="file"
                className="absolute cursor-pointer top-0 left-0 opacity-0 size-full block"
                aria-invalid={!!fileInputError}
                {...register("fileList", {
                  required: "File is required!",
                  validate: (value) => {
                    return (
                      value[0].size <= 1024 * 1024 * 100 ||
                      "File size should be less than 100 MB!"
                    );
                  },
                  onChange: () => {
                    setIsFileOverInput(false);
                  },
                })}
              />
            </label>
            {fileInputError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-red-600 text-sm font-medium block text-center">
                  {fileInputError.message}
                </span>
              </div>
            )}
            {fileInputValue?.length > 0 && !fileInputError && (
              <FilePreview file={fileInputValue[0]} />
            )}
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors font-medium"
            >
              {showAdvanced ? 'Hide' : 'Show'} advanced options
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
                <h3 className="font-semibold text-gray-800 mb-4">Security & Limits</h3>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password Protection (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password to protect file"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="downloadLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Download Limit (optional)
                  </label>
                  <input
                    type="number"
                    id="downloadLimit"
                    min="1"
                    placeholder="Maximum number of downloads"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    {...register("downloadLimit", {
                      min: { value: 1, message: "Must be at least 1" },
                      valueAsNumber: true
                    })}
                  />
                </div>

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="expiryDate"
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    {...register("expiryDate")}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
            {isLoading ? 'Uploading...' : 'Share File'}
          </Button>
        </form>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};
