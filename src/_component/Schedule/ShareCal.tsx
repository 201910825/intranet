import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { addDays, format } from 'date-fns'
import useScheduleStore from '@/store/scheduleStore';
import { SelectedSchedule } from './SelectedSchedule'
import { useDateSchedule, useEventCount} from '@/api/schedule/scheduleApi'
import { PreviewModal } from './PreviewModal'

// 일정 타입 정의
interface Schedule {
  id: string
  title: string
  date: string // YYYY-MM-DD
  startTime?: Date // HH:mm
  endTime?: Date // HH:mm
  description: string
  image: string
}
type ViewMode = 'month' | 'day'

export default function ShareCal() {
  const { setSelectedDate: setStoreDate} = useScheduleStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const secDate = formatDate(selectedDate)
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const navigate = useNavigate()
  const {data: scheduleData } = useDateSchedule(secDate)
  const {data: eventCountData } = useEventCount(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
  // 특정 날짜의 일정을 가져오는 함수
  const getSchedulesForDate = (): Schedule[] => {
    // 데이터 로딩 중이거나 에러 발생 시 빈 배열 반환
    if (!scheduleData) {
      return []
    }
    return scheduleData.dayEventResultDTOList || []
  }

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'month':
        return (
          <Calendar
            mode="single"
            showOutsideDays={false}
            selected={selectedDate}
            onSelect={handleSelect}
            className="rounded-md border"
            classNames={{
              head_row: "flex w-full",
              head_cell: "w-9 font-normal text-[0.8rem] text-muted-foreground",
              row: "flex w-full",
              cell: "w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            }}
            eventCounts={eventCountData?.result.dayEventCountDTOList || []}
          />
        )
      
      case 'day':
        return (
          <DayView
            selectedDate={selectedDate}
            onSelect={handleSelect}
            schedules={getSchedulesForDate()}
          />
        )
    }
  }
  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    setStoreDate(formatDate(date))
  }
  const HandleLink = (date: string) => {
    // 선택된 날짜 저장
    setStoreDate(date)
    
    

    // 페이지 이동
    navigate({
      to: '/schedule/$scheduleId',
      params: { scheduleId: date }
    })
  }
  
  return (
    <div>
      <div className="flex justify-evenly w-screen items-center h-[45px]">
        <Button
          variant={viewMode === 'month' ? 'default' : 'outline'}
          onClick={() => setViewMode('month')}
        >
          월간
        </Button> 
        <Button
          variant={viewMode === 'day' ? 'default' : 'outline'}
          onClick={() => setViewMode('day')}
        >
          일간
        </Button>
      </div>
      <hr />
      {renderCalendarView()}

      {viewMode==='month' && (
        <SelectedSchedule 
          selectedDate={selectedDate}
          schedules={getSchedulesForDate()}
          onDetailClick={(date: string) => HandleLink(date)}
        />
      )}
    </div>
  )
}


const DayView = ({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (date: Date) => void, schedules: Schedule[] }) => {
  const { data, isLoading, error } = useDateSchedule(formatDate(selectedDate));
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowPreview(true);
  };

  return (
    <div className="flex flex-col border rounded-lg bg-background">
      {/* 날짜 헤더 */}
      <div className="sticky top-0 bg-card p-4 border-b">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => onSelect(addDays(selectedDate, -1))}
            className="text-muted-foreground"
          >
            ←
          </Button>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {format(selectedDate, 'yyyy년 MM월 dd일')}
            </div>
            <div className="text-muted-foreground">
              {format(selectedDate, 'EEEE')}
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onSelect(addDays(selectedDate, 1))}
            className="text-muted-foreground"
          >
            →
          </Button>
        </div>
      </div>

      {/* 일정 리스트 */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">로딩 중...</div>
        ) : error ? (
          <div className="text-center text-destructive">일정을 불러오는데 실패했습니다.</div>
        ) : !data?.dayEventResultDTOList?.length ? (
          <div className="text-center text-muted-foreground">등록된 일정이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {data.dayEventResultDTOList.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                style={{
                  borderLeft: `4px solid ${schedule.color || '#666'}`,
                }}
                onClick={() => handleScheduleClick(schedule)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: schedule.color || '#666' }}
                  />
                  <span className="font-medium text-foreground">
                    {schedule.title}
                  </span>
                </div>
                {(schedule.startTime || schedule.endTime) && (
                  <div className="text-sm text-muted-foreground ml-4">
                    {schedule.startTime && schedule.startTime}
                    {schedule.endTime && ` - ${schedule.endTime}`}
                  </div>
                )}
                {schedule.description && (
                  <div className="ml-4 mt-2 text-sm text-muted-foreground">
                    {schedule.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PreviewModal 추가 */}
      {showPreview && selectedSchedule && (
        <PreviewModal
          schedule={selectedSchedule}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
