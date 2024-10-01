"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation"; // Import the useRouter and usePathname hooks
import { useUser } from "../../hooks/useUser"; // Assuming there's a hook to get user data

const ProfileSidebar = () => {
  const pathname = usePathname(); // Get the current path
  const router = useRouter(); // Use the router for programmatic navigation
  const { user } = useUser(); // Assuming `user` contains the logged-in user information

  // Function to handle dynamic routing based on key
  const handleNavigation = (key: string) => {
    if (key === "dashboard") {
      router.push("/dashboard"); // Navigate to dashboard
    } else if (key === "profile") {
      router.push(`/api/profile/${user?.id}`); // Navigate to profile with user ID
    } else if (key === "myRoute") {
      router.push(`/api/profile/${user.id}/route`); // Navigate to My Route
    } else if (key === "changePassword") {
      router.push("/api/profile/change-password"); // Navigate to Change Password
    }
  };

  return (
    <aside className="z-20 w-40 overflow-y-auto mb-30 bg-white flex-shrink-0 flex flex-col">
      <a
        className="ml-10 mt-6 text-2xl font-extrabold text-black items-center cursor-pointer"
        onClick={() => handleNavigation("dashboard")} // Use key for dashboard
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
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === "/dashboard"
                ? "text-purple-800" // Active link styles
                : "text-gray-800 hover:text-gray-600"
            }`}
            onClick={() => handleNavigation("dashboard")} // Use key for dashboard
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
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname.startsWith("/api/profile")
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            onClick={() => handleNavigation("profile")} // Use key for profile
          >
            <span>Profile</span>
          </a>
        </li>

        {/* My Route */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/api/profile/route" ? "bg-purple-800" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === "/api/profile/route"
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            onClick={() => handleNavigation("myRoute")} // Use key for My Route
          >
            <span>My Route</span>
          </a>
        </li>

        {/* Change Password */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === "/api/profile/change-password"
                ? "bg-purple-800"
                : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === "/api/profile/change-password"
                ? "text-purple-800"
                : "text-gray-800 hover:text-gray-600"
            }`}
            onClick={() => handleNavigation("changePassword")} // Use key for Change Password
          >
            <span>Change Password</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
