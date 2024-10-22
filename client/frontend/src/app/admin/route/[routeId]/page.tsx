import { Suspense } from 'react';
import RouteDetail from '@/src/shared/views/route/routeDetail';
import Loading from '@/src/shared/components/Loading'; // Use the loading component inside Suspense

export default function Page({ params }: { params: { routeId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <RouteDetail routeId={params.routeId} />
    </Suspense>
  );
}
