import ShareCal from '@/_component/Schedule/ShareCal'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sharecalendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ShareCal />
}
