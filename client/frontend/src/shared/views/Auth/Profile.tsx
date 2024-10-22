"use client";

import { useRouter } from 'next/navigation';
import { useUser, useGetAvatar } from '../../../hooks/useUser';
import { format } from 'date-fns';
import Header from '../../components/Header';
import { Avatar } from '@nextui-org/react';
import Loading from '../../components/Loading';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { useActiveUser } from '@/src/hooks/useActivateUser';

interface UserDetailProps {
  userId: string;
}

export default function UserProfile({ userId }: UserDetailProps) {
  const router = useRouter();
  const { activeUser, loading: userLoading, GGUserData } = useActiveUser();
  
  // Fetch avatar data using the useGetAvatar hook
  const { loading: avatarLoading, avatar, error: avatarError } = useGetAvatar(userId);

  // Fix the avatar string format
  const fixedAvatarSrc = GGUserData?.image
  ? GGUserData.image
  : avatar?.imageDataBase64
  ? avatar.imageDataBase64.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,')
  : '/img/default-avatar.jpg';

  // Function to safely format the date by replacing the space with 'T'
  const formatDate = (dateString: string) => {
    try {
      const isoDateString = dateString.replace(' ', 'T');
      const date = new Date(isoDateString);
      return isNaN(date.getTime()) ? 'Date not available' : format(date, 'MMMM dd, yyyy');
    } catch {
      return 'Date not available';
    }
  };

  if (userLoading || avatarLoading) return <Loading />;
  if (!activeUser) return <p>User not found</p>;
  if (avatarError) return <p>Error loading avatar: {avatarError.message}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1">

        <Sidebar />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-gray-200 py-16 px-8 relative">
          <h4 className="mb-6 text-3xl font-bold text-black">Profile Details</h4>

          <div className="space-y-8 bg-white px-8 pb-8 rounded-lg shadow-lg h-full overflow-y-auto">
            {/* Avatar and User Info */}
            <div className="flex py-8 ">
              <Avatar
                src={fixedAvatarSrc}
                className="w-40 h-40 rounded-full border-4 border-blue-600 object-cover shadow-lg transition-transform"
                alt="User Avatar"
              />
            </div>

            {/* Buttons: Positioned to the right */}
            <div className="absolute pt-10 top-24 right-20 flex flex-col space-y-4">
              <button
                onClick={() => router.push(`/api/profile/${userId}/update`)}
                className="py-4 text-lg font-semibold text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Update Profile
              </button>
              <a
                href="/"
                className="py-4 px-4 text-lg font-semibold text-center text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150 border border-blue-600 rounded-lg bg-white"
              >
                Back to Dashboard
              </a>
            </div>

            <div>
              {/* Static field: User ID */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">User ID</span>
                <p className="block w-full mt-2 p-4 bg-gray-200 text-lg border-black rounded-lg">{activeUser.id}</p>
              </div>

              {/* Static field: Email */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Email</span>
                <p className="block w-full mt-2 p-4 bg-gray-200 text-lg border-black rounded-lg">{activeUser.email}</p>
              </div>

              {/* Static field: Name */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Name</span>
                <p className="block w-full mt-2 p-4 text-lg border-black bg-gray-200 rounded-lg">{activeUser.name}</p>
              </div>

              {/* Static field: Phone Number */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Phone Number</span>
                <p className="block w-full mt-2 p-4 text-lg border-black bg-gray-200 rounded-lg">{activeUser.phone_number? activeUser.phone_number : "No phone number provided"}</p>
              </div>

              {/* Static field: Address */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Address</span>
                <p className="block w-full mt-2 p-4 text-lg border-black bg-gray-200 rounded-lg">{activeUser.address}</p>
              </div>

              {/* Static field: Joined Date */}
              <div className="block text-lg pb-8">
                <span className="text-gray-700 text-2xl font-bold">Joined</span>
                <p className="block w-full mt-2 p-4 text-lg border-black bg-gray-200 rounded-lg">
                  {formatDate(activeUser.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
