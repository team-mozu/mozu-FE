import { Toast } from '@mozu/ui';
import axios, { AxiosError } from 'axios';
import { getCookies, setCookies, removeCookies } from '../cookies';
import { reIssueToken, removeTokens, setTokens } from './auth';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10_000,
});
console.log(import.meta.env.VITE_SERVER_URL);

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
  async (res) => {
    console.log('Response Data:', res.data); // ✅ 응답 데이터 로그 출력

    setCookies('accessToken', res.data?.accessToken);
    setCookies('refreshToken', res.data?.refreshToken);

    console.log(`Access Token: ${res.data?.accessToken}`);
    console.log(`Refresh Token: ${res.data?.refreshToken}`);
    console.log(typeof res.data?.refreshToken);

    return res;
  },
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
              console.log('New Token Response:', res); // ✅ 재발급된 토큰 로그 출력
              setTokens(res.accessToken, res.refreshToken);

              console.log(`Access Token: ${res.accessToken}`);
              console.log(`Refresh Token: ${res.refreshToken}`);

              setCookies(
                'authority',
                authority === 'admin' ? 'admin' : 'student',
              );

              if (originalRequest?.headers) {
                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
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
                authority === 'admin'
                  ? import.meta.env.VITE_ADMIN_AUTH_URL
                  : import.meta.env.VITE_STUDENT_AUTH_URL;
              if (!redirectUrl) {
                console.error('Redirect URL is undefined!');
              } else {
                console.log(`Redirecting to: ${redirectUrl}`); // ✅ 리다이렉트 로그
                window.location.href = redirectUrl;
              }
            });
        } else {
          removeTokens();
          const redirectUrl =
            authority === 'admin'
              ? import.meta.env.VITE_ADMIN_AUTH_URL
              : import.meta.env.VITE_STUDENT_AUTH_URL;
          if (!redirectUrl) {
            console.error('Redirect URL is undefined!');
          } else {
            console.log(`Redirecting to: ${redirectUrl}`); // ✅ 리다이렉트 로그
            window.location.href = redirectUrl;
          }
        }
      } else return Promise.reject(error);
    }
  },
);
