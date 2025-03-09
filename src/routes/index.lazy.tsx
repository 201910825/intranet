import { BentoCard, BentoGrid } from '@/_component/Home/BentoGrid'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Footprints, ListCheck, User, Bell } from 'lucide-react'
import { CalendarCheck } from 'lucide-react';
export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2 h-[90vh] relative">
      <button 
        className="fixed top-20 right-4 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg"
        onClick={() => window.location.href = '/notice'}
      >
        <Bell size={24} />
      </button>
      <div className="container mx-auto p-4 w-[70vw] overflow-y-auto  ">
          <BentoGrid className='max-h-[90vh] h-[80vh] overflow-auto' >
            <BentoCard
              name="출퇴근 체크"
              Icon={Footprints}
              description="출퇴근을 기록하세요"
              href="/attendance"
              cta="ENTER"
              className= "md:col-start-2 md:col-end-2 md:row-start-1 md:row-end-3 min-h-[170px] border"
            />
            <BentoCard
              name="출퇴근 목록"
              Icon={ListCheck}
              description="직원들의 출퇴근을 확인해요"
              href="/commute"
              cta="ENTER"

              className='md:row-start-3 md:row-end-4 md:col-start-2 md:col-end-3 min-h-[170px] border '
            />
            <BentoCard
              name="공유 캘린더"
              Icon={CalendarCheck}
              description="공유 중인 캘린더를 확인해요."
              href="/sharecalendar"
              cta="ENTER"
              className= "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3 min-h-[170px] border"
            />
            <BentoCard
              name="관리자 페이지"
              Icon={User}
              description=""
              href="/admin"
              cta="ENTER"
              className= "md:col-start-1 md:col-end-2 md:row-start-4 md:row-end-3 min-h-[170px] border"
            />
            <BentoCard
              name="내 프로필"
              Icon={User}
              description="내 프로필을 확인해요"
              href="/profile"
              cta="ENTER"
              className= "md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-5 min-h-[170px] border"
            />

          </BentoGrid>
        </div>
    </div>
  )
}