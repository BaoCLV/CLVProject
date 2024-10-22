import Loading from '@/src/shared/components/Loading';
import ChangePassword from '@/src/shared/views/Auth/changePassword';
import React, { Suspense } from "react";


export default function Page({ params }: { params: { userId: string } }) {
  return <div>

    <Suspense fallback={<Loading />}>
      <ChangePassword userId={params.userId} />
    </Suspense>
  </div>
  ;
}
