
import Attendance from '@/_component/attendance/Attendance'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/attendance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Attendance/>
}
