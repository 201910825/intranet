import Commute from '@/_component/commute/Commute'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/commute')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Commute/>
}
