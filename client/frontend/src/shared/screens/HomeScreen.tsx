"use client";


import { QueryClient, QueryClientProvider } from "react-query";
import LandingPage from "./LandingScreen";

const queryClient = new QueryClient();

const HomeScreen = () => {
  return (
    // <div className="flex h-screen">
    //   <Sidebar />
      // <div className="flex flex-col flex-1">
      //   <Header />
        <LandingPage/>
      //   <Footer />
      // </div>
    //</div>
  );
};

export default HomeScreen;
