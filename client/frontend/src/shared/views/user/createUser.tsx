"use client";

import { useEffect, useState } from "react";
import { useCreateUser, useUser } from "../../../hooks/useUser";
import { useRoles } from "../../../hooks/useRole";  // Fetch available roles
import { useRouter } from "next/navigation"; // Use router for navigation
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";
import { useActiveUser } from "@/src/hooks/useActivateUser";

// Define the form state interface
interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
}

interface CreatedUser {
  id: string;
  name: string;
  email: string;
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
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([]); // Track created users

  const { handlecreateUser } = useCreateUser();  // Mutation to create the user
  const { activeUser, loading: userLoading, GGUserData } = useActiveUser();
  const { loadingRoles, roles } = useRoles();
  const router = useRouter(); // Use router for navigation

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!activeUser) {
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
        toast.success("Create user successful!");

        // Add the newly created user to the list
        setCreatedUsers(prev => [
          ...prev,
          {
            id: createdUser.id,  // Assuming the createdUser response includes an id
            name: createdUser.name,
            email: createdUser.email,
            phone_number: createdUser.phone_number,
            address: createdUser.address
          }
        ]);
      }
    } catch (error: any) {
      setError(error.message || "Error creating user");
    }
  };

  // Navigate to the user's detail page
  const handleViewDetails = () => {
    router.push(`/api/profile/${activeUser.id}`); // Navigate to the user's detail page
  };

  if (userLoading || loadingRoles) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-200 py-16 px-8">
          <h4 className="mb-6 text-3xl font-bold text-black">
            Create User
          </h4>

          {/* Create user form */}
          <form onSubmit={handleCreatingUser} className="space-y-8 bg-white px-8 pb-8 rounded-lg shadow-lg relative">
            <div className="pl-52 pt-10">
              {/* Name field */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  required
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Email field */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Password field */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Phone number field */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Phone Number</span>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  required
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Address field */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Address</span>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Error Message */}
              {error && <p className="mt-4 text-lg text-red-500">Error: {error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-800"
              >
                Create User
              </button>
            </div>
          </form>

          {/* Display the list of created users */}
          {createdUsers.length > 0 && (
            <div className="mt-8">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Recently Created Users</h4>
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Phone Number</th>
                    <th className="px-4 py-2 border-b">Address</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {createdUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      <td className="px-4 py-2 border-b">{user.phone_number}</td>
                      <td className="px-4 py-2 border-b">{user.address}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleViewDetails()}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
