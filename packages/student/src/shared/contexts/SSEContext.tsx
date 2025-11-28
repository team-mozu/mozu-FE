import { Toast } from "@mozu/ui";
import { getCookies, removeCookiesAsync } from "@mozu/util-config";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ClassCancelData, type ClassNextInvStartData, type ClassStartData, type TeamSSEConnectedData, useTypeSSE } from "../useTypeSSE";

interface SSEContextType {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  retryCount: number;
  lastData: any;
  disconnect: () => void;
  clearLastData: () => void;
}

const SSEContext = createContext<SSEContextType | null>(null);

export const SSEProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [lastData, setLastData] = useState<any>(null);

  // lastData 초기화 함수
  const clearLastData = () => {
    setLastData(null);
  };

  // 토큰 체크 - 토큰이 없으면 SSE 연결 안 함
  const accessToken = getCookies<string>("accessToken");

  // SSE URL 설정 - 토큰이 있을 때만
  const sseUrl = accessToken ? `${import.meta.env.VITE_SERVER_URL}/team/sse` : "";

  // 공통 에러 핸들러
  const handleSSEError = (error: any, isInitialConnection: boolean) => {
    if (isInitialConnection) {
      console.error("SSE 초기 연결 실패:", error);
      Toast("서버 연결에 실패했습니다. 로그인 페이지로 이동합니다.", {
        type: "error",
      });
    } else {
      console.log("SSE 연결 일시적 끊김, 재연결 시도 중...");
    }
  };

  // 이벤트 핸들러 정의
  const eventHandlers = {
    // 팀 SSE 연결 확인
    TEAM_SSE_CONNECTED: (data: TeamSSEConnectedData) => {
      console.log("팀 SSE 연결됨:", data);
      setLastData({
        ...data,
        type: "TEAM_SSE_CONNECTED"
      });
    },

    // 수업 시작 - 첫 번째 투자 시작
    CLASS_START: (data: ClassStartData) => {
      console.log("수업 시작 이벤트 수신:", data);
      localStorage.removeItem("trade");
      setLastData({
        ...data,
        type: "CLASS_START"
      });
    },

    // 다음 차수 투자 시작 - 2차, 3차 등
    CLASS_NEXT_INV_START: (data: ClassNextInvStartData) => {
      console.log("다음 차수 투자 시작 이벤트 수신:", data);
      localStorage.removeItem("trade");
      setLastData({
        ...data,
        type: "CLASS_NEXT_INV_START"
      });
    },

    // 수업 취소
    CLASS_CANCEL: async (data: ClassCancelData) => {
      console.log("수업 취소 이벤트 수신:", data);
      setLastData({
        ...data,
        type: "CLASS_CANCEL"
      });
      Toast("수업이 취소되었습니다.", {
        type: "error",
      });

      // 쿠키 제거
      const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
      await removeCookiesAsync(
        [
          "accessToken",
          "authority",
        ],
        {
          path: "/",
          secure: true,
          sameSite: "none",
          domain,
        },
      );
      navigate("/signin");
    },
  };

  // SSE 연결 훅 사용 (토큰이 있을 때만)
  const sseConnection = useTypeSSE(
    sseUrl, // sseUrl이 빈 문자열이면 useTypeSSE에서 연결하지 않음
    message => {
      console.log("일반 SSE 메시지 수신:", message);
      setLastData(message);
    },
    handleSSEError,
    eventHandlers,
  );

  // 토큰이 없으면 기본값 반환
  const { isConnected, isConnecting, isReconnecting, retryCount, disconnect } = accessToken
    ? sseConnection
    : {
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      retryCount: 0,
      disconnect: () => { },
    };

  return (
    <SSEContext.Provider
      value={{
        isConnected,
        isConnecting,
        isReconnecting,
        retryCount,
        lastData,
        disconnect,
        clearLastData,
      }}>
      {children}
    </SSEContext.Provider>
  );
};

// SSE 상태와 데이터를 사용하는 커스텀 훅
export const useSSE = () => {
  const context = useContext(SSEContext);

  // SSEProvider가 없을 때 기본값 반환 (에러 대신)
  if (!context) {
    // 개발 환경에서만 경고 출력
    if (import.meta.env.DEV) {
      console.warn("useSSE is being used outside of SSEProvider. Returning default values.");
    }

    return {
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      retryCount: 0,
      lastData: null,
      disconnect: () => {
        if (import.meta.env.DEV) {
          console.warn("SSE disconnect called but no SSEProvider is available.");
        }
      },
      clearLastData: () => {
        if (import.meta.env.DEV) {
          console.warn("SSE clearLastData called but no SSEProvider is available.");
        }
      },
    };
  }

  return context;
};