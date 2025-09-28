import { setAuthTokens, setCookies } from "@mozu/util-config";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import type { OrganLoginRequest, OrganLoginResponse } from "../api/type";

/**
 * 관리자 로그인을 처리하는 React Query Mutation 훅입니다.
 * 성공 시 토큰을 저장하고 권한 쿠키를 설정합니다.
 * @param {OrganLoginRequest} data - 로그인 요청 데이터 (사용자명, 비밀번호 등)
 * @returns {UseMutationResult} 관리자 로그인 mutation 객체
 */
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (data: OrganLoginRequest) => login(data),
    onSuccess: (res: OrganLoginResponse) => {
      setAuthTokens(res.accessToken, res.refreshToken, "admin");
      setCookies("authority", "admin", {
        path: "/",
        secure: true,
        sameSite: "none",
        domain: import.meta.env.VITE_ADMIN_COOKIE_DOMAIN,
      });
    },
  });
};
