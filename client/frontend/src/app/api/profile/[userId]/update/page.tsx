import Loading from '@/src/shared/components/Loading';
import UpdateProfile from '@/src/shared/views/Auth/UpdateProfile';
import React, { Suspense } from "react";


export default function Page({ params }: { params: { userId: string } }) {
  return <div>
    <Suspense fallback={<Loading />}>
      <UpdateProfile userId={params.userId} />
    </Suspense>
  </div>
  ;
}
