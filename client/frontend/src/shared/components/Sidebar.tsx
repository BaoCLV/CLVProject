"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import the usePathname hook
import { useUser } from '@/src/hooks/useUser';

const Sidebar = () => {
  const { user } = useUser(); 
  const pathname = usePathname();
  const router = useRouter(); 

  const handleNavigation = (key: string) => {
    if (key === "profile") {
      router.push(`/api/profile/${user?.id}`);
    } else if (key === "myRoute") {
      router.push(`/api/route/createRoute`); 
    } else if (key === "changePassword") {
      router.push(`/api/user/changepassword`); 
    }
  };

  return (
    <aside className="sticky top-10 py-16 w-64 h-screen bg-white shadow-lg flex-shrink-0 flex flex-col">
      <ul className="mt-6">
        {/* Profile */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("profile")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/api/profile/${user?.id}` ? 'bg-blue-800' : ''
            }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === `/api/profile/${user?.id}`
                ? 'text-blue-800'
                : 'text-black hover:text-gray-800'
            }`}
          >
            Profile
          </span>
        </li>

        {/* Create New Route */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("myRoute")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === '/api/route/createRoute' ? 'bg-purple-800' : ''
            }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === '/api/route/createRoute'
                ? 'text-purple-800'
                : 'text-black hover:text-gray-800'
            }`}
          >
            Create new route
          </span>
        </li>

        {/* Change Password */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("changePassword")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === '/api/user/changepassword' ? 'bg-purple-800' : ''
            }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === '/api/user/changepassword'
                ? 'text-purple-800'
                : 'text-black hover:text-gray-800'
            }`}
          >
            Change password
          </span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
