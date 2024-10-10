"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser } from "../../../hooks/useUser";
import { useRoles } from "../../../hooks/useRole";  // Hook to fetch available roles
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";

interface UpdateUserProps {
  userId: string;
}

export default function UpdateUser({ userId }: UpdateUserProps) {
  const router = useRouter();
  const { loading, user } = useUser();  // Fetch user details
  const { handleUpdateUser } = useUpdateUser();  // Update user function
  const { loadingRoles, roles } = useRoles();  // Fetch available roles

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address: "",
    roleId: "",  // Single roleId for selected role
  });

  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      // Set form state with user data
      setForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        roleId: user.roleId || "",  // Assuming user has a single roleId
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit the updated user details with the selected roleId
      await handleUpdateUser(userId, { ...form, roleId: form.roleId });
      setMessage("Profile updated successfully!");
      setSubmitError("");
      router.push(`/admin/userlist`);  // Redirect after successful update
    } catch (err) {
      setSubmitError("Failed to update profile.");
      setMessage("");
      console.error("Error updating profile:", err);
    }
  };

  if (loading || loadingRoles) return <p>Loading...</p>;  // Show loading state while fetching user and role data

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 py-16 px-8">
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Update Profile
          </h4>
          {/* Profile update form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Static field: ID */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">User ID</span>
              <input
                type="text"
                value={user?.id || ""}
                disabled
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-gray-400 rounded-lg"
              />
            </label>

            {/* Static field: Email */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Email</span>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-gray-400 rounded-lg"
              />
            </label>

            {/* Dropdown for Roles */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Role</span>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg"
              >
                <option value="" disabled>Select a role</option>
                {roles.map((role: any) => (
                  <option key={role.id} value={role.id}>  {/* Use role.id as value */}
                    {role.name}  {/* Display role.name */}
                  </option>
                ))}
              </select>
            </label>

            {/* Editable field: Name */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                required
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg"
              />
            </label>

            {/* Editable field: Phone Number */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">
                Phone Number
              </span>
              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg"
              />
            </label>

            {/* Editable field: Address */}
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Address</span>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg"
              />
            </label>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>

            {/* Success/Error Messages */}
            {message && (
              <p className="mt-4 text-lg text-green-500">{message}</p>
            )}
            {submitError && (
              <p className="mt-4 text-lg text-red-500">Error: {submitError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
