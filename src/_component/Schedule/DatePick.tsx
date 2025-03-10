"use client"
 
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDateStore } from "@/store/useDateStore"


export function DatePick() {
  const [date, setDate] = React.useState<Date>()
  const {setSelectedDate } = useDateStore()
  const handleSubmit = ()=>{
    if(date!==undefined){
        setSelectedDate(`${date}`)
    }
    else return;
    
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal mr-3",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>일정을 선택해주세요.</span>}
        </Button>
        
      </PopoverTrigger>
      <Button onClick={handleSubmit}>저장</Button>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
      
    </Popover>
  )
}