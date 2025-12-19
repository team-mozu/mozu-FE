import type { LessonGetListResponse } from "@/entities/class/api/type";

export const sortLessonByDate = (lessons: LessonGetListResponse) => {
  return [
    ...lessons.lessons,
  ].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
