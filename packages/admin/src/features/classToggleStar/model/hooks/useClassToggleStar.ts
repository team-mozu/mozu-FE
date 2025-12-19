import { useCallback, useState } from "react";
import { useStarClass } from "@/entities/class";

export const useClassToggleStar = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: starClass } = useStarClass();

  const toggleFavorite = useCallback(
    async (classId: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await starClass(classId);
        onSuccess?.();
      } catch (error) {
        console.error("즐겨찾기 변경 실패", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      starClass,
      onSuccess,
    ],
  );

  return {
    toggleFavorite,
    isLoading,
  };
};
