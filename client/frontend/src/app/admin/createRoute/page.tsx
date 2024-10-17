import dynamic from 'next/dynamic';
import Loading from "@/src/shared/components/Loading";
import { Suspense } from 'react';

// Dynamically import CreateRoute
const CreateRoute = dynamic(() => import('@/src/shared/views/route/createRoute'), {
  suspense: true
});

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <CreateRoute />
      </Suspense>
    </div>
  );
};

export default Page;
