import { instance } from "@mozu/util-config";
import type {
  ItemCreateRequest,
  ItemCreateResponse,
  ItemEditRequest,
  ItemEditResponse,
  ItemGetDetailResponse,
  ItemGetListResponse,
} from "./type";

const router = "/item";

/**
 * 투자 종목 목록을 조회하는 API 함수입니다.
 * @returns {Promise<ItemGetListResponse[]>} 투자 종목 목록 데이터
 */
export const getItemList = async (): Promise<ItemGetListResponse[]> => {
  const { data } = await instance.get(router);
  return data;
};

/**
 * 새로운 투자 종목을 생성하는 API 함수입니다.
 * @param {ItemCreateRequest} payload - 생성할 종목의 데이터 (종목명, 가격, 설명 등)
 * @returns {Promise<ItemCreateResponse>} 생성된 투자 종목 정보
 */
export const createItem = async (payload: ItemCreateRequest): Promise<ItemCreateResponse> => {
  const { data } = await instance.post(router, payload);
  return data;
};

/**
 * 특정 투자 종목의 상세 정보를 조회하는 API 함수입니다.
 * @param {string} id - 조회할 종목의 ID (UUID)
 * @returns {Promise<ItemGetDetialResponse>} 투자 종목 상세 정보 (종목명, 가격, 설명, 등락률 등)
 */
export const getItemDetail = async (id: number): Promise<ItemGetDetailResponse> => {
  const { data } = await instance.get(`${router}/${id}`);
  return data;
};

/**
 * 투자 종목을 삭제하는 API 함수입니다.
 * @param {string} id - 삭제할 종목의 ID (UUID)
 * @returns {Promise<void>} 삭제 완료 응답
 */
export const deleteItem = async (id?: number) => {
  return await instance.delete(`${router}/${id}`);
};

/**
 * 기존 투자 종목의 정보를 수정하는 API 함수입니다.
 * @param {string} id - 수정할 종목의 ID (UUID)
 * @param {ItemEditRequest} payload - 수정할 종목 데이터 (종목명, 가격, 설명 등)
 * @returns {Promise<ItemEditResponse>} 수정된 투자 종목 정보
 */
export const updateItem = async (id: string, payload: ItemEditRequest): Promise<ItemEditResponse> => {
  const { data } = await instance.patch(`${router}/${id}`, payload);
  return data;
};
