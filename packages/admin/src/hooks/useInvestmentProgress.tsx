import { useCallback, useState } from "react";
import { useGetClassDetail, useNextDegree } from "@/apis";
import { queryClient } from "@/utils/queryClient";

export const useInvestmentProgress = (classId: number) => {
  const [optimisticCurInvDeg, setOptimisticCurInvDeg] = useState<number | null>(null);

  const { data: classData, isLoading, isFetching } = useGetClassDetail(classId);

  // 실제 사용할 현재 투자 차수
  const currentInvDeg = optimisticCurInvDeg ?? classData?.curInvDeg ?? 0;

  console.log("📊 useInvestmentProgress:", {
    optimisticCurInvDeg,
    serverCurInvDeg: classData?.curInvDeg,
    currentInvDeg,
    isLoading,
    isFetching
  });

  const { mutate: nextDegree, isPending: isNextDegreePending } = useNextDegree(
    classId,
    () => {
      console.log("✅ nextDegree success callback");
      // 잠깐 기다린 후 서버 데이터 동기화
      queryClient.invalidateQueries({
        queryKey: ["getClass", classId],
      });
      // optimistic state는 서버 데이터가 업데이트된 후에 초기화
      setTimeout(() => {
        console.log("🔄 Resetting optimistic state");
        setOptimisticCurInvDeg(null);
      }, 100);
    }
  );

  const progressToNextDegree = useCallback(() => {
    console.log("🚀 progressToNextDegree called:", {
      currentInvDeg,
      willSetTo: currentInvDeg + 1
    });

    if (!classData) return;

    // Optimistic update
    setOptimisticCurInvDeg(currentInvDeg + 1);

    // API call
    nextDegree();
  }, [classData, currentInvDeg, nextDegree]);

  const canProgressToNext = Boolean(
    classData &&
    currentInvDeg < classData.maxInvDeg
  );

  const isLastDegree = currentInvDeg === classData?.maxInvDeg;

  return {
    classData,
    currentInvDeg,
    isLoading: isLoading || isFetching,
    canProgressToNext,
    isLastDegree,
    isProgressing: isNextDegreePending,
    progressToNextDegree,
  };
};