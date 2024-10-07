"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../hooks/useUser";

const ProfileSidebar = () => {
  const pathname = usePathname(); 
  const router = useRouter(); 
  const { user } = useUser(); 

  const handleNavigation = (key: string) => {
    if (key === "dashboard") {
      router.push("/");
    } else if (key === "profile") {
      router.push(`/api/profile/${user?.id}`); 
    } else if (key === "myRoute") {
      router.push(`/api/profile/${user?.id}/route`); 
    } else if (key === "changePassword") {
      router.push(`/api/profile/${user?.id}/change-password`); 
    }
  };

  return (
    <aside className="z-20 w-64 h-full bg-white shadow-lg flex-shrink-0 flex flex-col">
      {/* Sidebar Logo */}
      <a href="/" className="text-3xl font-bold text-blue-600 p-6 cursor-pointer hover:scale-105 transition-transform">
        <img
          src="https://cyberlogitec.com.vn/wp-content/uploads/2024/09/logo-ngang_3-1.svg"
          alt="Logo"
          className="h-5"
        />
      </a>

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-2">
        {/* Dashboard */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/" ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === "/"
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <span>Dashboard</span>
          </a>
        </li>

        {/* Profile */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/api/profile/${user?.id}` ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/api/profile/${user?.id}`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("profile")}
          >
            <span>Profile</span>
          </a>
        </li>

        {/* My Route */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/api/profile/${user?.id}/route` ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/api/profile/${user?.id}/route`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("myRoute")}
          >
            <span>My Route</span>
          </a>
        </li>

        {/* Change Password */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/api/profile/${user?.id}/change-password`
                ? "bg-blue-600"
                : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/api/profile/${user?.id}/change-password`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("changePassword")}
          >
            <span>Change Password</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
