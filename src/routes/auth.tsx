
import { SignUp } from '@/_component/Auth/SignUp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignUp />
}
