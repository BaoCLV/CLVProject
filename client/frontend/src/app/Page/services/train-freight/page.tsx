import Loading from "@/src/shared/components/Loading";
import TrainFreight from "@/src/shared/components/pages/services/Truck";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <TrainFreight />
      </Suspense>
    </div>
  );
};

export default Page;
