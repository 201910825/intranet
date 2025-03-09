
import { DrawerClose } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from "@tanstack/react-router"

export function ScrollMenu() {
  return (
    <ScrollArea className="h-72 w-full rounded-md">
      <div>
        <Link to="/"><DrawerClose>홈</DrawerClose></Link><br />
        <Link to="/attendance"><DrawerClose>출퇴근 체크</DrawerClose></Link><br />
        <Link to="/commute"><DrawerClose>출퇴근 직원 목록</DrawerClose></Link><br />
        <Link to="/sharecalendar"><DrawerClose>공유 캘린더</DrawerClose></Link><br />
      </div>
    </ScrollArea>
  )
}
