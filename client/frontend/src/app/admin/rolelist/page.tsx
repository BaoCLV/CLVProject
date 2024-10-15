import Loading from "@/src/shared/components/Loading";
import RoleDashBoard from "@/src/shared/views/role/rolelist"
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <RoleDashBoard/>
      </Suspense>
    </div>
  );
};

export default Page;
