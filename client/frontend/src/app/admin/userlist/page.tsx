import Loading from "@/src/shared/components/Loading";
import UserDashboard from "@/src/shared/views/user/userDashboard";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <UserDashboard/>
      </Suspense>
    </div>
  );
};

export default Page;
