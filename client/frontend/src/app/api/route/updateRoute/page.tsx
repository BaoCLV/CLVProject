import Loading from "@/src/shared/components/Loading";
import UserRoutesDashboard from "@/src/shared/views/route/userRoute";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <UserRoutesDashboard />
      </Suspense>
    </div>
  );
};

export default Page;
