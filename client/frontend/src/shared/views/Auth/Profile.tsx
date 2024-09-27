'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../../../hooks/useUser';
import { format } from 'date-fns'; // Ensure date-fns is installed: npm install date-fns
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';

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
    <div className="flex h-screen">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8"> {/* Increased padding */}
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            User Profile
          </h4>
          <div className="px-4 py-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-8"> {/* Increased spacing */}
            <div className="space-y-8">
              <div className="block text-lg"> {/* Made text larger */}
                <span className="text-gray-900 dark:text-gray-100">Name</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.name}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Email</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.email}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Phone Number</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.phone_number}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Address</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.address}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Role</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.role}
                </p>
              </div>

              {/* <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Username</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {user.username}
                </p>
              </div> */}

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Joined</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-8">
              <a
                href="/"
                className="text-blue-500 hover:underline dark:text-blue-400 font-semibold"
              >
                Back to Dashboard
              </a>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
