import type { CookieSetOptions } from "universal-cookie";
import { ADMIN_COOKIE_DOMAIN, COOKIE_DOMAIN, STUDENT_COOKIE_DOMAIN } from "../env";
import { getCookies, removeCookies, setCookies } from "../utils/cookies";
import { instance } from "./apiClient";

const REFRESH_API_PATH = "/organ/token/reissue";

interface IRefreshResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: string;
  refreshExpiredAt: string;
}

/**
 * Access Token과 Refresh Token을 사용하여 새 토큰을 발급받습니다.
 * @param refreshToken 리프레시 토큰
 * @returns API 응답 데이터 (새 Access Token 포함)
 */
export const reIssueToken = async (refreshToken: string) => {
  try {
    const response = await instance.patch<IRefreshResponse>(
      REFRESH_API_PATH,
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    // refresh token이 만료되었거나 유효하지 않은 경우
    if ((error as any)?.response?.status === 401 || (error as any)?.response?.status === 403) {
      console.log("Refresh token expired or invalid, removing tokens and redirecting");
      removeAuthTokens();

      // 테스트 환경이 아닐 때만 로그인 페이지로 리디렉션
      if (!window.location.pathname.includes("__test__")) {
        console.log("Redirecting to /signin due to invalid refresh token");
        window.location.replace("/signin");
      }
    }
    throw error;
  }
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
