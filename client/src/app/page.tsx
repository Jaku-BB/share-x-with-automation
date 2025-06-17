'use client';

import { Button } from './components/button';
import { useAuth } from './contexts/auth-context';
import { FileForm } from "~/app/components/file-form";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Page = () => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lg text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      <div className="text-center space-y-4">
        <p className="text-neutral-900 text-xl md:text-2xl leading-relaxed">
          Attach your file and share it
          <span className="block">
            with just <span className="font-medium text-indigo-600">one</span> click!
          </span>
        </p>
        
        {!isLoggedIn && (
          <p className="text-gray-600 text-lg">
            Create an account to start sharing files securely
          </p>
        )}
      </div>
      
      {isLoggedIn ? (
        <div className="w-full flex flex-col items-center gap-6">
          <FileForm />
          <div className="text-center">
            <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              View your uploaded files →
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Get Started</h2>
            <p className="text-gray-600">
              Sign up for free to upload and share files with advanced features like password protection and download limits.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/login">
                <Button variant="outline" size="lg">Sign In</Button>
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
