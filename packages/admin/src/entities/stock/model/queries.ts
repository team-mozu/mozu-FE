import { useQuery } from "@tanstack/react-query";
import { getItemDetail, getItemList } from "../api";
import type { ItemGetDetailResponse, ItemGetListResponse } from "../api/type";

/**
 * 투자 종목 목록을 조회하는 React Query 훅입니다.
 * 최신 생성순으로 정렬됩니다.
 * @returns {UseQueryResult<ItemGetListResponse[]>} 투자 종목 목록 데이터와 로딩 상태
 */
export const useGetStockList = () => {
  return useQuery<ItemGetListResponse[]>({
    queryKey: [
      "getStock",
    ],
    queryFn: async () => {
      const data = await getItemList();
      // 최신 생성순으로 정렬 (내림차순)
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });
};

/**
 * 특정 투자 종목의 상세 정보를 조회하는 React Query 훅입니다.
 * @param {string} id - 조회할 종목의 ID (UUID)
 * @returns {UseQueryResult<ItemGetDetailResponse>} 투자 종목 상세 정보 데이터와 로딩 상태
 */
export const useGetStockDetail = (id?: number) => {
  return useQuery<ItemGetDetailResponse>({
    queryKey: [
      "getStock",
      id,
    ],
    queryFn: () => getItemDetail(id!),
    enabled: !!id,
  });
};
