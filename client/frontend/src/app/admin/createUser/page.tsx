import Loading from "@/src/shared/components/Loading";
import App from "@/src/shared/views/route/Admin-dashboard";
import CreateRoute from "@/src/shared/views/route/createRoute";
import CreateUser from "@/src/shared/views/user/createUser";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <CreateUser />
      </Suspense>
    </div>
  );
};

export default Page;
