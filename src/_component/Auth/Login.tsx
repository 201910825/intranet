import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "@tanstack/react-router"
import { signIn } from "@/api/Login"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export function LoginForm() {
  const navigate = useNavigate() 
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleLogin = async () => {
    await signIn({email, password})
    window.location.reload()
  }
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setIsLoggedIn(false)
    navigate({to:'/'})
  }
  useEffect(()=>{
    if(localStorage.getItem('accessToken')){
      setIsLoggedIn(true)
    }
  },[])
  return (
    <Dialog>
      <DialogTrigger asChild>
        {isLoggedIn ? (
          <Button variant="outline" onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button variant="outline">로그인</Button>
        )}
      </DialogTrigger>
      {!isLoggedIn && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                이메일
              </Label>
              <Input
                id="id"
                defaultValue={email}
                className="col-span-3"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                비밀번호
              </Label>
              <Input
                type="password"
                id="password"
                defaultValue={password}
                className="col-span-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="w-full">
            <DialogPrimitive.Close asChild>
              <Button onClick={()=>{
                navigate({to:'/auth'})
              }}>
                회원가입
              </Button>
            </DialogPrimitive.Close>
            <Button type="submit" onClick={handleLogin}>로그인</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
