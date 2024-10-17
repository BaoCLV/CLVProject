import Loading from "@/src/shared/components/Loading";
import Request from "@/src/shared/views/route/request";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <Request/>
      </Suspense>
    </div>
  );
};

export default Page;
