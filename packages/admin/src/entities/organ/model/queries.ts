import { useQuery } from "@tanstack/react-query";
import { myId } from "../api";

/**
 * 기관의 ID를 조회하는 React Query 훅입니다.
 * @returns {UseQueryResult<organId: string>} 수업 목록 데이터와 로딩 상태
 */
export const useGetOrganId = () =>
  useQuery<{
    organId: string;
  }>({
    queryKey: [
      "getOrganId",
    ],
    queryFn: myId,
  });
