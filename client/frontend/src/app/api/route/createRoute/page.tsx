import Loading from "@/src/shared/components/Loading";
import React, { Suspense } from "react";
const CreateRoute = React.lazy(() => import("@/src/shared/views/route/createRoute"));

const Page = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <CreateRoute />
      </Suspense>
    </div>
  );
};

export default Page;
