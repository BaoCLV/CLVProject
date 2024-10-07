
import App from '@/src/shared/views/route/userRoute';
import { Suspense } from 'react';
import Loading from '@/src/shared/components/Loading';

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <div>

      <Suspense fallback={<Loading/>}>
        <App />
      </Suspense>
    </div>
  );
}
