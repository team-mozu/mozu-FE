import { useQuery } from "@tanstack/react-query";
import { getLessonArticleList, getLessonDetail, getLessonItemList, getLessonList } from "../api";
import type {
  LessonGetArticleListResponse,
  LessonGetDetailResponse,
  LessonGetItemListResponse,
  LessonGetListResponse,
} from "../api/type";

/**
 * 수업 목록을 조회하는 React Query 훅입니다.
 * @returns {UseQueryResult<LessonGetListResponse[]>} 수업 목록 데이터와 로딩 상태
 */
export const useGetClassList = () =>
  useQuery<LessonGetListResponse>({
    queryKey: [
      "getClass",
    ],
    queryFn: getLessonList,
  });

/**
 * 특정 수업의 상세 정보를 조회하는 React Query 훅입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {UseQueryResult<LessonGetDetailResponse>} 수업 상세 정보 데이터와 로딩 상태
 */
export const useGetClassDetail = (id?: string) =>
  useQuery<LessonGetDetailResponse>({
    queryKey: [
      "getClass",
      id,
    ],
    queryFn: () => getLessonDetail(id!),
    enabled: !!id,
  });

/**
 * 특정 수업의 투자 종목 목록을 조회하는 React Query 훅입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {UseQueryResult<LessonGetItemListResponse>} 수업의 투자 종목 목록 데이터와 로딩 상태
 */
export const useGetClassItems = (id: string) =>
  useQuery<LessonGetItemListResponse>({
    queryKey: [
      "getClassItems",
      id,
    ],
    queryFn: () => getLessonItemList(id),
  });

/**
 * 특정 수업의 기사 목록을 조회하는 React Query 훅입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {UseQueryResult<LessonGetArticleListResponse>} 수업의 기사 목록 데이터와 로딩 상태
 */
export const useGetClassArticles = (id: string) =>
  useQuery<LessonGetArticleListResponse>({
    queryKey: [
      "getClassArticles",
      id,
    ],
    queryFn: () => getLessonArticleList(id),
  });
