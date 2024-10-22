import UserProfile from '@/src/shared/views/Auth/Profile'; // Ensure the path is correct
import Loading from "@/src/shared/components/Loading";
import React, { Suspense } from "react";

function Page({ params }: { params: { userId: string } }) {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <UserProfile userId={params.userId} />;
      </Suspense>
    </div>
  );
};

export default Page;
