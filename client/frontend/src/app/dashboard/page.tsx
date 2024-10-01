import Loading from "@/src/shared/components/Loading";
import React, { Suspense } from "react";
import Dashboard from "@/src/shared/views/route/dashboard";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default Page;
