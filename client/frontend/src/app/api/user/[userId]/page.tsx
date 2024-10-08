import { Suspense } from 'react';
import Loading from '@/src/shared/components/Loading'; // Use the loading component inside Suspense
import UserDetail from '@/src/shared/views/user/userDetail';

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <UserDetail userId={params.userId} />
    </Suspense>
  );
}
