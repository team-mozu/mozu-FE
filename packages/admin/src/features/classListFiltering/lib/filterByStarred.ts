import type { LessonGetListResponse } from "@/entities/class/api/type";

export const filterByStarred = (lessons: LessonGetListResponse["lessons"], isStarred: boolean) => {
  return lessons.filter(item => item.isStarred === isStarred);
};
