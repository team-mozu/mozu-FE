import { Toast } from "@mozu/ui";
import { instance, setAuthTokens, setCookies } from "@mozu/util-config";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import type { AuthResponse, StudentLoginProps } from "./type";

export const useStudentLogin = () => {
  const navigate = useNavigate();
  return useMutation<AuthResponse, AxiosError, StudentLoginProps>({
    mutationFn: async ({ classNum, schoolName, teamName }) => {
      const response = await instance.post<AuthResponse>("/team/participate", {
        classNum,
        schoolName,
        teamName,
      });
      return response.data;
    },
    onSuccess: async res => {
      const accessToken = res.accessToken;

      if (!accessToken) {
        console.error("토큰이 없습니다!", res);
        Toast("로그인 응답에 문제가 있습니다.", {
          type: "error",
        });
        return;
      }
      let redirectUrl: string;
      redirectUrl = "wait";
      setAuthTokens(accessToken, "", "student");
      setCookies("authority", "student", {
        path: "/",
        secure: true,
        sameSite: "none",
        domain: import.meta.env.VITE_STUDENT_COOKIE_DOMAIN,
      });

      navigate(redirectUrl);
    },
    onError: (res: AxiosError<unknown>) => {
      if (res.response) {
        switch (res.response?.status) {
          case 401:
            Toast("참가 코드 혹은 학교를 다시 확인해주세요.", {
              type: "error",
            });
            break;
          default:
            Toast("로그인에 실패하였습니다.", {
              type: "error",
            });
            break;
        }
      } else {
        console.log(res);
      }
    },
  });
};
