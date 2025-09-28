import { instance } from "@mozu/util-config";
import type {
  ArticleAddRequest,
  ArticleAddResponse,
  ArticleDetailResponse,
  ArticleEditRequest,
  ArticleEditResponse,
  ArticleListResponse,
} from "./type";

const router = "/article";

/**
 * 전체 기사 목록을 조회하는 API 함수입니다.
 * @returns {Promise<ArticleListResponse>} 기사 목록 데이터
 */
export const getArticleList = async (): Promise<ArticleListResponse[]> => {
  const { data } = await instance.get(router);
  return data;
};

/**
 * 새로운 기사를 생성하는 API 함수입니다.
 * @param {ArticleAddRequest} payload - 생성할 기사의 데이터 (제목, 내용, 링크 등)
 * @returns {Promise<ArticleAddResponse>} 생성된 기사 정보
 */
export const createArticle = async (payload: ArticleAddRequest): Promise<ArticleAddResponse> => {
  const { data } = await instance.post(router, payload);
  return data;
};

/**
 * 특정 기사의 상세 정보를 조회하는 API 함수입니다.
 * @param {string} id - 조회할 기사의 ID (UUID)
 * @returns {Promise<ArticleDetailResponse>} 기사 상세 정보 (제목, 내용, 링크, 작성일 등)
 */
export const getArticleDetail = async (id: string): Promise<ArticleDetailResponse> => {
  const { data } = await instance.get(`${router}/${id}`);
  return data;
};

/**
 * 기사를 삭제하는 API 함수입니다.
 * @param {string} id - 삭제할 기사의 ID (UUID)
 * @returns {Promise<void>} 삭제 완료 응답
 */
export const deleteArticle = async (id: string) => {
  return await instance.delete(`${router}/${id}`);
};

/**
 * 기존 기사의 정보를 수정하는 API 함수입니다.
 * @param {string} id - 수정할 기사의 ID (UUID)
 * @param {ArticleEditRequest} payload - 수정할 기사 데이터 (제목, 내용, 링크 등)
 * @returns {Promise<ArticleEditResponse>} 수정된 기사 정보
 */
export const updateArticle = async (id: string, payload: ArticleEditRequest): Promise<ArticleEditResponse> => {
  const { data } = await instance.patch(`${router}/${id}`, payload);
  return data;
};
