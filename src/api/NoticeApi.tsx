import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
const baseUrl = import.meta.env.VITE_BACK_SERVER;
const token = localStorage.getItem('accessToken');
const useCreateNotice = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ title, content, images }: { title: string, content: string, images: File[] }) => {
            // 1. 먼저 일정 데이터를 JSON으로 전송
            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify({
                title,
                content,
            })],{type: 'application/json'}));
            for(let i = 0; i < images.length; i++) {
                formData.append('images' , images[i]);
            }

            try {
                const response = await axios.post(`${baseUrl}/api/v1/create/notice`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                return response.data.result;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['notice'] });
            toast({
                title: '공지사항 생성 완료',
                description: '공지사항 생성 완료',
                variant: 'default',
            });
        },
        onError: (error) => {
            console.log(error)
            toast({
                title: '공지사항 생성 실패',
                description: '공지사항 생성 실패',   
                variant: 'destructive',
            });
        },
    });

    return mutation;
}

const useGetNoticeById = (noticeId: string) => useQuery({ 
    queryKey: ['notice', noticeId],
    queryFn: async () => {
        const response = await axios.get(`${baseUrl}/api/v1/${noticeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
});
const useDeleteNotice = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (noticeId: string) => {
            const response = await axios.delete(`${baseUrl}/api/v1/notice/delete/${noticeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.result;
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['notice'] });
        },
        onError: () => {
            toast({
                title: '공지사항 삭제 실패',
                description: '공지사항 삭제 실패',
                variant: 'destructive',
            });
        }
    });
    return mutation;
}


const useGetNotices = (page = 0) => {
    const query = useQuery({
        queryKey: ['notice', page],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/notices`, {
                params: {
                    page,
                    size: 10,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.result;
        }
    });
    return query;
}
export { useCreateNotice, useGetNoticeById, useDeleteNotice, useGetNotices };
