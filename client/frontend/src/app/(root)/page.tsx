import Loading from "@/src/shared/components/Loading";
import HomeScreen from "../../shared/screens/HomeScreen";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <HomeScreen />
      </Suspense>
    </div>
  );
};

export default Page;
