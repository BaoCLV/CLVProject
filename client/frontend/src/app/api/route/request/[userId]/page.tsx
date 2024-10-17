"use client"
import RequestByUserId from '@/src/shared/views/route/requestByUserId';
import { QueryClient, QueryClientProvider } from 'react-query';


export default function Page({ params }: { params: { userId: string } }) {
    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>
        <RequestByUserId userId={params.userId} />
    </QueryClientProvider>
}
