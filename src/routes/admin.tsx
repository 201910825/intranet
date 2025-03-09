import Admin from '@/_component/Admin/Admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Admin/>
} 