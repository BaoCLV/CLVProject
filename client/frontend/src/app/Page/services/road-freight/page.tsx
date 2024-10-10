import Loading from "@/src/shared/components/Loading";
import RoadFreight from "@/src/shared/components/pages/services/Train";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <RoadFreight />
      </Suspense>
    </div>
  );
};

export default Page;
