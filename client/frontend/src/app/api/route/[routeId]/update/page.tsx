import UpdateRoute from '@/src/shared/views/route/updateRoute';

export default function Page({ params }: { params: { routeId: number } }) {
  return <UpdateRoute routeId={params.routeId} />;
}
