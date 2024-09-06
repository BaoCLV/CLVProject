import RouteDetail from '@/src/shared/views/route/routeDetail'; // Ensure the path is correct

export default function Page({ params }: { params: { routeId: string } }) {
  return <RouteDetail routeId={params.routeId} />;
}
