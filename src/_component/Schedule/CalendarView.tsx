'use client'
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { AddScheduleModal } from "./AddScheduleModal";
import { useAddSchedule, useDateSchedule, useDeleteSchedule, useModifySchedule } from "@/api/schedule/scheduleApi";
import { formatDate } from "date-fns";
import { ModifyScheduleModal } from "./ModifyModal";
import { toast } from "@/hooks/use-toast";

interface Props {
  scheduleId: string;
}

export default function ManageComponent({ scheduleId }: Props) {
  const addSchedule = useAddSchedule();
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const { data } = useDateSchedule(scheduleId);   
  const modifySchedule = useModifySchedule();
  const [eventId, setEventId] = useState('');
  const deleteSchedule = useDeleteSchedule();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // 사용자 데이터 가져오기

  const handleBack = () => {
    navigate({ to: '..' });
  };  

  
  // 참여자 ID 목록을 한 번에 가져오기
  return (
    <div className="w-full h-[80vh] pt-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* 날짜 헤더 */}
        <div className="mb-6 flex justify-between px-4 items-center">
          <Link to={'/sharecalendar'}><Button variant='ghost' className="relative top-0 left-0" onClick={handleBack}><ArrowLeft/></Button></Link>
          <h1 className="text-2xl font-bold text-foreground">
            {scheduleId} 일정
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>+ 일정 추가</Button>
        </div>

        {/* 모달 컴포넌트 */}
        {isModalOpen && (
          <AddScheduleModal 
            date={new Date(scheduleId)}
            defaultHour={new Date().getHours()}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(data) => {
              addSchedule.mutateAsync(data as any);
              setIsModalOpen(false);
            }}
          />
        )}
        {isModifyModalOpen && data && (
          <ModifyScheduleModal 
            date={new Date(scheduleId)}
            defaultHour={new Date().getHours()}
            onClose={() => setIsModifyModalOpen(false)}
            onSubmit={(data) => {
              modifySchedule.mutateAsync({eventId: eventId, data: data as any});
              setIsModifyModalOpen(false);
            }}
          />
        )}
        {/* 일정 목록 */}
        <div className="space-y-4">
          {data && data.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              예정된 일정이 없습니다.
            </div>
          ) : (
            data && data.dayEventResultDTOList.map(schedule => (
              <div
                key={schedule.id}
                className="p-4 rounded-lg transition-all hover:shadow-md bg-card border-b-2 pb-4"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${schedule.color} 10%, transparent)`,
                  borderLeft: `4px solid ${schedule.color}` 
                }}
              >
                <h3 className="text-lg text-center border-b-2 pb-2 font-medium text-foreground">
                  {schedule.title}
                </h3>
                <div className="flex items-center justify-around">
                  
                  <div className="text-sm text-muted-foreground">
                    {schedule.startTime && formatDate(schedule.startTime, 'yyyy.MM.dd HH:mm')}<br></br>
                    {schedule.endTime && formatDate(schedule.endTime, 'yyyy.MM.dd HH:mm')}
                  </div>
                  <div className="flex max-w-[20vh] items-center gap-2 flex-col justify-center text-center">
                    {schedule.participantDTOList.length > 0  ? <div>{schedule.participantDTOList.length} 참여자</div> : <div>참여자 없음</div>}
                    {schedule.participantDTOList.length > 0 && (
                      <div>
                        {schedule.participantDTOList
                          .map(id => id.username)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Pen className="cursor-pointer" onClick={() => {
                      setIsModifyModalOpen(true);
                      setEventId(schedule.id);
                    }}/>
                    <Trash 
                      className={`${deleteSchedule.isPending ? 'opacity-50' : ''} cursor-pointer`}
                      onClick={async () => {
                        if (deleteSchedule.isPending) return;
                        try {
                          await deleteSchedule.mutateAsync(schedule.id);
                          toast({
                            title: '삭제 완료',
                            description: '일정이 삭제되었습니다.',
                          });
                        } catch (error) {
                          toast({
                            title: '삭제 실패',
                            description: '일정 삭제 중 오류가 발생했습니다.',
                            variant: 'destructive'
                          });
                        }
                      }}
                    />
                  </div>
                  
                </div>
                
                {schedule.description && (
                  <p className="mt-2 text-muted-foreground ml-5">
                    {schedule.description}
                  </p>
                )}
                {schedule.imageUrls && (
                  <div className="mt-2 grid grid-cols-2 gap-2 ml-5">
                    {schedule.imageUrls.map((image, index) => (
                      <img 
                        key={index}
                        src={image}  
                        alt="일정 이미지" 
                        className="w-full h-40 object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                )}

              </div>
            )) 
          )}
        </div>

      </div>

      {/* 이미지 모달 추가 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative min-w-[50%] max-w-[90%] max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="확대된 이미지" 
              className="min-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

    </div>
  );
}