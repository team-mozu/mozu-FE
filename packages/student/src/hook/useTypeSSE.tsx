import { getCookies } from "@mozu/util-config";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";

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

export interface ClassCancelData {
  classId: string;
  teamId: string;
}

export type EventHandlers = {
  TEAM_SSE_CONNECTED?: (data: TeamSSEConnectedData) => void;
  CLASS_NEXT_INV_START?: (data: ClassNextInvStartData) => void;
  CLASS_CANCEL?: (data: ClassCancelData) => void;
};

export const useTypeSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any) => void,
  eventHandlers?: EventHandlers
) => {
  const token = getCookies<string>("accessToken");
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  // 콜백 함수들을 ref로 저장해서 의존성 배열 문제 해결
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const eventHandlersRef = useRef(eventHandlers);

  // 최신 콜백들을 ref에 업데이트
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    eventHandlersRef.current = eventHandlers;
  });

  useEffect(() => {
    if (!url || !token) {
      setIsConnecting(false);
      return;
    }

    console.log("[SSE] 연결 시도 중...");
    setIsConnecting(true);
    setIsConnected(false);

    const eventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
      heartbeatTimeout: 1000 * 60 * 30,
    });

    eventSourceRef.current = eventSource;

    // SSE 연결 상태 이벤트 핸들러
    eventSource.onopen = () => {
      console.log("[SSE] 연결 성공");
      setIsConnected(true);
      setIsConnecting(false);
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] 연결 오류:", err);
      setIsConnected(false);
      setIsConnecting(false);
      onErrorRef.current?.(err);
    };

    eventSource.onmessage = (e) => {
      console.log('수신된 SSE 데이터:', e.data);
      try {
        const parsed = JSON.parse(e.data);
        onMessageRef.current?.(parsed);
      } catch (err) {
        console.error("[SSE] onmessage 파싱 오류:", err);
      }
    };

    // TEAM_SSE_CONNECTED 이벤트 핸들러 (서버에서 연결 확인 메시지)
    eventSource.addEventListener("TEAM_SSE_CONNECTED", (e: any) => {
      try {
        const eventData = JSON.parse(e.data);
        console.log("[SSE] TEAM_SSE_CONNECTED 수신:", eventData);
        setIsConnected(true);
        setIsConnecting(false);
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

    return () => {
      console.log("[SSE] 연결 종료");
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [url, token]); // 의존성을 url과 token만으로 제한

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  return {
    disconnect,
    isConnected,
    isConnecting
  };
};