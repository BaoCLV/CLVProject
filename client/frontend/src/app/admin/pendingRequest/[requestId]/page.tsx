
import RequestDetail from '@/src/shared/views/route/requestDetail';


export default function Page({ params }: { params: { requestId: string } }) {
  return <RequestDetail requestId={params.requestId} />;
}
