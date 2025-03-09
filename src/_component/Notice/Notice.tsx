import { useGetNotices } from "@/api/NoticeApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Notice = () => {
    const [page, setPage] = useState(0);
    const { data } = useGetNotices(page);
    
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="border-b">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    공지사항
                </CardTitle>
                <CardDescription className="text-base">
                    최신 공지사항을 확인하세요
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                    {data?.content[0]?.noticeResultDTOList.map((notice) => (
                        <div key={notice.id} className="mb-8 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold text-primary">{notice.title}</h2>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">작성자:</span>
                                    {notice.memberName}
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                            {notice.images && notice.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {notice.images.map((image, index) => (
                                        <div key={index} className="rounded-lg overflow-hidden">
                                            <img 
                                                src={image} 
                                                alt={`${notice.title} - 이미지 ${index + 1}`} 
                                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </ScrollArea>
                <div className="flex items-center justify-center space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={!data || page === 0}
                    >
                        이전
                    </Button>
                    <div className="flex items-center justify-center text-sm">
                        <span className="font-medium">{page + 1}</span>
                        <span className="text-muted-foreground">/{data?.totalPages || 1}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={!data || page >= data.totalPages - 1}
                    >
                        다음
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
export default Notice;