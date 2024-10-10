
import UpdateUser from '@/src/shared/views/user/userUpdate';


export default function Page({ params }: { params: { userId: string } }) {
  return <UpdateUser userId={params.userId} />;
}
