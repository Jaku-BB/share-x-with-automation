"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../components/button";
import { useAuth } from "../contexts/auth-context";
import { apiRequest } from "../utils/api";
import type { AuthResponse } from "../utils/auth";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiRequest("/api/users/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      const data: AuthResponse = await response.json();

      login({
        userId: data.userId,
        username: data.username,
        email: email, // Używamy email z formularza
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-3xl text-gray-900">Join ShareX</h1>
            <p className="text-gray-600">Create your account and start sharing files</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block font-semibold text-gray-700 text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Choose a username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-semibold text-gray-700 text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-semibold text-gray-700 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Create a password"
                disabled={isLoading}
              />
              <p className="mt-2 text-gray-500 text-xs">Must be at least 6 characters long</p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="text-center font-medium text-red-600 text-sm">{error}</div>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
