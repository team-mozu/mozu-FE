import { instance, setTokens, setCookies } from '@configs/util';
import { useMutation } from '@tanstack/react-query';
import { checkLocalPort } from '@/utils';
import { AuthResponse } from './type';
import { AxiosError } from 'axios';
import { Toast } from '@mozu/ui';

interface AdminLoginProps {
  code: string;
  password: string;
}

export const useAdminLogin = () => {
  return useMutation<AuthResponse, AxiosError, AdminLoginProps>({
    mutationFn: async ({ code, password }) => {
      const response = await instance.post<AuthResponse>('/organ/login', {
        code,
        password,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      let redirectUrl: string;
      if (import.meta.env.VITE_ADMIN_COOKIE_DOMAIN === 'localhost') {
        const isLocalPortOpen = checkLocalPort(3002);
        console.log('Redirecting to:', redirectUrl);
        redirectUrl = import.meta.env.VITE_ADMIN_AUTH_URL;
      } else {
        redirectUrl = import.meta.env.VITE_ADMIN_AUTH_URL;
        console.log('Redirecting to:', redirectUrl);
      }
      console.log('Redirecting to:', redirectUrl);
      setTokens(res.accessToken, res.refreshToken, 'admin');
      setCookies('authority', 'admin', {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain: import.meta.env.VITE_ADMIN_COOKIE_DOMAIN,
      });
      window.location.href = redirectUrl;
    },
    onError: (res: AxiosError<AxiosError>) => {
      if (res.response) {
        switch (res.response?.status) {
          case 401:
            Toast('기관 코드 혹은 비밀번호를 다시 확인해주세요.', {
              type: 'error',
            });
            break;
          default:
            Toast('로그인에 실패하였습니다.', { type: 'error' });
            break;
        }
      } else {
        Toast('네트워크 연결을 확인해주세요.', {
          type: 'error',
        });
      }
    },
  });
};
