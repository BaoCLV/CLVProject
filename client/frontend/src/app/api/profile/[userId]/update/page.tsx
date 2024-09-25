import UpdateProfile from '@/src/shared/views/Auth/UpdateProfile';


export default function Page({ params }: { params: { userId: string } }) {
  return <UpdateProfile userId={params.userId} />;
}
