"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser, useGetUserById } from "../../../hooks/useUser";
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
    phone_number: "",
    address: ""
  });
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-center items-center p-6">
          <div className="bg-white shadow-md p-8 w-full max-w-4xl">
            <h4 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
              Update Profile
            </h4>

            {/* Profile update form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Name Field */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  required
                  className="block w-full bg-white p-3 text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="block w-full bg-white p-3 text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              {/* Address Field */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label className="text-gray-600 font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  className="block w-full bg-white p-3 text-lg border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>

              {/* Success and Error Messages */}
              {message && (
                <p className="col-span-1 md:col-span-2 mt-4 text-center text-lg text-green-600">
                  {message}
                </p>
              )}
              {submitError && (
                <p className="col-span-1 md:col-span-2 mt-4 text-center text-lg text-red-600">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
