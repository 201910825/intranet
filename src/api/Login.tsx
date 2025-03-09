import axios from 'axios'
import * as z from "zod"
import { toast } from "@/hooks/use-toast"
import { formSchema } from '@/_component/Auth/schema';
const baseUrl = import.meta.env.VITE_BACK_SERVER;
export async function signUp(values: z.infer<typeof formSchema>) {

    try {
      const response = await axios({
          method: 'POST',
          url: `${baseUrl}/api/v1/members`,
          headers: {
              'Content-Type': 'application/json',
              'accept': '*/*'
          },
          data: values,
          withCredentials: true  // CORS 요청시 쿠키 전송을 위해 추가
      });

      toast({
        title: "회원가입 성공!",
        description: "환영합니다.",
      })
      return response.data
    } catch (error: any) {
      console.error('회원가입 에러:', error.response?.data || error.message);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.response?.data?.message || "다시 시도해주세요.",
      })
      throw error
    }
}
export async function signIn(values) {
  try {
    const response = await axios({
        method: 'POST',
        url: `${baseUrl}/api/v1/login`,
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
        },
        data: values,
        withCredentials: true  // CORS 요청시 쿠키 전송을 위해 추가
    });
    localStorage.setItem('accessToken', response.data.result.accessToken)
    toast({
      title: "로그인 성공!",
      description: "환영합니다.",
    })
    return response.data
  } catch (error: any) {
    console.error('로그인 에러:', error.response?.data || error.message);
    toast({
      variant: "destructive",
      title: "오류가 발생했습니다",
      description: error.response?.data?.message || "다시 시도해주세요.",
    })
    throw error
  }
}

