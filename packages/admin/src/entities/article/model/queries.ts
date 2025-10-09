import { useQuery } from "@tanstack/react-query";
import { getArticleDetail, getArticleList } from "../api";
import type { ArticleDetailResponse, ArticleListResponse } from "../api/type";

/**
 * 기사 목록을 조회하는 React Query 훅입니다.
 * 최신순으로 정렬됩니다.
 * @returns {UseQueryResult<ArticleListResponse[]>} 기사 목록 데이터와 로딩 상태
 */
export const useGetArticleList = () => {
  return useQuery<ArticleListResponse[]>({
    queryKey: [
      "getArticle",
    ],
    queryFn: async () => {
      const data = await getArticleList();
      // 최신순으로 정렬 (내림차순)
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });
};

/**
 * 특정 기사의 상세 정보를 조회하는 React Query 훅입니다.
 * @param {string} id - 조회할 기사의 ID (UUID)
 * @returns {UseQueryResult<ArticleDetailResponse>} 기사 상세 정보 데이터와 로딩 상태
 */
export const useGetArticleDetail = (id?: string) => {
  return useQuery<ArticleDetailResponse>({
    queryKey: [
      "getArticle",
      id,
    ],
    queryFn: () => getArticleDetail(id!),
    enabled: !!id,
  });
};
