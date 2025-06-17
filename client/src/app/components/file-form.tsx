"use client";

import { ArrowUpFromLine, Copy, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { Button } from "~/app/components/button";
import { FilePreview } from "~/app/components/file-preview";
import { classNameMerge } from "~/app/utils/class-name-merge";
import { useAuth } from "../contexts/auth-context";
import { apiRequest } from "../utils/api";

interface FormData {
  fileList: FileList;
  password?: string;
  downloadLimit?: number;
  expiryDate?: string;
}

const BASE_URL =
  typeof window !== "undefined" && window.location
    ? `${window.location.protocol}//${window.location.host}`
    : "http://localhost:3000";

export const FileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFileOverInput, setIsFileOverInput] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { handleSubmit, register, formState, watch, setError, reset } = useForm<FormData>();

  const fileInputValue = watch("fileList");
  const fileInputError = formState.errors.fileList;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router, isLoggedIn]);

  const onFormSubmission: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted with data:", data);

    if (!isLoggedIn) {
      console.log("User not logged in, redirecting...");
      router.push("/login");
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

    console.log("Uploading file:", data.fileList[0]);

    setIsLoading(true);
    try {
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
      window.open(`/file/${fileId}`, "_blank");
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
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <p className="mb-6 text-gray-600 text-lg">Please log in to upload files</p>
        <Button onClick={() => router.push("/login")} size="lg">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onFormSubmission)}>
          <div className="flex flex-col gap-4">
            <label
              className={classNameMerge(
                "group relative flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-gray-300 border-dashed px-6 py-8 text-center transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50",
                "has-[:focus]:outline has-[:focus]:outline-2 has-[:focus]:outline-indigo-300 has-[:focus]:outline-offset-2",
                fileInputError && "border-rose-400 bg-rose-50",
                isFileOverInput && "border-indigo-400 bg-indigo-50"
              )}
              onDragEnter={() => setIsFileOverInput(true)}
              onDragLeave={() => setIsFileOverInput(false)}
            >
              <ArrowUpFromLine
                className={classNameMerge(
                  "transition-colors duration-200 group-hover:text-indigo-400 group-has-[:focus]:text-indigo-400",
                  fileInputError && "text-rose-400",
                  isFileOverInput ? "text-indigo-400" : "text-gray-400"
                )}
                size={40}
              />
              <div className="space-y-2">
                <span className="font-semibold text-gray-700 text-lg">
                  Drop your file or click here
                </span>
                <span className="block text-gray-500 text-sm">Maximum file size: 100 MB</span>
              </div>
              <input
                type="file"
                className="absolute top-0 left-0 block size-full cursor-pointer opacity-0"
                aria-invalid={!!fileInputError}
                {...register("fileList", {
                  required: "File is required!",
                  validate: (value) => {
                    return (
                      value[0].size <= 1024 * 1024 * 100 || "File size should be less than 100 MB!"
                    );
                  },
                  onChange: () => {
                    setIsFileOverInput(false);
                  },
                })}
              />
            </label>
            {fileInputError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <span className="block text-center font-medium text-red-600 text-sm">
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
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
            >
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>

            {showAdvanced && (
              <div className="space-y-4 rounded-xl border bg-gray-50 p-6">
                <h3 className="mb-4 font-semibold text-gray-800">Security & Limits</h3>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Password Protection (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password to protect file"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 transition-colors hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="downloadLimit"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Download Limit (optional)
                  </label>
                  <input
                    type="number"
                    id="downloadLimit"
                    min="1"
                    placeholder="Maximum number of downloads"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register("downloadLimit", {
                      min: { value: 1, message: "Must be at least 1" },
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Expiry Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="expiryDate"
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register("expiryDate")}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
            {isLoading ? "Uploading..." : "Share File"}
          </Button>
        </form>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};
