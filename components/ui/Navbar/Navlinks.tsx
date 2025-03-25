'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import LanguageSwitcher from '../LangurageSwitcher';
interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className="cursor-pointer rounded-full transform duration-100 ease-in-out" aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-4 lg:block">
          <Link href="/" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            Workspace
          </Link>
          <Link href="/" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            Docs
          </Link>
          <Link href="/pricing" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            Pricing
          </Link>
          <Link href="/" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            About
          </Link>
          {user && (
            <Link href="/account" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
              Account
            </Link>
          )}
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={typeof window !== 'undefined' ? window.location.pathname : '/'} />
            <button type="submit" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-800 rounded-md p-1 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            Sign In
          </Link>
        )}
      </div>
      <div className="flex justify-end space-x-8">
      <LanguageSwitcher />
      </div>
      
    </div>
  );
}
