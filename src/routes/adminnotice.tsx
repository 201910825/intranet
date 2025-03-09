import AdminNotice from "@/_component/Notice/AdminNotice";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/adminnotice')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AdminNotice />
}

export default RouteComponent;