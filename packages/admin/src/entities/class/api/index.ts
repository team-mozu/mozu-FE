import { instance } from "@mozu/util-config";
import type {
  LessonCreateRequest,
  LessonCreateResponse,
  LessonEditDetailRequest,
  LessonEditResponse,
  LessonGetArticleListResponse,
  LessonGetDetailResponse,
  LessonGetItemListResponse,
  LessonGetListResponse,
  LessonStartResponse,
} from "./type";

const router = "/lesson";

/**
 * 수업 목록을 조회하는 API 함수입니다.
 * @returns {Promise<LessonGetListResponse>} 수업 목록 데이터
 */
export const getLessonList = async (): Promise<LessonGetListResponse> => {
  const { data } = await instance.get(router);
  return data;
};

/**
 * 새로운 수업을 생성하는 API 함수입니다.
 * @param {LessonCreateRequest} payload - 생성할 수업의 데이터 (제목, 설명, 설정 등)
 * @returns {Promise<LessonCreateResponse>} 생성된 수업 정보
 */
export const createLesson = async (payload: LessonCreateRequest): Promise<LessonCreateResponse> => {
  const { data } = await instance.post(router, payload);
  return data;
};

/**
 * 특정 수업의 상세 정보를 조회하는 API 함수입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {Promise<LessonGetDetailResponse>} 수업 상세 정보 (제목, 설명, 설정, 상태 등)
 */
export const getLessonDetail = async (id: string): Promise<LessonGetDetailResponse> => {
  const { data } = await instance.get(`${router}/${id}`);
  return data;
};

/**
 * 수업을 삭제하는 API 함수입니다.
 * @param {string} id - 삭제할 수업의 ID (UUID)
 * @returns {Promise<void>} 삭제 완료 응답
 */
export const deleteLesson = async (id: string) => {
  return await instance.delete(`${router}/${id}`);
};

/**
 * 기존 수업의 정보를 수정하는 API 함수입니다.
 * @param {string} id - 수정할 수업의 ID (UUID)
 * @param {LessonEditDetailRequest} payload - 수정할 수업 데이터 (제목, 설명, 설정 등)
 * @returns {Promise<LessonEditResponse>} 수정된 수업 정보
 */
export const updateLesson = async (id: string, payload: LessonEditDetailRequest): Promise<LessonEditResponse> => {
  const { data } = await instance.patch(`${router}/${id}`, payload);
  return data;
};

/**
 * 수업을 시작하는 API 함수입니다.
 * @param {string} id - 시작할 수업의 ID (UUID)
 * @returns {Promise<LessonStartResponse>} 수업 시작 응답 (수업 코드 등)
 */
export const startLesson = async (id: string): Promise<LessonStartResponse> => {
  const { data } = await instance.patch(`${router}/start/${id}`);
  return data;
};

/**
 * 수업의 즐겨찾기 상태를 토글하는 API 함수입니다.
 * @param {string} id - 즐겨찾기를 변경할 수업의 ID (UUID)
 * @returns {Promise<void>} 즐겨찾기 변경 완료 응답
 */
export const toggleStar = async (id?: string) => {
  return await instance.patch(`${router}/star/${id}`);
};

/**
 * 수업을 다음 차수로 진행하는 API 함수입니다.
 * @param {string} id - 진행할 수업의 ID (UUID)
 * @returns {Promise<void>} 수업 진행 완료 응답
 */
export const nextDegree = async (id: string) => {
  return await instance.patch(`${router}/next/${id}`);
};

/**
 * 수업을 시작하는 API 함수입니다.
 * @param {string} id - 시작할 수업의 ID (UUID)
 * @returns {Promise<void>} 수업 시작 완료 응답
 */
export const startDegree = async (id: string) => {
  return await instance.patch(`${router}/start-investment/${id}`);
};

/**
 * 진행 중인 수업을 종료하는 API 함수입니다.
 * @param {string} id - 종료할 수업의 ID (UUID)
 * @returns {Promise<void>} 수업 종료 완료 응답
 */
export const endLesson = async (id?: string) => {
  await instance.patch(`${router}/end/${id}`);
};

/**
 * 특정 수업의 종목(투자 아이템) 목록을 조회하는 API 함수입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {Promise<LessonGetItemListResponse>} 수업의 종목 목록 데이터
 */
export const getLessonItemList = async (id: string): Promise<LessonGetItemListResponse> => {
  const { data } = await instance.get(`${router}/items/${id}`);
  return data;
};

/**
 * 특정 수업의 기사 목록을 조회하는 API 함수입니다.
 * @param {string} id - 조회할 수업의 ID (UUID)
 * @returns {Promise<LessonGetArticleListResponse>} 수업의 기사 목록 데이터
 */
export const getLessonArticleList = async (id: string): Promise<LessonGetArticleListResponse> => {
  const { data } = await instance.get(`${router}/articles/${id}`);
  return data;
};
