import { useMySchedule } from "@/api/schedule/scheduleApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock } from "lucide-react";

const MySchedule = () => {
    const { data, isLoading } = useMySchedule();
    const schedules = data ? Object.entries(data.result).flatMap(([ , events ]) => {
        return Array.isArray(events) ? events : [];
    }) : [];
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    내 일정
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-lg" />
                        <Skeleton className="h-[125px] w-full rounded-lg" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((item) => (
                            <Card key={item.id} className="bg-muted/50">
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                    <div className="text-sm text-muted-foreground">
                                        <p>시작: {item.startTime}</p>
                                        <p>종료: {item.endTime}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {schedules.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                일정이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default MySchedule;