import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BACK_SERVER;
const token = localStorage.getItem('accessToken');
const useAddSchedule = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ title, description, startTime, endTime, workDate, participantIds, file }: { title: string, description: string, startTime: string, endTime: string, workDate: string, participantIds: string[], file: File[] }) => {
            // 1. 먼저 일정 데이터를 JSON으로 전송
            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify({
                title,
                description,
                startTime,
                endTime,
                workDate,
                participantIds
            })],{type: 'application/json'}));
            for(let i = 0; i < file.length; i++) {
                formData.append('file', file[i]);
            }

            try {
                const response = await axios.post(`${baseUrl}/api/v1/create/event`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                return response.data.result;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['memberData','dateSchedule'] });
            toast({
                title: '생성 완료',
                description: '생성 완료',
                variant: 'default',
            });
        },
        onError: (error) => {
            console.log(error)
            toast({
                title: '생성 실패',
                description: '생성 실패',   
                variant: 'destructive',
            });
        },
    });

    return mutation;
}

const useDateSchedule = (date: string) => {
    return useQuery({
        queryKey: ['dateSchedule', date],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/events/by-date?date=${date}`, {
                headers: { Authorization: `Bearer ${token}`, accept: '*/*' },
                withCredentials: true
            });
            return response.data.result;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

const useModifySchedule = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({eventId, data}: {eventId: string, data: any}) => {
            const formData = new FormData();
            formData.append("updateEventDTO", new Blob([JSON.stringify({
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                workDate: data.workDate,
                participantIds: data.participantIds
            })], {type: 'application/json'}));
            
            if (data.file) {
                for(let i = 0; i < data.file.length; i++) {
                    formData.append('newImages', data.file[i]);
                }
            }

            const response = await axios.put(`${baseUrl}/api/v1/update/${eventId}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.result;
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['dateSchedule'] });
            toast({
                title: '수정 완료', 
                description: '수정 완료',
                variant: 'default',
            });
        },
        onError: () => {
            toast({
                title: '수정 실패',
                description: '수정 실패',
                variant: 'destructive',
            });
        },
    });
    return mutation;
}

const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (eventId: string) => {
            const response = await axios.delete(`${baseUrl}/api/v1/event/delete/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.result;
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['dateSchedule'] });
        },
        onError: () => {
            toast({
                title: '삭제 실패',
                description: '권한 없음',
                variant: 'destructive',
            });
        }
    });
    return mutation;
}

const useMySchedule = () => {
    const query = useQuery({
        queryKey: ['mySchedule'],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/my-event`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });
    return query;
}

const useEventCount = (year: number, month: number) => {
    return useQuery({
        queryKey: ['eventCount', year, month],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/events/monthly-count`, {
                params: { year, month },
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });
}

export { useAddSchedule, useDateSchedule, useDeleteSchedule, useModifySchedule, useMySchedule, useEventCount };
