import UpdateRoute from '@/src/shared/views/route/updateRoute';

export default function Page({ params }: { params: { routeId: string } }) {
  return <UpdateRoute routeId={params.routeId} />;
}
