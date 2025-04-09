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
      setTokens(res.accessToken, res.refreshToken, 'admin');
      setCookies('authority', 'admin', {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain: import.meta.env.VITE_ADMIN_COOKIE_DOMAIN,
      });
    },
  });
};
