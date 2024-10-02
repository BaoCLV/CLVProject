"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser, useGetUserById } from "../../../hooks/useUser";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/ProfileSidebar";

interface UpdateProfileProps {
  userId: string;
}

export default function UpdateProfile({ userId }: UpdateProfileProps) {
  const router = useRouter();
  const { loading, user } = useGetUserById(userId);
  const { handleUpdateUser } = useUpdateUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: ""
  });
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // Toggle for email modal

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdateUser(userId, form);
      setMessage("Profile updated successfully!");
      setSubmitError("");
    } catch (err) {
      setSubmitError("Failed to update profile.");
      setMessage("");
      console.error("Error updating profile:", err);
    }
  };

  const handleEmailChangeSubmit = async (newEmail: string) => {
    try {
      await handleUpdateUser(userId, { email: newEmail });
      setMessage("Email updated successfully!");
      setForm((prev) => ({ ...prev, email: newEmail })); 
      setIsEmailModalOpen(false);
    } catch (err) {
      setSubmitError("Failed to update email.");
      console.error("Error updating email:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      <ProfileSidebar/>
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8">
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Update Profile
          </h4>
          {/* Profile update form */}
          <form onSubmit={handleSubmit} className="space-y-8">
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

            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Phone Number</span>
              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg"
              />
            </label>

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

            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>

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
