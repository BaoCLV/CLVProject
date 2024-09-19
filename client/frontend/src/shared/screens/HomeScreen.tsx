"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import App from "../views/route/dashboard";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const HomeScreen = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-gray-100 dark:bg-gray-600 p-4">
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomeScreen;
