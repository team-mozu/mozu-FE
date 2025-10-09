import { useCallback, useState } from "react";
import { useTeamStore } from "@/app/store";
import { useGetClassDetail, useNextDegree } from "@/entities/class";
import { queryClient } from "@/shared/lib";

export const useInvestmentProgress = (classId: string) => {
  const [optimisticCurInvDeg, setOptimisticCurInvDeg] = useState<number | null>(null);
  const { clearTeamInfo } = useTeamStore();

  const { data: classData, isLoading, isFetching } = useGetClassDetail(classId);

  // 실제 사용할 현재 투자 차수
  const currentInvDeg = optimisticCurInvDeg ?? classData?.curInvRound ?? 0;

  console.log("📊 useInvestmentProgress:", {
    optimisticCurInvDeg,
    serverCurInvDeg: classData?.curInvRound,
    currentInvDeg,
    isLoading,
    isFetching
  });

  const { mutate: nextDegree, isPending: isNextDegreePending } = useNextDegree(
    classId,
    () => {
      console.log("✅ nextDegree success callback");
      // 캐시 무효화는 useNextDegree 내부에서 이미 처리됨
      // optimistic state 즉시 초기화
      console.log("🔄 Resetting optimistic state");
      setOptimisticCurInvDeg(null);
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
    currentInvDeg < classData.maxInvRound
  );

  const isLastDegree = currentInvDeg === classData?.maxInvRound;

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