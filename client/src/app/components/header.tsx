"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import { Button } from "./button";

export const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="relative flex items-start">
      <div className="absolute top-0 left-0">
        <nav className="invisible flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <Link href="/profile" className="text-gray-600 text-sm hover:text-indigo-600">
                Welcome, {user.username}
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="flex w-full flex-col items-center gap-2 md:gap-4">
        <Link href="/">
          <h1 className="font-medium text-4xl text-neutral-900 transition-colors hover:text-indigo-600 md:text-5xl">
            ShareX
          </h1>
        </Link>
        <span className="rounded-xl border border-indigo-500 bg-indigo-50 px-2 py-1 font-black text-indigo-400 uppercase md:text-lg">
          Free
        </span>
      </div>

      <nav className="absolute top-0 right-0 flex items-center gap-4">
        {isLoggedIn && user ? (
          <>
            <Link href="/profile" className="text-gray-600 text-sm hover:text-indigo-600">
              Welcome, {user.username}
            </Link>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
