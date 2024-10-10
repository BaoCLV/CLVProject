import Loading from "@/src/shared/components/Loading";
import OceanFreight from "@/src/shared/components/pages/services/Ocean";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <OceanFreight />
      </Suspense>
    </div>
  );
};

export default Page;
