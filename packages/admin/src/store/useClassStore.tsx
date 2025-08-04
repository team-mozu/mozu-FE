import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ClassArticle, ClassData, ClassStock } from "./type";

type ClassStore = {
  classData: ClassData | null;
  updateStockItems: (items: ClassStock[]) => void;
  updateArticles: (articles: ClassArticle[]) => void;
  setClassData: (data: Partial<ClassData>) => void;
  resetCheckedStates: () => void;
  resetClassData: () => void;
};

export const useClassStore = create<ClassStore>()(
  devtools(
    set => ({
      classData: {
        id: 0,
        name: "",
        maxInvDeg: 0,
        curInvDeg: null,
        baseMoney: 0,
        classNum: null,
        progressYN: false,
        starYN: false,
        createdAt: "",
        deleteYN: false,
        classArticles: [],
        classItems: [],
      },
      inviteCode: null,
      updateStockItems: newItems =>
        new Promise<void>(resolve => {
          set(state => {
            if (!state.classData) return state;

            const filteredItems = newItems.filter(
              newItem => !state.classData!.classItems.some(existing => existing.itemId === newItem.itemId),
            );

            return {
              classData: {
                ...state.classData,
                classItems: [
                  ...state.classData.classItems,
                  ...filteredItems,
                ],
              },
            };
          });
          resolve();
        }),

      updateArticles: articles =>
        set(
          state => ({
            classData: state.classData
              ? {
                  ...state.classData,
                  classArticles: articles,
                }
              : null,
          }),
          false,
          "updateArticles",
        ),
      setClassData: data =>
        set(
          state => ({
            classData: state.classData
              ? {
                  ...state.classData,
                  ...data,
                }
              : (data as ClassData),
          }),
          false,
          "setClassData",
        ),

      resetCheckedStates: () =>
        set(
          state => {
            if (!state.classData) return state;
            return {
              classData: {
                ...state.classData,
                classItems: state.classData.classItems.map(item => ({
                  ...item,
                  stockChecked: false,
                })),
                classArticles: state.classData.classArticles.map(article => ({
                  ...article,
                  articleGroupChecked: false,
                })),
              },
            };
          },
          false,
          "resetCheckedStates",
        ),
      resetClassData: () =>
        set(
          {
            classData: null,
          },
          false,
          "resetClassData",
        ),
    }),
    {
      name: "class-store",
    },
  ),
);
