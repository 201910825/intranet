import ManageComponent from '@/_component/Schedule/CalendarView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule/$scheduleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { scheduleId } = Route.useParams()
  return<ManageComponent scheduleId={scheduleId} />
}
