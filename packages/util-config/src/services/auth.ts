import type { CookieSetOptions } from "universal-cookie";
import { ADMIN_COOKIE_DOMAIN, COOKIE_DOMAIN, STUDENT_COOKIE_DOMAIN } from "../env";
import { getCookies, removeCookies, setCookies } from "../utils/cookies";
import { instance } from "./apiClient";

const REFRESH_API_PATH = "/organ/token/re-issue";

interface IRefreshResponse {
  accessToken: string;
  // refreshToken도 응답에 포함될 경우를 대비하여 추가
  // refreshToken?: string;
}

/**
 * Access Token과 Refresh Token을 사용하여 새 토큰을 발급받습니다.
 * @param refreshToken 리프레시 토큰
 * @returns API 응답 데이터 (새 Access Token 포함)
 */
export const reIssueToken = async (refreshToken: string) => {
  const response = await instance.post<IRefreshResponse>(
    REFRESH_API_PATH,
    {
      refreshToken: `Bearer ${refreshToken}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return response.data;
};

/**
 * 사용자 타입에 따라 적절한 도메인과 함께 토큰을 쿠키에 저장합니다.
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 * @param userType 사용자 타입 ('student' | 'admin')
 */
export const setAuthTokens = (accessToken: string, refreshToken: string | null, userType: "student" | "admin") => {
  const secure = COOKIE_DOMAIN !== "localhost";
  const domain = userType === "student" ? STUDENT_COOKIE_DOMAIN : ADMIN_COOKIE_DOMAIN;

  const options: CookieSetOptions = {
    path: "/",
    secure,
    sameSite: "none", // cross-site 요청 시 필요
    domain,
  };

  setCookies("accessToken", accessToken, options);
  setCookies("authority", userType, options);

  if (userType === "admin" && refreshToken) {
    setCookies("refreshToken", refreshToken, options);
  }
};

/**
 * 저장된 인증 토큰과 권한 정보를 삭제합니다.
 */
export const removeAuthTokens = () => {
  const userType = getCookies<"student" | "admin">("authority");
  const domain = userType === "student" ? STUDENT_COOKIE_DOMAIN : ADMIN_COOKIE_DOMAIN;
  const options: CookieSetOptions = {
    path: "/",
    domain,
  };

  const keysToRemove = [
    "accessToken",
    "authority",
  ];
  if (userType === "admin") {
    keysToRemove.push("refreshToken");
  }

  removeCookies(keysToRemove, options);
};
