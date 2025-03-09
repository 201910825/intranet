import { toast } from '@/hooks/use-toast';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
const token = localStorage.getItem('accessToken');
const baseUrl = import.meta.env.VITE_BACK_SERVER;
const useMemberData = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['memberData'],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/all/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.result;
        },
        staleTime: 30000,
    });

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    return { 
        data: data, 
        isLoading, 
        error, 
        refetch, 
        nextPage, 
        prevPage, 
        page, 
        totalPages: data?.totalPages 
    };
}
const useUserData = (memberId: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['memberData', memberId],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            return response.data.result;
        },
        staleTime: 30000,
    });
    return { data, isLoading, error, refetch };
}
const useAcceptData = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (userId:string) => {
            const response = await axios.patch(`${baseUrl}/api/v1/accept`, 
                { userId: userId },  // request body
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }  // request config
            );
            return response.data.result;
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['memberData'] });
            toast({
                title: '승인 완료',
                description: '승인 완료',
                variant: 'default',
            });
        },
        onError: () => {
            toast({
                title: '승인 실패',
                description: '승인 실패',
                variant: 'destructive',
            });
        },
    });

    return mutation;
}

const useParticipantData = () => {
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['memberData', page, size],
        queryFn: async () => {
            const response = await axios.get(`${baseUrl}/api/v1/members/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.result;
        },
        staleTime: 30000,
    });

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    return { 
        data: data, 
        isLoading, 
        error, 
        refetch, 
        nextPage, 
        prevPage, 
        page, 
        totalPages: data?.totalPages 
    };
}
export { useMemberData, useAcceptData, useParticipantData, useUserData };