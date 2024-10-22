import UpdateRoute from "@/src/shared/components/pages/admin/AdminUpdateRoute";


export default function Page({ params }: { params: { routeId: string } }) {
  return <UpdateRoute routeId={params.routeId} />;
}
