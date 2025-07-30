import { Toast } from "@mozu/ui";
import axios, { type AxiosError } from "axios";
import { SERVER_URL } from "@/env";
import { getCookies, removeCookies } from "@/utils/cookies";
import { reIssueToken, removeTokens, setTokens } from "./auth";

export const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10_000,
});

const API_PATH = "/organ/token/re-issue";

instance.interceptors.request.use(
  config => {
    const accessToken = getCookies<string>("accessToken");

    if (config.url === API_PATH) {
      return config;
    }

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
  async res => res,
  async (error: AxiosError<AxiosError>) => {
    if (axios.isAxiosError(error) && error.response) {
      const { config } = error;
      const refreshToken = getCookies("refreshToken");

      console.log(`ref => ${refreshToken}`);
      if (error.response.status === 401 || error.response.status === 403) {
        const originalRequest = config;

        if (refreshToken) {
          return reIssueToken(refreshToken as string)
            .then(res => {
              console.log("New Token Response:", res);
              setTokens(res.accessToken, refreshToken as string, "admin");
              console.log(`Access Token: ${res.accessToken}`);
              console.log(`Refresh Token: ${refreshToken as string}`);
              if (originalRequest && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
                return axios(originalRequest);
              } else {
                return Promise.reject(new Error("Original request is undefined"));
              }
            })
            .catch((res: AxiosError<AxiosError>) => {
              const errorCode = res?.response?.data?.code;
              if (errorCode !== undefined && +errorCode >= 500) {
                return Toast("서버 에러 잠시 뒤 시도해 주세요", {
                  type: "error",
                });
              }
              removeTokens("admin");
              removeCookies("authority");
            });
        } else {
          removeTokens("admin");
          window.location.replace("/signin");
        }
      } else return Promise.reject(error);
    }
  },
);
