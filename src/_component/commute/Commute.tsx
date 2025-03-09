import { ScrollArea } from "@/components/ui/scroll-area"
import { Percent } from "../attendance/percent"
import { useEffect } from "react"
import { useState } from "react";
import { useCommute } from "@/api/Commute";
import { Calendar } from "@/components/ui/calendar";

const formatDateString = (date: Date) => {
  return `${date.getFullYear()}-${`${date.getMonth()+1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
};

export default function Commute() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const selectedDateString = formatDateString(selectedDate)
  
  const { data,isLoading, refetch } = useCommute(selectedDateString);

  const handleSelect = async (date: Date | undefined) => {
    if (!date) return
    if (formatDateString(selectedDate) === formatDateString(date)) return
    setSelectedDate(date)
  }

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);
  return (
    <div className="max-h-full">
      <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            className="rounded-md border"
          />
        {isLoading ? <div>Loading...</div> : data && <Percent nowMember={data?.attendanceDayResultDTOList.length} date={selectedDateString}/>}
        <ScrollArea className="h-[250px]">
            <h1 className="p-2 sticky top-0 bg-white"> {selectedDateString} 출퇴근 기록</h1>
            {isLoading ? <div>Loading...</div> : data && data.attendanceDayResultDTOList.map((item, index) => (
                <div key={index} className="p-2 border-b flex justify-between">
                    <p>이름: {item.memberName}</p>
                    <p>출근 시간: {item.attendanceTime.split('T')[1].split('.')[0]}</p>
                    <p>퇴근 시간: {item.offTime.split('T')[1].split('.')[0]}</p>
                </div>
            ))}
        </ScrollArea>
    </div>
  )
}
