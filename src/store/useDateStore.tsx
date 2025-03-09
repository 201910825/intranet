import { create } from "zustand";

// 날짜 타입 정의
interface DateState {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}
//리스트 객체 정의
interface TimeBlock {
    id: number;
    startTime: string | null;
    endTime: string | null;
}
//서버에 보낼 객체 리스트 
interface PostDate {
    title : string;
    postDate: TimeBlock[];
    setPostDate : (date: TimeBlock[],title : string)=>void;
}

//달력에서 날짜 선택
const useDateStore = create<DateState>((set) => ({
    selectedDate: '',
    setSelectedDate: (date) => set({ selectedDate: date }),
}));
//날짜 별 일정 리스트(시각)
const usePostStore = create<PostDate>((set) => ({
    title: '',
    postDate: [],
    setPostDate: (date, title) => set((state) => ({
        ...state,
        postDate: {
            ...state.postDate,
            [title]: date,
        },
    })),
}));

export {useDateStore,usePostStore};