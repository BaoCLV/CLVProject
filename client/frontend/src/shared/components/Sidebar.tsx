"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import the usePathname hook
import { useUser } from '@/src/hooks/useUser';
import { useActiveUser } from '@/src/hooks/useActivateUser';

const Sidebar = () => {
  const { activeUser, loading, GGUserData } = useActiveUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (key: string) => {
    if (key === "profile") {
      router.push(`/api/profile/${activeUser?.id}`);
    } else if (key === "myRoute") {
      router.push(`/api/profile/${activeUser?.id}/route`);
    } else if (key === "change-password") {
      router.push(`/api/profile/${activeUser?.id}/change-password`);
    } else if (key === "myRequest") {
      router.push(`/api/route/request/${activeUser?.id}`);
    }
  };

  return (
    <aside className="sticky top-0 py-16 w-64 h-screen bg-white shadow-lg flex-shrink-0 flex flex-col">
      <ul className="mt-6">
        {/* Profile */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("profile")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === `/api/profile/${activeUser?.id}` ? 'bg-blue-600' : ''
              }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${pathname === `/api/profile/${activeUser?.id}`
                ? 'text-blue-800'
                : 'text-black hover:text-blue-500'
              }`}
          >
            Profile
          </span>
        </li>
        {/* My Route */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("myRoute")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === `/api/profile/${activeUser?.id}/route` ? 'bg-blue-600' : ''
              }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${pathname === `/api/profile/${activeUser?.id}/route`
                ? 'text-blue-600'
                : 'text-black hover:text-blue-500'
              }`}
          >
            My Route
          </span>
        </li>
        {/* My Request */}
        <li
          className="relative px-6 py-3 cursor-pointer"
          onClick={() => handleNavigation("myRequest")}
        >
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === `/api/route/request/${activeUser?.id}` ? 'bg-blue-600' : ''
              }`}
            aria-hidden="true"
          ></span>
          <span
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${pathname === `/api/route/request/${activeUser?.id}`
                ? 'text-blue-600'
                : 'text-black hover:text-blue-500'
              }`}
          >
            My Request
          </span>
        </li>
        {/* Change Password */}
        {GGUserData.email == "" && (
          <li
            className="relative px-6 py-3 cursor-pointer"
            onClick={() => handleNavigation("change-password")}
          >
            <span
              className={`absolute inset-y-0 left-0 w-1 ${pathname === `/api/profile/${activeUser?.id}/change-password` ? 'bg-blue-600' : ''}`}
              aria-hidden="true"
            ></span>
            <span
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${pathname === `/api/profile/${activeUser?.id}/change-password` ? 'text-blue-600' : 'text-black hover:text-blue-500'}`}
            >
              Change password
            </span>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
