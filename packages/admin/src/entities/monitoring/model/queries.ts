import { useQuery } from "@tanstack/react-query";
import { getCurrent, getHoldItem } from "../api";
import type { TeamCurrentGetResponse, TeamHoldItemGetResponse } from "../api/type";

/**
 * 현재 진행 중인 수업의 모든 팀 정보를 조회하는 React Query 훅입니다.
 * 실시간 모니터링을 위해 캐시를 사용하지 않습니다.
 * @returns {UseQueryResult<TeamCurrentGetResponse[]>} 현재 수업의 팀 목록 데이터와 로딩 상태
 */
export const useGetCurrent = (id?: string) =>
  useQuery<TeamCurrentGetResponse[]>({
    queryKey: [
      "getCurrent",
    ],
    queryFn: () => getCurrent(id!),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });

/**
 * 특정 팀이 보유하고 있는 투자 종목들을 조회하는 React Query 훅입니다.
 * 실시간 모니터링을 위해 캐시를 사용하지 않습니다.
 * @param {string} id - 조회할 팀의 ID (UUID)
 * @returns {UseQueryResult<TeamHoldItemGetResponse[]>} 팀이 보유한 종목 목록 데이터와 로딩 상태
 */
export const useGetHoldStock = (id?: string) =>
  useQuery<TeamHoldItemGetResponse[]>({
    queryKey: [
      "getHoldStock",
      id,
    ],
    queryFn: () => getHoldItem(id!),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
