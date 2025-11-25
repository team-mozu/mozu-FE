import { getCookies } from "@mozu/util-config";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// SSE 이벤트 데이터 타입 정의 (명세 기준)
export interface LessonSSEConnectedData {
  type: "LESSON_SSE_CONNECTED";
  message: string; // "id {lessonId}의 수업 기관 클라이언트 SSE 연결되었습니다."
}

export interface TeamPartInData {
  teamId: string;
  teamName: string;
  schoolName: string;
  lessonNum: string;
}

export interface TeamInvEndData {
  teamId: string;
  teamName: string;
  curInvRound: number;
  totalMoney: number;
  valuationMoney: number;
  profitNum: string;
}

export interface ClassNextInvStartData {
  lessonId: string;
  curInvRound: number;
}

interface EventHandlers {
  LESSON_SSE_CONNECTED?: (data: LessonSSEConnectedData) => void;
  TEAM_PART_IN?: (data: TeamPartInData) => void;
  TEAM_INV_END?: (data: TeamInvEndData) => void;
  CLASS_NEXT_INV_START?: (data: ClassNextInvStartData) => void;
}

export const useTypeSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any, isInitialFailure: boolean) => void,
  eventHandlers?: EventHandlers,
) => {
  const token = getCookies<string>("accessToken");
  const navigate = useNavigate();
  const { id } = useParams();
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 콜백 함수들을 ref로 저장해서 의존성 배열 문제 해결
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const eventHandlersRef = useRef(eventHandlers);
  const retryCountRef = useRef(retryCount);
  const isConnectedRef = useRef(isConnected);

  // 최신 콜백들을 ref에 업데이트
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    eventHandlersRef.current = eventHandlers;
    retryCountRef.current = retryCount;
    isConnectedRef.current = isConnected;
  });

  const attemptReconnect = useCallback(() => {
    if (!url || !token) return;

    const currentRetryCount = retryCountRef.current;
    console.log(`[SSE] 재연결 시도 중... (시도 ${currentRetryCount + 1})`);

    const delay = Math.min(1000 * 2 ** currentRetryCount, 30000);

    reconnectTimeoutRef.current = setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, delay);
  }, [
    url,
    token,
  ]);

  const setupConnection = useCallback(() => {
    if (!url || !token) {
      setIsConnecting(false);
      return null;
    }

    console.log("[Admin SSE] 연결 시도 중...");
    setIsConnecting(true);
    setIsReconnecting(false);

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 1000 * 60 * 30,
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("[Admin SSE] 연결 성공");
      setIsConnected(true);
      setIsConnecting(false);
      setIsReconnecting(false);
      setRetryCount(0);
    };

    eventSource.onerror = err => {
      console.error("[Admin SSE] 연결 오류:", err);
      setIsConnected(false);
      setIsConnecting(false);

      const isInitialFailure = retryCountRef.current === 0 && !isConnectedRef.current;

      if (isInitialFailure) {
        console.error("[Admin SSE] 초기 연결 실패");
        onErrorRef.current?.(err, true);
        navigate(`/class-management/${id}`);
      } else {
        console.log("[Admin SSE] 연결 끊김, 재연결 시도");
        onErrorRef.current?.(err, false);
        attemptReconnect();
      }
    };

    eventSource.onmessage = e => {
      try {
        const parsed = JSON.parse(e.data);
        onMessageRef.current?.(parsed);
      } catch (err) {
        console.error("[Admin SSE] 파싱 오류:", err);
      }
    };

    eventSource.addEventListener("LESSON_SSE_CONNECTED", (e: any) => {
      try {
        const eventData = JSON.parse(e.data);
        console.log(`[Admin SSE] LESSON_SSE_CONNECTED 수신:`, eventData);
        setIsConnected(true);
        setIsConnecting(false);
        setIsReconnecting(false);
        setRetryCount(0);
        eventHandlersRef.current?.LESSON_SSE_CONNECTED?.(eventData);
      } catch (err) {
        console.error(`[Admin SSE] LESSON_SSE_CONNECTED 파싱 오류:`, err);
      }
    });

    const setupEventHandlers = () => {
      const handlers = eventHandlersRef.current;
      if (!handlers) return;

      Object.entries(handlers).forEach(([eventType, handler]) => {
        if (eventType !== "LESSON_SSE_CONNECTED") {
          eventSource.addEventListener(eventType, (e: any) => {
            try {
              const eventData = JSON.parse(e.data);
              console.log(`[Admin SSE] ${eventType} 수신:`, eventData);
              handler?.(eventData);
            } catch (err) {
              console.error(`[Admin SSE] ${eventType} 파싱 오류:`, err);
            }
          });
        }
      });
    };

    setupEventHandlers();
    return eventSource;
  }, [
    url,
    token,
    attemptReconnect,
    navigate,
    id,
  ]);

  useEffect(() => {
    const eventSource = setupConnection();

    return () => {
      console.log("[SSE] 연결 정리");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSource) {
        eventSource.close();
      }
      eventSourceRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
      setIsReconnecting(false);
    };
  }, [
    setupConnection,
  ]); // 의존성을 url과 token만으로 제한

  useEffect(() => {
    if (retryCount > 0) {
      console.log(`[SSE] retryCount 변경됨: ${retryCount}, 재연결 트리거`);
    }
  }, [
    retryCount,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsReconnecting(false);
    setRetryCount(0);
  }, []);

  return {
    disconnect,
    isConnected,
    isConnecting,
    isReconnecting,
    retryCount,
  };
};
