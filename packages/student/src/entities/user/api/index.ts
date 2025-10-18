import { Toast } from "@mozu/ui";
import { instance, setAuthTokens, setCookies } from "@mozu/util-config";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import type { AuthResponse, StudentLoginProps, TeamDeatilResponse, TeamEndProps, TeamResultResponse } from "./type";

const router = "/team";

export const useStudentLogin = () => {
  const navigate = useNavigate();
  return useMutation<AuthResponse, AxiosError, StudentLoginProps>({
    mutationFn: async ({ lessonNum, schoolName, teamName }) => {
      const response = await instance.post<AuthResponse>("/team/participate", {
        lessonNum,
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

export const useGetTeamDetail = (options?: UseQueryOptions<TeamDeatilResponse, AxiosError>) => {
  return useQuery<TeamDeatilResponse, AxiosError>({
    queryKey: [
      "team",
      "detail",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamDeatilResponse>(`${router}/detail`);
      return data;
    },
    staleTime: 1000,
    ...options,
  });
};

export const useTeamEnd = (options?: UseMutationOptions<void, AxiosError, TeamEndProps>) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, TeamEndProps>({
    mutationFn: async teamData => {
      const response = await instance.post("/team/end", teamData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "team",
        ],
      });
    },
    ...options,
  });
};

export const useTeamResult = (options?: UseQueryOptions<TeamResultResponse, AxiosError>) => {
  return useQuery<TeamResultResponse, AxiosError>({
    queryKey: [
      "team",
      "result",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamResultResponse>(`${router}/result`);
      return data;
    },
    ...options,
  });
};
