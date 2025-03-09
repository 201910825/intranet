import { useCreateNotice, useDeleteNotice, useGetNotices } from "@/api/NoticeApi";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
interface Notice {
    id: number;
    title: string;
    content: string;
    image: string;
    author: string;
}

const AdminNotice = () => {
    const navigate = useNavigate();
    const { mutate: createNotice } = useCreateNotice();
    const { mutate: deleteNotice } = useDeleteNotice();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        images: [] as File[]
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const { data: notices } = useGetNotices();
    return (
        <div className="p-4">
            <h1>공지사항 관리</h1>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2>공지사항 목록</h2>
                    
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>공지사항 작성</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>공지사항 작성</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                createNotice({
                                    title,
                                    content,
                                    images: formData.images
                                });
                                setIsCreateDialogOpen(false);
                            }}>
                                <div className="space-y-4">
                                    <Input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목" 
                                    />
                                    <Textarea 
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="내용"
                                        className="h-32"
                                    />
                                    <div>
                                        <Label className="block text-sm font-medium mb-1">사진</Label>
                                        <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setFormData(prev => ({ 
                                            ...prev, 
                                            images: e.target.files ? [...prev.images, e.target.files[0]] : prev.images
                                        }))}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">작성</Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => navigate({to: '/admin'})}>뒤로가기</Button>
                </div>
                <table className="w-full"> 
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>수정일</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices && notices.length > 0 ? notices.map((notice) => (
                            <tr key={notice.id}>
                                <td>{notice.id}</td>
                                <td>
                                    <Button 
                                        variant="link"
                                        onClick={() => {
                                            setSelectedNotice(notice);
                                            setIsViewDialogOpen(true);
                                        }}
                                        className="text-left"
                                    >
                                        {notice.title}
                                    </Button>
                                </td>
                                <td>{notice.author}</td>
                                <td>{notice.createdAt}</td>
                                <td>{notice.updatedAt}</td>
                                <td>
                                    <button 
                                        onClick={() => deleteNotice(notice.id)}
                                        className="text-red-500"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6}>공지사항이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    {selectedNotice && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedNotice.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    <p>작성자: {selectedNotice.author}</p>
                                </div>
                                {selectedNotice.image && (
                                    <div className="border-t pt-4">
                                        <img 
                                            src={selectedNotice.image} 
                                            alt={selectedNotice.title}
                                            className="max-h-60 object-contain mx-auto"
                                        />
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <p>{selectedNotice.content}</p>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminNotice;
