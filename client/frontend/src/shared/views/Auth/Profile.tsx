'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../../../hooks/useUser';
import { format } from 'date-fns'; // Ensure date-fns is installed: npm install date-fns
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface UserDetailProps {
  userId: string;
}

export default function UserProfile({ userId }: UserDetailProps) {
  const router = useRouter();

  // Fetch user data using the useUser hook
  const { loading, user } = useUser();

  // Handler for updating user details
  const handleUpdate = () => {
    router.push(`/api/user/${userId}/update`);
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
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex flex-col flex-1">
        <Header/>
      <div className="flex flex-col flex-1">
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-4">
          <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            User Profile
          </h4>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="space-y-4">
              <p className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-semibold">Name:</span> {user.name}
              </p>
              <p className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-semibold">Email:</span> {user.email}
              </p>
              <p className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-semibold">Username:</span> {user.username}
              </p>
              <p className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-semibold">Joined:</span> {formatDate(user.createdAt)}
              </p>
            </div>

            <hr className="border-t border-gray-300 my-6 dark:border-gray-700" />

            <div className="flex justify-between items-center">
              <a href="/" className="text-blue-500 hover:underline dark:text-blue-400">
                Back to Dashboard
              </a>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
