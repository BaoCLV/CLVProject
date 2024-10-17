import Loading from "@/src/shared/components/Loading";
import PendingRequest from "@/src/shared/views/route/pendingRequest";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <PendingRequest/>
      </Suspense>
    </div>
  );
};

export default Page;
