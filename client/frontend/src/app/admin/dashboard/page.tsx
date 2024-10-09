import Loading from "@/src/shared/components/Loading";
import App from "@/src/shared/views/route/Admin-dashboard";
import UserDashboard from "@/src/shared/views/user/userDashboard";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <App />
      </Suspense>
    </div>
  );
};

export default Page;
