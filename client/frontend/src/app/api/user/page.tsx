'use client'

import Footer from '@/src/shared/components/Footer';
import Header from '@/src/shared/components/Header';
import Sidebar from '@/src/shared/components/Sidebar';
import DashBoard from '@/src/shared/views/user/userDashboard';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function Page() {
    const queryClient = new QueryClient();

    return <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 bg-gray-200 border-black">
            <Header />
            <QueryClientProvider client={queryClient}>
                <DashBoard />
            </QueryClientProvider>
        </div>
    </div>;
}
