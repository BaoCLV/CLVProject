
import RoutePage from '@/src/shared/components/pages/admin/RoutePage'
import { Suspense } from 'react';
import Loading from '@/src/shared/components/Loading';

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <RoutePage />
      </Suspense>
    </div>
  );
}
