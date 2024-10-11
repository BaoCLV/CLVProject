import Loading from "@/src/shared/components/Loading";
import CreateRoute from "@/src/shared/views/route/createRoute";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <CreateRoute />
      </Suspense>
    </div>
  );
};

export default Page;
