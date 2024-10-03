import Loading from "@/src/shared/components/Loading";
import React, { Suspense } from "react";
import UserDashboard from "@/src/shared/views/route/UserDashboard";
import App from "@/src/shared/views/route/Admin-dashboard";


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
