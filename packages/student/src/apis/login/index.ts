import { instance, setCookies, setTokens } from '@configs/util';
import { checkLocalPort } from '../../../../admin/src/utils';
import { useMutation } from '@tanstack/react-query';
import { AuthResponse } from './type';
import { AxiosError } from 'axios';
import { Toast } from '@mozu/ui';
import { useNavigate } from 'react-router-dom';

interface StudentLoginProps {
  classNum: number | null;
  schoolName: string;
  teamName: string;
}

export const useStudentLogin = () => {
  const navigate = useNavigate();
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
      console.log(`res => ${res.accessToken}`);
      const accessToken = res.accessToken; // 여기가 정확한지 확인

      if (!accessToken) {
        console.error('토큰이 없습니다!', res);
        Toast('로그인 응답에 문제가 있습니다.', { type: 'error' });
        return;
      }
      let redirectUrl: string;
      redirectUrl = 'wait';
      setTokens(accessToken, '', 'student');
      setCookies('authority', 'student', {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain: import.meta.env.VITE_STUDENT_COOKIE_DOMAIN,
      });

      // setCookies('accessToken', res.accessToken, {
      //   path: '/',
      //   secure: true,
      //   sameSite: 'none',
      //   domain: import.meta.env.VITE_STUDENT_COOKIE_DOMAIN,
      //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      // });
      redirectUrl;
    },
    onError: (res: AxiosError<unknown>) => {
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
        console.log(res);
      }
    },
  });
};
