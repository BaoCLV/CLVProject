"use client";

import React from 'react';
import { usePathname } from 'next/navigation'; // Import the usePathname hook

const Sidebar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <aside className="z-20 w-40 overflow-y-auto mb-30 bg-white flex-shrink-0 flex flex-col">
      <a className="ml-10 mt-6 text-2xl font-extrabold text-black items-center" href="/">
        CLV
      </a>
      <ul className="mt-6">
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === '/dashboard' ? 'bg-purple-800' : ''
            }`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === '/dashboard'
                ? 'text-purple-800' // Active link styles
                : 'text-black hover:text-gray-600'
            }`}
            href="/dashboard"
          >
            <span>Dashboard</span>
          </a>
        </li>
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === '/api/route/createRoute' ? 'bg-purple-800' : ''
            }`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === '/api/route/createRoute'
                ? 'text-purple-800'
                : 'text-black hover:text-gray-800'
            }`}
            href="/api/route/createRoute"
          >
            <span>Create new route</span>
          </a>
        </li>
        {/* Add other navigation items here */}
      </ul>
    </aside>
  );
};

export default Sidebar;
