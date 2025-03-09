import { createFileRoute } from '@tanstack/react-router'
import MyProfile from '../_component/MyProfile/MyProfile'
export const Route = createFileRoute('/profile')({
  component: RouteComponent,
    })

function RouteComponent() {
  return <MyProfile />
}
