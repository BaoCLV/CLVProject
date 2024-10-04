import Loading from "@/src/shared/components/Loading";
import React, { Suspense } from "react";
import UserDashboard from "@/src/shared/views/route/UserDashboard";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <UserDashboard />
      </Suspense>
    </div>
  );
};

export default Page;
