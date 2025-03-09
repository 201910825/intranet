import { create } from "zustand";
import { format } from 'date-fns';
import { persist, createJSONStorage } from 'zustand/middleware'

// 일정 타입 정의
export interface Schedule {
  id: string;
  title: string;
  date: Date | string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  description: string;
  image: string;
}

interface ScheduleState {
  selectedDate: string;
  schedules: Schedule[];
  setSelectedDate: (date: string) => void;
  addSchedule: (schedule: Schedule) => void;
  setSchedules: (newSchedules: Schedule[]) => void;
  setDateSchedules: (date: string, newSchedules: Schedule[]) => void;
  updateSchedule: (schedule: Schedule) => void;
  getSchedulesByDate: (date: string) => Schedule[];
}

const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      schedules: [],
      
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      addSchedule: (schedule) => 
        set((state) => {
          const exists = state.schedules.some(s => s.id === schedule.id);
          if (exists) {
            return state;
          }
          return {
            schedules: [...state.schedules, schedule]
          };
        }
      ),
      
      setSchedules: (newSchedules) =>
        set({ schedules: newSchedules }),
      
      setDateSchedules: (date, newSchedules) =>
        set((state) => ({
          schedules: [
            ...state.schedules.filter(schedule => schedule.date !== date),
            ...newSchedules
          ]
        })),
      
      updateSchedule: (updatedSchedule) =>
        set((state) => ({
          schedules: state.schedules.map(schedule => 
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
          )
        })),
      
      getSchedulesByDate: (date) => {
        const state = get();
        return state.schedules.filter(schedule => schedule.date === date);
      }
    }),
    {
      name: 'schedule-storage', // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// 초기 데이터 로드 함수
export const initializeSchedules = (initialSchedules: Schedule[]) => {
  const { setSchedules } = useScheduleStore.getState();
  setSchedules(initialSchedules);
};

export default useScheduleStore; 