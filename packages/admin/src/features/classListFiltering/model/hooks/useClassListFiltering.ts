import { useMemo } from "react";
import type { LessonGetListResponse } from "@/entities/class/api/type";
import { filterByStarred } from "../../lib/filterByStarred";
import { sortLessonByDate } from "../../lib/sortLessonsByDate";

export const useClassListFiltering = (data?: LessonGetListResponse) => {
  const classData: LessonGetListResponse = data ?? {
    lessons: [],
  };

  const sortedLessons = useMemo(
    () => sortLessonByDate(classData),
    [
      classData,
    ],
  );

  const favorites = useMemo(
    () => filterByStarred(sortedLessons, true),
    [
      sortedLessons,
    ],
  );

  const common = useMemo(
    () => filterByStarred(sortedLessons, false),
    [
      sortedLessons,
    ],
  );

  return {
    sortedLessons,
    favorites,
    common,
  };
};
