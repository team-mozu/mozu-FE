import { instance } from "@mozu/util-config";
import type { TeamCurrentGetResponse, TeamHoldItemGetResponse } from "./type";

const router = "/team";

/**
 * 현재 진행 중인 수업의 모든 팀 정보를 조회하는 API 함수입니다.
 * @param {string} id - 조회할 팀의 ID (UUID)
 * @returns {Promise<TeamCurrentGetResponse[]>} 현재 수업의 팀 목록 데이터
 */
export const getCurrent = async (id: string): Promise<TeamCurrentGetResponse[]> => {
  const { data } = await instance.get(`${router}/${id}`);
  return data;
};

/**
 * 특정 팀이 보유하고 있는 투자 종목들을 조회하는 API 함수입니다.
 * @param {string} id - 조회할 팀의 ID (UUID)
 * @returns {Promise<TeamHoldItemGetResponse[]>} 팀이 보유한 종목 목록 데이터 (종목명, 수량, 가치 등)
 */
export const getHoldItem = async (id: string): Promise<TeamHoldItemGetResponse[]> => {
  const { data } = await instance.get(`${router}/${id}/holditem`);
  return data;
};
