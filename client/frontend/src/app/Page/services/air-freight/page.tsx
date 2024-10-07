import Loading from "@/src/shared/components/Loading";
import AirFreight from "@/src/shared/components/pages/services/Airplane";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <AirFreight />
      </Suspense>
    </div>
  );
};

export default Page;
