"use client";

import { useRouter } from 'next/navigation';
import { useUser } from '../../../hooks/useUser';
import { format } from 'date-fns'; // Ensure date-fns is installed: npm install date-fns
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';
import { Avatar } from '@nextui-org/react';

interface UserDetailProps {
  userId: string;
}

export default function UserProfile({ userId }: UserDetailProps) {
  const router = useRouter();

  // Fetch user data using the useUser hook
  const { loading, user } = useUser();

  // Handler for updating user details
  const handleUpdate = () => {
    router.push(`/api/profile/${userId}/update`);
  };

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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="flex h-screen bg-white">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-white p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 shadow-lg rounded-xl p-8">
              <div className="flex flex-col items-center md:items-start space-y-4">
                {/* User Profile Photo */}
                <Avatar
              as="button"
              className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover shadow-lg transition-transform"
              src={ user.image}
            />
                {/* User Info */}
                <h1 className="text-3xl font-bold text-blue-900">{user.name}</h1>
                <p className="text-xl text-blue-600">{user.roles}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-6 md:mt-0 space-x-4">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Update Profile
                </button>
                <a
                  href="/"
                  className="px-6 py-2 text-blue-600 hover:text-blue-700 hover:underline font-semibold rounded-lg border border-blue-600 shadow-md transition-all duration-300 ease-in-out"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info Cards */}
              <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Email</h3>
                <p className="mt-2 text-blue-600">{user.email}</p>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Phone Number</h3>
                <p className="mt-2 text-blue-600">{user.phone_number}</p>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Address</h3>
                <p className="mt-2 text-blue-600">{user.address}</p>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Joined</h3>
                <p className="mt-2 text-blue-600">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
