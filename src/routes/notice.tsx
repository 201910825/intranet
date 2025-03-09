import { createFileRoute } from '@tanstack/react-router'
import Notice from '@/_component/Notice/Notice'
export const Route = createFileRoute('/notice')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Notice />
}