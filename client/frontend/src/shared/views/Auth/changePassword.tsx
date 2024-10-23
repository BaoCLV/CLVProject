"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChangePassword, useGetAvatar, useGetUserById, useUpdateUser, useUploadAvatar } from "../../../hooks/useUser";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import { Avatar } from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface ChangePasswordProps {
  userId: string;
}

export default function ChangePassword({ userId }: ChangePasswordProps) {
  const router = useRouter();
  const { loading: userLoading, user } = useGetUserById(userId);
  const { handleChangePassword } = useChangePassword();
  const { loading: avatarLoading, avatar, error: avatarError } = useGetAvatar(userId);
  const { handleUploadAvatar, loading } = useUploadAvatar();  // Use the avatar hook

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // Toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle password visibility

  // Set initial form values and avatar when user data is loaded
  useEffect(() => {
    if (user) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleChangePassword(form.newPassword, form.oldPassword, userId);  // Update the rest of the profile
      console.log(form.newPassword, form.oldPassword, userId)
      setMessage("Profile updated successfully!");
      setSubmitError("");
      router.push(`/api/profile/${userId}`)
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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1">

        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex-1 bg-gray-200 py-28 px-8">
            <h4 className="mb-6 text-3xl font-bold text-black">
              Change Password
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
              </div>

              <div className="pl-52 pt-10">
                {/* Static field: Email */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">Email</span>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="block w-full mt-2 p-4 bg-white text-lg text-black border-black rounded-lg focus:border-blue-500 transition duration-150"
                  />
                </label>

                {/* Static field: User Name */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">User Name</span>
                  <input
                    type="user"
                    value={user?.name || ""}
                    disabled
                    className="block w-full mt-2 p-4 bg-white text-lg text-black border-black rounded-lg focus:border-blue-500 transition duration-150"
                  />
                </label>

                {/* Editable field: Old Password */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">Old Password</span>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={form.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter old password"
                      className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150 pr-12"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">

                      {showOldPassword ? (
                        <AiOutlineEye
                          className=" right-3 top-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowOldPassword(false)}
                          size={24}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          className=" right-3 top-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowOldPassword(true)}
                          size={24}
                        />
                      )}
                    </span>

                  </div>
                </label>


                {/* Editable field: New Password */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">New Password</span>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="block w-full mt-2 p-4 text-lg border-black bg-gray-300 rounded-lg focus:border-blue-500 transition duration-150 pr-12"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                      {showNewPassword ? (
                        <AiOutlineEye
                          className=" right-3 top-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowNewPassword(false)}
                          size={24}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          className=" right-3 top-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowNewPassword(true)}
                          size={24}
                        />
                      )}
                    </span>
                  </div>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Change Password
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
      {/* Footer */}
      <Footer />
    </div>
  );
}
