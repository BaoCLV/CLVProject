"use client";

import React from "react";
import { usePathname } from "next/navigation"; // Import the usePathname hook

const ProfileSidebar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <aside className="z-20 w-40 overflow-y-auto mb-30 bg-white flex-shrink-0 flex flex-col">
      <a
        className="ml-10 mt-6 text-2xl font-extrabold text-black items-center"
        href="/"
      >
        CLV
      </a>
      <ul className="mt-6">
        {/* Dashboard */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/dashboard" ? "bg-purple-800" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === "/dashboard"
                ? "text-purple-800" // Active link styles
                : "text-gray-800 hover:text-gray-600"
            }`}
            href="/dashboard"
          >
            <span>Dashboard</span>
          </a>
        </li>

        {/* Profile */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname.startsWith("/api/profile") ? "bg-purple-800" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname.startsWith("/api/profile")
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            href="/api/profile"
          >
            <span>Profile</span>
          </a>
        </li>

        {/* Change Email */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/api/profile/change-email" ? "bg-purple-800" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === "/api/profile/change-email"
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            href="/api/profile/change-email"
          >
            <span>Change Email</span>
          </a>
        </li>

        {/* Change Password */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/api/profile/change-password" ? "bg-purple-800" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
              pathname === "/api/profile/change-password"
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            href="/api/profile/change-password"
          >
            <span>Change Password</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
