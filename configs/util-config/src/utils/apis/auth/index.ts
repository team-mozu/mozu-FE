import { instance } from '../axios';
import { IRefreshResponse } from './types';
import { COOKIE_DOMAIN } from '@/constant';
import { removeCookies, setCookies } from '@/utils/cookies';

const API_PATH = '/user';

export const reIssueToken = async (refreshToken: string) => {
  try {
    const { data } = await instance.put<IRefreshResponse>(
      `${API_PATH}/auth`,
      null,
      {
        headers: { 'X-Refresh-Token': refreshToken },
      },
    );

    return data;
  } catch (error) {
    console.error('토큰 재발급 실패', error);
    throw error;
  }
};

export const setTokens = (accessToken: string, refreshToken: string) =>
  setCookies(['accessToken', 'refreshToken'], [accessToken, refreshToken], {
    path: '/',
    secure: true,
    sameSite: 'none',
    domain: COOKIE_DOMAIN,
  });

export const removeTokens = () => {
  removeCookies(['accessToken', 'refreshToken'], {
    path: '/',
    secure: true,
    sameSite: 'none',
    domain: COOKIE_DOMAIN,
  });
};
