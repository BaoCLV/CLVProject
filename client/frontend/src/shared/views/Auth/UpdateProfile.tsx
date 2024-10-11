"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetAvatar, useGetUserById, useUpdateUser, useUploadAvatar } from "../../../hooks/useUser";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import { Avatar } from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";

interface UpdateProfileProps {
  userId: string;
}

export default function UpdateProfile({ userId }: UpdateProfileProps) {
  const router = useRouter();
  const { loading: userLoading, user } = useGetUserById(userId);
  const { handleUpdateUser } = useUpdateUser();
  const { loading: avatarLoading, avatar, error: avatarError } = useGetAvatar(userId);
  const { handleUploadAvatar, loading } = useUploadAvatar();  // Use the avatar hook

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address: "",
    avatar: "" as string | File,  // Avatar file or URL
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Set initial form values and avatar when user data is loaded
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone_number: user.phone_number || "",
        address: user.address || "",
        avatar: avatar?.imageDataBase64 || "", // Use avatar imageDataBase64
      });

      // Set initial avatar preview, fixing the format if needed
      const fixedAvatarSrc = avatar?.imageDataBase64 
        ? avatar.imageDataBase64.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,') 
        : '/img/default-avatar.jpg'; // Fallback if no avatar available
      
      setAvatarPreview(fixedAvatarSrc);
    }
  }, [user, avatar]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Set the preview to base64 string
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      setForm((prev) => ({
        ...prev,
        avatar: file,  // Set avatar as a File for uploading
      }));
    } else {
      setFileName("No file chosen");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if avatar is a file, if so, upload it
      if (form.avatar instanceof File) {
        const avatarBase64 = await toBase64(form.avatar);  // Convert file to base64
        const uploadResponse = await handleUploadAvatar(userId, avatarBase64);  // Upload avatar

        // Set form.avatar to the returned avatar image base64 or URL
        form.avatar = uploadResponse.data.uploadAvatar.imageDataBase64;
      }

      await handleUpdateUser(userId, form);  // Update the rest of the profile
      setMessage("Profile updated successfully!");
      setSubmitError("");
    } catch (err) {
      setSubmitError("Failed to update profile.");
      setMessage("");
      console.error("Error updating profile:", err);
    }
  };

  // Helper function to convert File to base64 string
  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (userLoading || loading || avatarLoading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-200 py-16 px-8">
          <h4 className="mb-6 text-3xl font-bold text-black">
            Update Profile
          </h4>
          {/* Profile update form */}
          <form onSubmit={handleSubmit} className="space-y-8 bg-white px-8 pb-8 rounded-lg shadow-lg relative">
            
            {/* Avatar Edit and File Upload */}
            <div className="absolute top-0 left-10 mt-4 z-10 flex flex-col items-center space-y-4">
              {/* Avatar */}
              <Avatar
                src={avatarPreview || "/img/default-avatar.jpg"} // Display avatar preview or fallback
                className="w-40 h-40 rounded-full border-4 border-blue-600 object-cover shadow-lg transition-transform"
              />

              {/* Custom File Upload Button */}
              <label className="cursor-pointer px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"  // Hide the default file input
                />
              </label>
              {/* Show file name or "No file chosen" */}
              <p className="mt-2 text-sm text-gray-600">{fileName}</p>
            </div>

            <div className="pl-52 pt-10">  
              {/* Static field: ID */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">User ID</span>
                <input
                  type="text"
                  value={user?.id || ""}
                  disabled
                  className="block w-full mt-2 p-4 bg-white text-lg border-black rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Static field: Email */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Email</span>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="block w-full mt-2 p-4 bg-white text-lg border-black rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Editable field: Name */}
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

              {/* Editable field: Phone Number */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Phone Number</span>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
                />
              </label>

              {/* Editable field: Address */}
              <label className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Address</span>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
