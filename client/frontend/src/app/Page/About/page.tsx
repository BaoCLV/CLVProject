import Loading from "@/src/shared/components/Loading";
import AboutPage from "@/src/shared/components/pages/About";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <AboutPage />
      </Suspense>
    </div>
  );
};

export default Page;
