import { create } from 'zustand';
import { classStore } from './type';

export const useClassStore = create<classStore>((set) => ({
  classData: null,
  setClassData: (data) => set({ classData: data }),
  resetClassData: () => set({ classData: null }),
}));
