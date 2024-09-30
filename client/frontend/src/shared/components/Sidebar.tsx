import React from 'react';
import Link from 'next/link';

const Sidebar = () => {

  return (
    <aside className="z-20 w-40 overflow-y-auto mb-30 bg-gray-900 flex-shrink-0 flex flex-col ">
      <a  className="ml-10 mt-6 text-2xl font-extrabold text-gray-800 dark:text-gray-200 items-center" href="/">
        CLV
      </a>
        <ul className="mt-6">
          <li className="relative px-6 py-3">
            <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
            <a
              className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
              href="/"
            >
              <span>Dashboard</span>
            </a>
          </li>
          <li className="relative px-6 py-3">
            <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
            <a
              className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
              href="/api/route/createRoute"
            >
              <span>Create new route</span>
            </a>
          </li>
          <li className="relative px-6 py-3">
          <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
          <a
            className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
            href="/api/user"
          >
            <span>User</span>
          </a>
          </li>
          {/* Add other navigation items here */}
        </ul>

    </aside>
  );
};

export default Sidebar;
