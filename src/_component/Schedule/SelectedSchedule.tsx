import { format, formatDate } from 'date-fns'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'


interface Schedule {
    id: string
    title: string
    date: string // YYYY-MM-DD
    startTime?: Date // HH:mm
    endTime?: Date // HH:mm
    description: string
    image: string
  }
interface SelectedScheduleProps {
  selectedDate: Date
  isModal ?: boolean
  schedules: Schedule[]
  onDetailClick: (date: string) => void
  onClose?: ()=> void
}

export function SelectedSchedule({ selectedDate, schedules, onDetailClick, isModal=false, onClose }: SelectedScheduleProps) {
    return (
    <div className="mt-4 bg-background rounded-lg shadow-sm p-4">
      {isModal ===true &&
      <div className='flex justify-end w-full relative top-0 pb-2'>
        <X className='cursor-pointer' onClick={onClose}/>
      </div>
      }
      <div className='w-full flex justify-between items-center mb-4 border-b pb-3'>
        <h3 className="text-lg font-semibold text-foreground">
          {format(selectedDate, 'yyyy년 MM월 dd일')} 일정
        </h3> 
        <Button 
          onClick={() => onDetailClick(format(selectedDate, 'yyyy-MM-dd'))}
          variant="outline"
          className="hover:bg-muted"
        >
          상세보기
        </Button>
      </div>
      
      <div className="space-y-3 overflow-y-auto">
        {schedules && schedules.length === 0 ? (
          <div className="text-center text-muted-foreground py-4 overflow-y-auto">
            예정된 일정이 없습니다.
          </div>
        ) : (
          schedules && schedules.map(schedule => (
            <div
              key={schedule.id}
              className="p-3 rounded-lg transition-all hover:shadow-md bg-card"
              style={{ 
                backgroundColor: `color-mix(in srgb, 10%, transparent)`,
                borderLeft: `4px solid ` 
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `color-mix(in srgb, 10%, transparent)` }}
                />
                <div className="font-medium text-card-foreground">{schedule.title}</div>
              </div>
              <div className="ml-4 mt-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <p>{schedule.startTime && formatDate(schedule.startTime,'yyyy-MM-dd:HH:mm')}</p> - <p>{schedule.endTime && formatDate(schedule. endTime,'yyyy-MM-dd:HH:mm')}</p>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {schedule.description}
                </div>
                {schedule.image && (
                <div className="mt-2">
                  <img src={schedule.image} alt="일정 이미지" className="w-full h-auto" />
                </div>
              )}
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  )
}