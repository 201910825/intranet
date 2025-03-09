import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { MenuBar } from '../_component/Menu/MenuBar'
import { LoginForm } from '@/_component/Auth/Login'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'

// 로그인 상태 확인 함수 추가 (실제 구현에 맞게 수정 필요)
const isAuthenticated = () => {
  // 예: localStorage, 전역 상태 관리 등에서 로그인 상태 확인
  return !!localStorage.getItem('accessToken')
}

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    // 루트 경로('/')가 아니고 로그인하지 않은 경우
    if (location.pathname !== '/' && location.pathname !== '/auth' && !isAuthenticated()) {
      toast({   
        title: "로그인이 필요합니다",
        description: "해당 페이지에 접근하려면 먼저 로그인해 주세요.",
        variant: "destructive"
      })
      throw redirect({
        to: '/',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
  component: () => (
    <>
      <div className="p-2 flex justify-between items-center w-screen">
        <MenuBar/>
        <Link to={'/'}>토탈 공조</Link>
        <LoginForm/>
      </div>
      <hr />
      <Outlet />
      <Toaster/>
    </>
  ),
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">페이지를 찾을 수 없습니다</p>
        <Link to="/" className="mt-4 text-blue-500 hover:text-blue-700">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }
})