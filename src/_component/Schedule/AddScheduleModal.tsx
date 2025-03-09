import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParticipantData } from '@/api/userAdmin'
import { Calendar } from '@/components/ui/calendar'
import { ko } from 'date-fns/locale'

export const AddScheduleModal = ({
  date,
  defaultHour,
  onClose,
  onSubmit,
}: {
  date: Date
  defaultHour: number
  onClose: () => void

  onSubmit: (data: {
    title: string
    description: string
    startTime: string
    endTime: string
    participantIds: string[]
    file: File[]
  }) => void
}) => {
  const { data } = useParticipantData();
  const [formData, setFormData] = useState({
    title: '',
    startDate: format(date, 'yyyy-MM-dd'),
    endDate: format(date, 'yyyy-MM-dd'),
    startTime: `${String(defaultHour).padStart(2, '0')}:00`,
    endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
    description: '',
    participantIds: [] as string[],
    file: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 시작 시간과 종료 시간의 유효성을 검사하는 함수
  const isValidTimeRange = (startDate: Date, startTime: string, endDate: Date, endTime: string) => {
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      parseInt(startTime.split(':')[0]),
      parseInt(startTime.split(':')[1])
    )
    
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      parseInt(endTime.split(':')[0]),
      parseInt(endTime.split(':')[1])
    )

    return start < end
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidTimeRange(new Date(formData.startDate), formData.startTime, new Date(formData.endDate), formData.endTime)) {
      alert('종료 일시는 시작 일시보다 늦어야 합니다.')
      return
    }

    if (formData.file.length > 0 && formData.file[0].size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // 날짜와 시간 결합
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`)

      const createEventDTO = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(startDateTime.getTime() - (startDateTime.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, -1),
        endTime: new Date(endDateTime.getTime() - (endDateTime.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, -1),
        participantIds: formData.participantIds,
      }
      
      
      onSubmit({
        ...createEventDTO,
        file: formData.file
      })
    } catch (error) {
      console.error('일정 추가 중 오류 발생:', error)
      alert('일정 추가 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 w-4/5 max-h-[80vh] max-w-md overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">
            새 일정 추가 - {format(date, 'yyyy년 MM월 dd일')}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">날짜 선택</label>
                <Calendar
                  mode="range"
                  selected={{
                    from: new Date(formData.startDate),
                    to: new Date(formData.endDate)
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setFormData(prev => ({
                        ...prev,
                        startDate: format(range.from!, 'yyyy-MM-dd'),
                        endDate: format(range.to ?? range.from!, 'yyyy-MM-dd')
                      }))
                    }
                  }}
                  locale={ko}
                  className="rounded-md border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">시작 시간</label>
                  <div className="flex items-center gap-2">
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                      value={formData.startTime.split(':')[0]}
                      onChange={e => {
                        const hour = e.target.value.padStart(2, '0');
                        const minutes = formData.startTime.split(':')[1];
                        const newStartTime = `${hour}:${minutes}`;
                        
                        setFormData(prev => {
                          const newState = {
                            ...prev,
                            startTime: newStartTime,
                          }
                          
                          // 같은 날짜인 경우에만 종료 시간 자동 조정
                          if (new Date(prev.startDate).getTime() === new Date(prev.endDate).getTime() && 
                              !isValidTimeRange(new Date(prev.startDate), newStartTime, new Date(prev.endDate), prev.endTime)) {
                            newState.endTime = `${String(Number(hour) + 1).padStart(2, '0')}:${minutes}`
                          }
                          
                          return newState
                        })
                      }}
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                      value={formData.startTime.split(':')[1]}
                      onChange={e => {
                        const hour = formData.startTime.split(':')[0];
                        setFormData(prev => ({
                          ...prev,
                          startTime: `${hour}:${e.target.value}`
                        }))
                      }}
                    >
                      {['00', '15', '30', '45'].map(minute => (
                        <option key={minute} value={minute}>
                          {minute}분
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">종료 시간</label>
                  <div className="flex items-center gap-2">
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                      value={formData.endTime.split(':')[0]}
                      onChange={e => {
                        const hour = e.target.value.padStart(2, '0');
                        const minutes = formData.endTime.split(':')[1];
                        const newEndTime = `${hour}:${minutes}`;
                        
                        if (isValidTimeRange(new Date(formData.startDate), formData.startTime, new Date(formData.endDate), newEndTime)) {
                          setFormData(prev => ({
                            ...prev,
                            endTime: newEndTime
                          }))
                        }
                      }}
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                      value={formData.endTime.split(':')[1]}
                      onChange={e => {
                        const hour = formData.endTime.split(':')[0];
                        setFormData(prev => ({
                          ...prev,
                          endTime: `${hour}:${e.target.value}`
                        }))
                      }}
                    >
                      {['00', '15', '30', '45'].map(minute => (
                        <option key={minute} value={minute}>
                          {minute}분
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <Input
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">사진</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    file: e.target.files ? [...prev.file, e.target.files[0]] : prev.file
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">참여자</label>
                <Select
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      participantIds: [...prev.participantIds, value]
                    }))
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="참여자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.memberResultDTOList?.map((member) => (
                      <SelectItem 
                        key={member.userId} 
                        value={member.userId}
                        disabled={formData.participantIds.includes(member.userId)}
                      >
                        {member.username} ({member.position})
                      </SelectItem>
                    )) || null}
                  </SelectContent>
                </Select>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.participantIds.map((userId) => {
                    const member = data?.memberResultDTOList.find(m => m.userId === userId);
                    return (
                      <div 
                        key={userId} 
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"
                      >
                        <span>{member?.username}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              participantIds: prev.participantIds.filter(id => id !== userId)
                            }))
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}

              >
                {isSubmitting ? '처리중...' : '추가'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  )
}