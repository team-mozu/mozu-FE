import { getCookies } from "@mozu/util-config";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface TeamSSEConnectedData {
  type: "TEAM_SSE_CONNECTED";
  message: string;
}

export interface ClassNextInvStartData {
  lessonId: string;
  curInvRound: number;
  teamId: string;
  teamName: string;
  schoolName: string;
}

export interface ClassStartData {
  lessonId: string;
  curInvRound: number;
  teamId: string;
  teamName: string;
  schoolName: string;
}

export interface ClassCancelData {
  classId: string;
  teamId: string;
}

export interface TeamPartInData {
  teamId: string;
  teamName: string;
  schoolName: string;
}

export type EventHandlers = {
  TEAM_SSE_CONNECTED?: (data: TeamSSEConnectedData) => void;
  CLASS_START?: (data: ClassStartData) => void;
  CLASS_NEXT_INV_START?: (data: ClassNextInvStartData) => void;
  CLASS_CANCEL?: (data: ClassCancelData) => void;
};

export const useTypeSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any, isInitialConnection: boolean) => void,
  eventHandlers?: EventHandlers,
) => {
  const token = getCookies<string>("accessToken");
  const navigate = useNavigate();
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 콜백 함수들과 상태를 ref로 저장
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const eventHandlersRef = useRef(eventHandlers);
  const retryCountRef = useRef(retryCount);
  const isConnectedRef = useRef(isConnected);
  const lastEventIdRef = useRef<string | null>(null);

  // 최신 값들을 ref에 업데이트
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    eventHandlersRef.current = eventHandlers;
    retryCountRef.current = retryCount;
    isConnectedRef.current = isConnected;
  });

  // 재연결 시도 함수 - useCallback에서 의존성 제거
  const attemptReconnect = useCallback(() => {
    if (!url || !token) return;

    const currentRetryCount = retryCountRef.current;
    console.log(`[SSE] 재연결 시도 중... (시도 ${currentRetryCount + 1})`);
    setIsReconnecting(true);

    // 지수 백오프: 1초, 2초, 4초, 8초, 16초, 최대 30초
    const delay = Math.min(1000 * 2 ** currentRetryCount, 30000);

    reconnectTimeoutRef.current = setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, delay);
  }, [
    url,
    token,
  ]); // retryCount 제거

  // 연결 설정 함수 - 안정적인 의존성만 사용
  const setupConnection = useCallback(() => {
    if (!url || !token) {
      setIsConnecting(false);
      return null;
    }

    console.log("[SSE] 연결 시도 중...");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    setIsConnecting(true);
    setIsReconnecting(false);

    const eventSource = new EventSourcePolyfill(url, {
      headers: headers,
      heartbeatTimeout: 1000 * 60 * 30, // 30분
    });

    eventSourceRef.current = eventSource;

    // SSE 연결 성공
    eventSource.onopen = () => {
      console.log("[SSE] 연결 성공");
      setIsConnected(true);
      setIsConnecting(false);
      setIsReconnecting(false);
      setRetryCount(0);
    };

    // SSE 연결 오류
    eventSource.onerror = err => {
      console.error("[SSE] 연결 오류:", err);
      setIsConnected(false);
      setIsConnecting(false);

      // ref를 사용하여 최신 상태 확인
      const isInitialFailure = retryCountRef.current === 0 && !isConnectedRef.current;

      if (isInitialFailure) {
        // 처음 연결 실패 - 리다이렉트
        console.error("[SSE] 초기 연결 실패, 로그인 페이지로 이동");
        onErrorRef.current?.(err, true);
        navigate("/signin");
      } else {
        // 연결 후 끊김 - 재연결 시도
        console.log("[SSE] 연결 끊김, 재연결 시도");
        onErrorRef.current?.(err, false);
        attemptReconnect();
      }
    };

    eventSource.onmessage = e => {
      try {
        if (e.lastEventId) {
          lastEventIdRef.current = e.lastEventId;
        }
        const parsed = JSON.parse(e.data);
        onMessageRef.current?.(parsed);
      } catch (err) {
        console.error("[SSE] onmessage 파싱 오류:", err);
      }
    };

    // TEAM_SSE_CONNECTED 이벤트 핸들러
    eventSource.addEventListener("TEAM_SSE_CONNECTED", (e: any) => {
      try {
        const eventData = JSON.parse(e.data);
        console.log("[SSE] TEAM_SSE_CONNECTED 수신:", eventData);
        setIsConnected(true);
        setIsConnecting(false);
        setIsReconnecting(false);
        setRetryCount(0);
        eventHandlersRef.current?.TEAM_SSE_CONNECTED?.(eventData);
      } catch (err) {
        console.error("[SSE] TEAM_SSE_CONNECTED 파싱 오류:", err);
      }
    });

    // 다른 이벤트 핸들러들
    const setupEventHandlers = () => {
      const handlers = eventHandlersRef.current;
      if (!handlers) return;

      Object.entries(handlers).forEach(([eventType, handler]) => {
        if (eventType !== "TEAM_SSE_CONNECTED") {
          eventSource.addEventListener(eventType, (e: any) => {
            try {
              if (e.lastEventId) {
                lastEventIdRef.current = e.lastEventId;
              }
              const eventData = JSON.parse(e.data);
              console.log(`[SSE] ${eventType} 수신:`, eventData);
              handler?.(eventData);
            } catch (err) {
              console.error(`[SSE] ${eventType} 파싱 오류:`, err);
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
  ]); // 안정적인 의존성만 유지

  // 메인 useEffect - setupConnection만 의존성으로 사용
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
  ]);

  // retryCount 변경 시 재연결 시도 (별도의 useEffect)
  useEffect(() => {
    if (retryCount > 0) {
      console.log(`[SSE] retryCount 변경됨: ${retryCount}, 재연결 트리거`);
      // setupConnection이 자동으로 재실행됨
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
