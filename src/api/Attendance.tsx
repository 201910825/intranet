import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useQueryClient } from "@tanstack/react-query";
const token = localStorage.getItem('accessToken');
const baseUrl = import.meta.env.VITE_BACK_SERVER;
export const useOffCheck = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (offDay: string) => {
                const response = await axios.post(`${baseUrl}/api/v1/off`, {offDay}, {
                headers: { Authorization: `Bearer ${token}` }   
            });
            return response.data.result;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['commuteData'] });
            toast({
                title: '퇴근 완료',
                description: '퇴근 완료',
                variant: 'default',
            });
        },
        onError: () => {
            toast({
                title: '등록 실패',
                description: '등록 실패',
                variant: 'destructive',
            });
        },
        });
    
        return mutation;
    }

    export const useAttendanceCheck = () => {
        const queryClient = useQueryClient();
        const mutation = useMutation({
            mutationFn: async ({ attendanceDay, attendanceType }: { attendanceDay: string, attendanceType: string }) => {
                    const response = await axios.post(`${baseUrl}/api/v1/attendance`, { attendanceDay, attendanceType }, {
                    headers: { Authorization: `Bearer ${token}` }   
                });
                return response.data.result;
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ['commuteData'] });
                toast({
                    title: '출근 완료',
                    description: '출근 완료',
                    variant: 'default',
                });
            },
            onError: () => {
                toast({
                    title: '등록 실패',
                    description: '등록 실패',
                    variant: 'destructive',
                });
            },
            });
        
        return mutation;
    }