import { Toast } from "@mozu/ui";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { SERVER_URL } from "../env";
import { getCookies } from "../utils/cookies";
import { reIssueToken, removeAuthTokens, setAuthTokens } from "./auth";

// 📝 NOTE: 실제 환경 변수 파일(.env)에서 가져오도록 설정하세요.
const REFRESH_API_PATH_FOR_CHECK = "/organ/token/reissue";

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10_000,
});

// 요청 인터셉터: 헤더에 Access Token 자동 추가 및 multipart/form-data 자동 변환
instance.interceptors.request.use(
  config => {
    // 토큰 재발급 요청 및 로그인 요청 시에는 Authorization 헤더를 추가하지 않음
    if (
      config.url === REFRESH_API_PATH_FOR_CHECK ||
      config.url?.includes("/organ/login") ||
      config.url?.includes("/team/participate")
    ) {
      return config;
    }

    const accessToken = getCookies("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // multipart/form-data가 필요한 엔드포인트들
    const multipartEndpoints = [
      "/item",
      "/article",
    ];
    const needsFormData = multipartEndpoints.some(
      endpoint => config.url?.includes(endpoint) && (config.method === "post" || config.method === "patch"),
    );

    // 데이터가 있고 이미 FormData가 아닌 경우에만 변환
    if (needsFormData && config.data && !(config.data instanceof FormData)) {
      const formData = new FormData();

      Object.entries(config.data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });

      config.data = formData;
      // axios가 자동으로 multipart/form-data 헤더를 설정하도록 Content-Type 제거
      delete config.headers["Content-Type"];
    }

    return config;
  },
  error => Promise.reject(error),
);

// --- 토큰 재발급 로직 (동시 요청 처리) ---

// 토큰 재발급 요청을 저장하는 변수 (중복 실행 방지용)
let isRefreshing = false;
// 재발급이 진행되는 동안 실패한 요청들을 저장하는 배열
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.config.headers!["Authorization"] = `Bearer ${token}`;
      prom.resolve(instance(prom.config));
    }
  });
  failedQueue = [];
};

// 응답 인터셉터: 401/403 에러 처리 및 토큰 재발급
instance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 401 또는 403 에러가 아니거나, 설정이 없으면 바로 에러 반환
    if (!originalRequest || (error.response?.status !== 401 && error.response?.status !== 403)) {
      return Promise.reject(error);
    }

    // 토큰 재발급이 이미 진행 중인 경우
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    isRefreshing = true;

    const refreshToken = getCookies("refreshToken");
    const userType = getCookies<"student" | "admin">("authority");

    console.log("401/403 Error - refreshToken:", refreshToken);
    console.log("401/403 Error - userType:", userType);
    console.log("401/403 Error - current path:", window.location.pathname);

    if (!refreshToken || !userType) {
      isRefreshing = false;
      removeAuthTokens();
      console.log("No refresh token or user type, redirecting to signin");
      // 테스트 환경이 아닐 때만 로그인 페이지로 리디렉션
      if (!window.location.pathname.includes("__test__")) {
        console.log("Redirecting to /signin");
        window.location.replace("/signin");
      }
      return Promise.reject(error);
    }

    try {
      const { accessToken: newAccessToken } = await reIssueToken(refreshToken);

      setAuthTokens(newAccessToken, refreshToken, userType);

      // 대기열에 있던 모든 요청을 새로운 토큰으로 재실행
      processQueue(null, newAccessToken);

      // 현재 실패했던 원래 요청도 새로운 토큰으로 재실행
      originalRequest.headers!["Authorization"] = `Bearer ${newAccessToken}`;
      return await instance(originalRequest);
    } catch (refreshError) {
      // 토큰 재발급 실패 시 (e.g., Refresh Token 만료)
      console.log("Token refresh failed:", refreshError);
      processQueue(refreshError as AxiosError, null);
      removeAuthTokens();

      Toast("세션이 만료되었습니다. 다시 로그인해주세요.", {
        type: "error",
      });
      console.log("Token refresh failed, redirecting to signin");
      if (!window.location.pathname.includes("__test__")) {
        console.log("Redirecting to /signin after refresh failure");
        window.location.replace("/signin");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
