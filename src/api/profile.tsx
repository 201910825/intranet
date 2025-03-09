import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const token = localStorage.getItem('accessToken');
const baseUrl = import.meta.env.VITE_BACK_SERVER;
export const useProfile = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['profileData'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/my`, {    
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.result;
            } catch (error) {
                console.log(error)
                return [];
            }
        },
        staleTime: 30000,
    });
    return { data, isLoading, error, refetch };
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { username: string; email: string; phone: string }) => {
            const response = await axios.patch(`${baseUrl}/api/v1/members`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profileData'] });
        }
    });
};

export const useUpdateProfileImage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (file: File | null) => {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }
            
            const response = await axios.post(`${baseUrl}/api/v1/update/image`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profileData'] });
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const response = await axios.delete(`${baseUrl}/api/v1/del/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberData'] });
        }
    });
};