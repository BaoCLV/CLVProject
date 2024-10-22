"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeleteUser, useGetAvatar, useGetUserById, useUpdateUser, useUploadAvatar } from "../../../hooks/useUser";  // Add useGetAvatar and useUploadAvatar
import { useRoles } from "../../../hooks/useRole";  // Hook to fetch available roles
import { Avatar } from "@nextui-org/react";  // Use Avatar component for profile picture
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { useActiveUser } from "@/src/hooks/useActivateUser";

interface UpdateUserProps {
  userId: string;
}

export default function UpdateUser({ userId }: UpdateUserProps) {
  const router = useRouter();
  const { activeUser, loading, GGUserData } = useActiveUser();
  const { handleUpdateUser } = useUpdateUser();  // Update user function
  const { handleDeleteUser } = useDeleteUser();  // Delete user function
  const { loading: avatarLoading, avatar, error: avatarError } = useGetAvatar(userId);  // Fetch avatar
  const { handleUploadAvatar, loading: uploadLoading } = useUploadAvatar();  // Use avatar upload hook
  const { loadingRoles, roles } = useRoles();  // Fetch available roles

  // Allow avatar to be either a string (URL) or a File
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address: "",
    roleId: "",
    avatar: "" as string | File,  // Can be string (URL) or File
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(); // Preview for uploaded avatar
  const [fileName, setFileName] = useState<string>("No file chosen"); // Track selected file name or show default message
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Set form and avatar preview when user data is loaded
  useEffect(() => {
    if (activeUser) {
      setForm({
        name: activeUser.name || "",
        phone_number: activeUser.phone_number || "",
        address: activeUser.address || "",
        roleId: activeUser.roleId || "",
        avatar: avatar?.imageDataBase64 || "",  // Assuming avatar imageDataBase64 is stored in the user object
      });

      // Set initial avatar preview, fixing the format if needed
      const fixedAvatarSrc = avatar?.imageDataBase64
        ? avatar.imageDataBase64.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,')
        : '/img/default-avatar.jpg'; // Fallback if no avatar available

      setAvatarPreview(fixedAvatarSrc);
    }
  }, [activeUser, avatar]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar file selection and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);  // Preview the selected image
      };
      reader.readAsDataURL(file);
      setFileName(file.name); // Set the selected file's name
      setForm((prev) => ({
        ...prev,
        avatar: file,  // Set avatar as a File for uploading
      }));
    } else {
      setFileName("No file chosen");  // Reset if no file is selected
    }
  };

  // Submit the form with updated user details, including avatar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If avatar is a file, convert it to base64 and upload
      if (form.avatar instanceof File) {
        const avatarBase64 = await toBase64(form.avatar);  // Convert file to base64
        const uploadResponse = await handleUploadAvatar(userId, avatarBase64);  // Upload avatar
        form.avatar = uploadResponse.data.uploadAvatar.imageDataBase64;  // Update form with uploaded avatar
      }

      // Submit the updated user details
      await handleUpdateUser(userId, form);
      setMessage("Profile updated successfully!");
      setSubmitError("");
      router.push(`/admin/userlist`);  // Redirect after successful update
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

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await handleDeleteUser(userId);
        setMessage("User deleted successfully.");
        router.push(`/admin/userlist`);  // Redirect after delete
      } catch (err) {
        setSubmitError("Failed to delete user.");
        console.error("Error deleting user:", err);
      }
    }
  };

  if (loading || avatarLoading || uploadLoading || loadingRoles) return <Loading />;  // Show loading state while fetching user, avatar, and role data

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1">

        <ProfileSidebar />
        <div className="flex flex-col flex-1">
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
                  src={avatarPreview}
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
                    value={activeUser?.id || ""}
                    disabled
                    className="block w-full mt-2 p-4 bg-white text-lg border-black rounded-lg focus:border-blue-500 transition duration-150"
                  />
                </label>

                {/* Static field: Email */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">Email</span>
                  <input
                    type="email"
                    value={activeUser?.email || ""}
                    disabled
                    className="block w-full mt-2 p-4 bg-white text-lg border-black rounded-lg focus:border-blue-500 transition duration-150"
                  />
                </label>
                {/* Dropdown for Roles */}
                <label className="block text-lg pb-8">
                  <span className="text-gray-700 text-2xl font-bold">Role</span>
                  <select
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    className="block w-full mt-2 p-4 text-lg border-black rounded-lg bg-gray-300 focus:border-blue-500 transition duration-150"
                  >
                    <option value="" disabled>Select a role</option>
                    {roles.map((role: any) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
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

                {/* Delete button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg hover:bg-red-700 mt-4"
                >
                  Delete User
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
    </div>
  );
}
