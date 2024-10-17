"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../hooks/useUser";

const ProfileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleNavigation = (key: string) => {
    if (key === "dashboard") {
      router.push("/admin/dashboard");
    } else if (key === "profile") {
      router.push(`/api/profile/${user?.id}`);
    } else if (key === "myRoute") {
      router.push(`/api/profile/${user?.id}/route`); 
    } else if (key === "userlist") {
      router.push(`/admin/userlist`); 
    } else if (key === "routelist") {
      router.push(`/admin/route`); 
    } else if (key === "rolelist") {
      router.push(`/admin/rolelist`); 
    }
  }; 

  return (
    <aside className="sticky top-10 py-16 w-64 h-screen bg-white shadow-lg flex-shrink-0 flex flex-col">

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-2">
        {/* Dashboard */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === "/admin/dashboard" ? "bg-blue-600" : ""
              } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${pathname === "/admin/dashboard"
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
              }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <span>Dashboard</span>
          </a>
        </li>
        {/* Route List */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/admin/route` ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/admin/route`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("routelist")}
          >
            <span>Route List</span>
          </a>
        </li>

        {/* User List */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/admin/userlist` ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/admin/userlist`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("userlist")}
          >
            <span>User List</span>
          </a>
        </li>
        {/* Role List */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${
              pathname === `/admin/rolelist` ? "bg-blue-600" : ""
            } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              pathname === `/admin/rolelist`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
            }`}
            onClick={() => handleNavigation("rolelist")}
          >
            <span>Role List</span>
          </a>
        </li>

        {/* Pending Request */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === `/admin/pendingRequest`
                ? "bg-blue-600"
                : ""
              } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${pathname === `/admin/pendingRequest`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
              }`}
            onClick={() => handleNavigation("pendingRequest")}
          >
            <span>Pending Request</span>
          </a>
        </li>

        {/* Request */}
        <li className="relative px-6 py-3">
          <span
            className={`absolute inset-y-0 left-0 w-1 ${pathname === `/admin/request`
                ? "bg-blue-600"
                : ""
              } rounded-tr-lg rounded-br-lg`}
            aria-hidden="true"
          ></span>
          <a
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer ${pathname === `/admin/request`
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500"
              }`}
            onClick={() => handleNavigation("request")}
          >
            <span>Request List</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
