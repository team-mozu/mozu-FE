import { Toast } from "@mozu/ui";
import { createContext, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTypeSSE } from "../hooks/useTypeSSE";

interface SSEEventData {
  type: string;
  teamId?: string;
  teamName?: string;
  schoolName?: string;
  message?: string;
  [key: string]: unknown;
}

interface SSEContextType {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  retryCount: number;
  lastData: SSEEventData | null;
  disconnect: () => void;
}

const SSEContext = createContext<SSEContextType | null>(null);

interface SSEProviderProps {
  children: React.ReactNode;
}

export const SSEProvider = ({ children }: SSEProviderProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lastData, setLastData] = useState<SSEEventData | null>(null);

  const sseUrl = `${import.meta.env.VITE_SERVER_URL}/lesson/sse/${id}`;

  const handleSSEError = (error: unknown, isInitialConnection: boolean) => {
    if (isInitialConnection) {
      console.error("SSE 초기 연결 실패:", error);
      Toast("서버 연결에 실패했습니다. 수업 관리 페이지로 이동합니다.", {
        type: "error",
      });
      navigate(-1);
    } else {
      console.log("SSE 연결 일시적 끊김, 재연결 시도 중...");
    }
  };

  // 이벤트 타입별 핸들러 - 타입 정보를 데이터에 추가
  const createEventHandler = (eventType: string) => (data: unknown) => {
    console.log(`SSE ${eventType} 이벤트 수신:`, data);
    setLastData({
      ...(data as Record<string, unknown>),
      type: eventType,
    });
  };

  const sseConnection = useTypeSSE(
    sseUrl,
    (data: unknown) => {
      console.log("SSE 일반 메시지 수신:", data);
      if (data && typeof data === 'object' && 'type' in data) {
        setLastData(data as SSEEventData);
      }
    },
    handleSSEError,
    {
      LESSON_SSE_CONNECTED: createEventHandler("LESSON_SSE_CONNECTED"),
      TEAM_PART_IN: createEventHandler("TEAM_PART_IN"),
      TEAM_INV_END: createEventHandler("TEAM_INV_END"),
      CLASS_NEXT_INV_START: createEventHandler("CLASS_NEXT_INV_START"),
    }
  );

  // 컨텍스트 값 구성
  const value: SSEContextType = {
    ...sseConnection,
    lastData,
  };

  return (
    <SSEContext.Provider value={value}>
      {children}
    </SSEContext.Provider>
  );
};

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