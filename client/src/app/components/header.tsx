'use client';

import { useAuth } from '../contexts/auth-context';
import { Button } from './button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="flex items-start relative">
      <div className="absolute left-0 top-0">
        <nav className="flex items-center gap-4 invisible">
          {isLoggedIn && user ? (
            <>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-indigo-600">
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
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      <div className="flex flex-col gap-2 md:gap-4 items-center w-full">
        <Link href="/">
          <h1 className="text-neutral-900 text-4xl font-medium md:text-5xl hover:text-indigo-600 transition-colors">
            ShareX
          </h1>
        </Link>
        <span className="bg-indigo-50 border uppercase border-indigo-500 md:text-lg font-black text-indigo-400 rounded-xl py-1 px-2">
          Free
        </span>
      </div>
      
      <nav className="absolute right-0 top-0 flex items-center gap-4">
        {isLoggedIn && user ? (
          <>
            <Link href="/profile" className="text-sm text-gray-600 hover:text-indigo-600">
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
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
