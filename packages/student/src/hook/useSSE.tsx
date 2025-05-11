import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getCookies } from "@configs/util";

type EventType =
  | "TEAM_PART_IN"
  | "TEAM_INV_END"
  | "CLASS_NEXT_INV_START"
  | "CANCEL_CLASS";

interface TeamNextInvStart {
  classId: number;
  nextInvDeg: number;
}

interface TeamPartInData {
  teamId: number;
  teamName: string;
  schoolName: string;
}

interface SSEEventPayload {
  event?: {
    type: EventType;
  };
  data: any;
  message?: string;
}

interface ClassCancelData {
  classId: number;
}

interface EventHandlers {
  TEAM_PART_IN?: (data: TeamPartInData) => void;
  CLASS_NEXT_INV_START?: (data: TeamNextInvStart) => void;
  CLASS_CANCEL?: (data: ClassCancelData) => void;
}

export const useSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any) => void,
  eventHandlers?: EventHandlers
) => {
  const token = getCookies<string>("accessToken");
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!url || !token) return;

    const eventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
      heartbeatTimeout: 1000 * 60 * 30,
    });

    eventSourceRef.current = eventSource;

    (Object.keys(eventHandlers || {}) as EventType[]).forEach((eventType) => {
      eventSource.addEventListener(eventType, (e: MessageEvent) => {
        try {
          const eventData = JSON.parse(e.data);
          console.log(`[SSE] ${eventType} 수신:`, eventData);
          eventHandlers?.[eventType]?.(eventData);
        } catch (err) {
          console.error(`[SSE] ${eventType} 파싱 오류:`, err);
        }
      });
    });

    eventSource.onmessage = (e: MessageEvent) => {
      try {
        const parsed: SSEEventPayload = JSON.parse(e.data);
        onMessage?.(parsed);
      } catch (err) {
        console.error("[SSE] onmessage 파싱 오류:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] 연결 오류:", err);
      onError?.(err);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [url, token, eventHandlers, onMessage, onError]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return { disconnect };
};
