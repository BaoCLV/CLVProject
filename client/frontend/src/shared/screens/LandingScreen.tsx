"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "./AuthScreen";

const LandingPage = () => {
  const [open, setOpen] = useState(false); // Modal state
  const router = useRouter();

  // Function to check if token exists in cookies
  const checkAuthToken = () => {
    const cookies = document.cookie.split("; ").reduce((acc, currentCookie) => {
      const [name, value] = currentCookie.split("=");
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies["access_token"] || cookies["refresh_token"];
  };

  // Check if user is already logged in based on the presence of access_token or refresh_token in cookies
  useEffect(() => {
    if (checkAuthToken()) {
      router.push("/dashboard"); // Redirect to dashboard if token exists
    }
  }, [router]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`, // Replace with your background image URL
      }}
    >
      <div className="text-center bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to CLVProject
        </h1>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => setOpen(true)} // Open modal on button click
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Login / Sign Up
          </button>
        </div>
      </div>

      {open && <AuthScreen setOpen={setOpen} />} {/* Conditional rendering of modal */}
    </div>
  );
};

export default LandingPage;
