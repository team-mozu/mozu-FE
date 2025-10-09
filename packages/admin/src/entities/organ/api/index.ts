import { instance } from "@mozu/util-config";
import type { OrganLoginRequest, OrganLoginResponse } from "./type";

const router = "/organ";

/**
 * 기관(관리자) 로그인을 처리하는 API 함수입니다.
 * @param {OrganLoginRequest} payload - 로그인 요청 데이터 (사용자명, 비밀번호 등)
 * @returns {Promise<OrganLoginResponse>} 로그인 응답 데이터 (토큰, 사용자 정보 등)
 */
export const login = async (payload: OrganLoginRequest): Promise<OrganLoginResponse> => {
  const { data } = await instance.post(`${router}/login`, payload);
  return data;
};

export const myId = async (): Promise<{
  organId: string;
}> => {
  const { data } = await instance.get(`${router}/my`);
  return data;
};
