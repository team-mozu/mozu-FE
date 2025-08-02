import { ADMIN_COOKIE_DOMAIN, COOKIE_DOMAIN, STUDENT_COOKIE_DOMAIN } from "../../../env";
import { removeCookies, setCookies } from "../../../utils/cookies";
import { instance } from "../axios";
import type { IRefreshResponse } from "./types";

const API_PATH = "/organ/token/re-issue";

export const reIssueToken = async (refreshToken: string) => {
  const response = await instance.post<IRefreshResponse>(
    `${API_PATH}`,
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

export const setTokens = (accessToken: string | null, refreshToken: string | null, userType: "student" | "admin") => {
  if (!accessToken) {
    console.error("setTokens 오류: accessToken이 없습니다.");
    return;
  }

  console.log("setTokens 호출됨:", {
    accessToken,
    refreshToken,
    userType,
  });

  const secureOption = COOKIE_DOMAIN === "localhost" ? false : true;

  const domain = userType === "student" ? STUDENT_COOKIE_DOMAIN : ADMIN_COOKIE_DOMAIN;

  console.log("쿠키 도메인:", domain);

  setCookies("accessToken", accessToken, {
    path: "/",
    secure: secureOption,
    sameSite: "none",
    domain,
  });

  if (userType === "admin" && refreshToken) {
    setCookies("refreshToken", refreshToken, {
      path: "/",
      secure: secureOption,
      sameSite: "none",
      domain,
    });
  }

  setCookies("authority", userType, {
    path: "/",
    secure: secureOption,
    sameSite: "none",
    domain,
  });
};

export const removeTokens = (userType: "student" | "admin") => {
  const domain = userType === "student" ? STUDENT_COOKIE_DOMAIN : ADMIN_COOKIE_DOMAIN;

  if (userType === "student") {
    removeCookies("accessToken", {
      path: "/",
      secure: true,
      sameSite: "none",
      domain,
    });
  } else {
    removeCookies(
      [
        "accessToken",
        "refreshToken",
      ],
      {
        path: "/",
        secure: true,
        sameSite: "none",
        domain,
      },
    );
  }
};
