"use client";

import { useEffect, useState } from "react";
import { useCreateUser, useUser } from "../../../hooks/useUser";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
// import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Loading from "../../components/Loading";

// Define the form state interface
interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
}

export default function CreateUser() {
  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
  });

  const [error, setError] = useState<string | null>(null);
  const { handlecreateUser } = useCreateUser(); // Mutation to create the user
  const { user, loading } = useUser();

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create user
  const handleCreatingUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User not logged in");
      return;
    }

    try {
      // Send the user data to the server
      const createdUser = await handlecreateUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number,
        address: form.address,
      });
      if (createdUser) {
        // Show success notification
        toast.success("Create user successful!", {
          //icon: "🚚", // Success icon (customize it to anything you want)
        });
      }
    } catch (error: any) {
      setError(error.message || "Error creating user");
    }
  };


  if (loading) {
    return (
        <Loading/>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex flex-col h-screen py-16 px-8">
          <h4 className="mb-6 text-2xl font-bold text-black">Create a User</h4>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                User's Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
              />
            </div>

            {error && <p className="mt-4 text-red-500">Error: {error}</p>}

            {/* Create User Button */}
            <button
              type="submit"
              className="w-full py-2 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={handleCreatingUser}
            >
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
