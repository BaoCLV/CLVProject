import UserProfile from '@/src/shared/views/Auth/Profile'; // Ensure the path is correct

export default function Page({ params }: { params: { userId: string } }) {
  return <UserProfile userId={params.userId} />;
}
