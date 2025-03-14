import { checkLocalPort } from '../../../../admin/src/utils';
import { AuthResponse } from './type';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { instance, setCookies, setTokens } from '@configs/util';
import { Toast } from '@mozu/ui';

interface StudentLoginProps {
  classNum: number;
  schoolName: string;
  teamName: string;
}

export const useStudentLogin = () => {
  return useMutation<AuthResponse, AxiosError, StudentLoginProps>({
    mutationFn: async ({ classNum, schoolName, teamName }) => {
      const response = await instance.post<AuthResponse>('/team/participate', {
        classNum,
        schoolName,
        teamName,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      let redirectUrl: string;
      if (import.meta.env.VITE_COOKIE_DOMAIN === 'localhost') {
        const isLocalPortOpen = checkLocalPort(3001);
        console.log('Redirecting to:', redirectUrl);
        redirectUrl = isLocalPortOpen
          ? import.meta.env.VITE_STUDENT_AUTH_URL
          : import.meta.env.VITE_ADMIN_AUTH_URL;
      } else {
        redirectUrl = import.meta.env.VITE_STUDENT_AUTH_URL;
        console.log('Redirecting to:', redirectUrl);
      }
      console.log('Redirecting to:', redirectUrl);
      setTokens(res.accessToken, res.accessToken);
      setCookies('authority', 'student', {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain: import.meta.env.VITE_COOKIE_DOMAIN,
      });
      window.location.href = redirectUrl;
    },
    onError: (res: AxiosError<AxiosError>) => {
      if (res.response) {
        switch (res.response?.status) {
          case 401:
            Toast('참가 코드 혹은 학교를 다시 확인해주세요.', {
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
