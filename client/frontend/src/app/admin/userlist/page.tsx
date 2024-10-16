import Loading from "@/src/shared/components/Loading";
import App from "@/src/shared/views/route/Admin-dashboard";
import UserDashboard from "@/src/shared/views/user/userlist";
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
