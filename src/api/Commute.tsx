import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const token = localStorage.getItem('accessToken');
const baseUrl = import.meta.env.VITE_BACK_SERVER;

export const useCommute = (date: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['commuteData'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/attendance/${date}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.result;
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        staleTime: 30000,
        gcTime: 30000,
    });
    return { data, isLoading, error, refetch };
}