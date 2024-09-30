'use client'

import Footer from '@/src/shared/components/Footer';
import Header from '@/src/shared/components/Header';
import Sidebar from '@/src/shared/components/Sidebar';
import DashBoard from '@/src/shared/views/user/dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function Page() {
    const queryClient = new QueryClient();

    return <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 bg-gray-100 dark:bg-gray-600 p-4">
                <QueryClientProvider client={queryClient}>
                    <DashBoard />
                </QueryClientProvider>
            </main>
            <Footer />
        </div>
    </div>;
}
