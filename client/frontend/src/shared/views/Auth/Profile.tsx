'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../../../hooks/useUser';
import { format } from 'date-fns'; // Ensure date-fns is installed: npm install date-fns

interface UserDetailProps {
  userId: string;
}

export default function UserProfile({ userId }: UserDetailProps) {
  const router = useRouter();

  // Fetch user data using the useUser hook
  const { loading, user} = useUser();

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
  //if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="pt-[80px]">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h4 className="text-3xl font-semibold text-gray-800">{user.name}</h4>
          </div>
          <hr className="border-t border-gray-300 mb-4" />
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold">Joined:</span> {formatDate(user.createdAt)}
            </p>
          </div>
          <hr className="border-t border-gray-300 mt-6 mb-6" />
          <div className="flex justify-between items-center">
            <a href="/" className="text-blue-500 hover:underline">
              Back to Users
            </a>
            <div className="flex space-x-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
