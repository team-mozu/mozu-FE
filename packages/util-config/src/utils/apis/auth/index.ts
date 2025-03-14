import { instance } from '../axios';
import { IRefreshResponse } from './types';
import { removeCookies, setCookies } from '../../cookies';

const API_PATH = '/organ/token/re-issue';

export const reIssueToken = async (refreshToken: string) => {
  const response = await instance.post<IRefreshResponse>(
    `${API_PATH}`,
    {
      refreshToken: `Bearer ${refreshToken}`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );

  return response.data;
};

export const setTokens = (accessToken: string, refreshToken: string) =>
  setCookies(['accessToken', 'refreshToken'], [accessToken, refreshToken], {
    path: '/',
    secure: true,
    sameSite: 'none',
    domain: import.meta.env.VITE_COOKIE_DOMAIN,
  });

export const removeTokens = () => {
  removeCookies(['accessToken', 'refreshToken'], {
    path: '/',
    secure: true,
    sameSite: 'none',
    domain: import.meta.env.VITE_COOKIE_DOMAIN,
  });
};
