import { Toast } from '@mozu/ui';
import axios, { AxiosError } from 'axios';
import { SERVER_URL, ADMIN_AUTH_URL, STUDENT_AUTH_URL } from '@/constant';
import { getCookies, setCookies, removeCookies } from '@/utils';
import { reIssueToken, removeTokens, setTokens } from './auth';

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10_000,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookies<string>('accessToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
  async (response) => response,
  async (error: AxiosError<AxiosError>) => {
    if (axios.isAxiosError(error) && error.response) {
      const { config } = error;
      const refreshToken = getCookies('refreshToken');
      const authority = getCookies('authority');

      if (
        error.response.data?.status === 401 ||
        error.response.data?.status === 403
      ) {
        const originalRequest = config;

        if (refreshToken) {
          reIssueToken(refreshToken as string)
            .then((res) => {
              setTokens(res.accessToken, res.refreshToken);
              setCookies(
                'authority',
                authority === 'admin' ? 'admin' : 'student',
              );

              if (originalRequest?.headers) {
                originalRequest.headers['Authorization'] =
                  `Bearer ${res.accessToken}`;
              }

              return axios(originalRequest);
            })
            .catch((res: AxiosError<AxiosError>) => {
              if (+res?.response?.data.code >= 500) {
                return Toast('서버 에러 잠시 뒤 시도해 주세요', {
                  type: 'error',
                });
              }

              removeTokens();
              removeCookies('authority');

              const redirectUrl =
                authority === 'admin' ? ADMIN_AUTH_URL : STUDENT_AUTH_URL;
              window.location.href = redirectUrl;
            });
        } else {
          removeTokens();
          const redirectUrl =
            authority === 'admin' ? ADMIN_AUTH_URL : STUDENT_AUTH_URL;
          window.location.href = redirectUrl;
        }
      } else return Promise.reject(error);
    }
  },
);
