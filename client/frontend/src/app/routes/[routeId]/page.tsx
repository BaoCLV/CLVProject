import RouteDetail from '@/src/shared/views/route/routeDetail';

export default function Page({ params }: { params: { routeId: string } }) {
  return <RouteDetail routeId={params.routeId} />;
}
