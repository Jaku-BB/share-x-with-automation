"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileForm } from "~/app/components/file-form";
import { Button } from "./components/button";
import { useAuth } from "./contexts/auth-context";

const Page = () => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-8 px-4">
      <div className="space-y-4 text-center">
        <p className="text-neutral-900 text-xl leading-relaxed md:text-2xl">
          Attach your file and share it
          <span className="block">
            with just <span className="font-medium text-indigo-600">one</span> click!
          </span>
        </p>

        {!isLoggedIn && (
          <p className="text-gray-600 text-lg">Create an account to start sharing files securely</p>
        )}
      </div>

      {isLoggedIn ? (
        <div className="flex w-full flex-col items-center gap-6">
          <FileForm />
          <div className="text-center">
            <Link
              href="/profile"
              className="text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
            >
              View your uploaded files →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <div className="space-y-4 rounded-lg bg-white p-8 shadow-md">
            <h2 className="font-semibold text-gray-800 text-xl">Get Started</h2>
            <p className="text-gray-600">
              Sign up for free to upload and share files with advanced features like password
              protection and download limits.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
