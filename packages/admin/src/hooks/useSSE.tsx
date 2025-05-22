import { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookies } from '@configs/util';

type EventType = 'TEAM_PART_IN' | 'TEAM_INV_END';

interface TeamPartInData {
  teamId: number;
  teamName: string;
  schoolName: string;
}

interface TeamInvEndData {
  teamId: number;
  teamName: string;
  invDeg: number;
  totalMoney: number;
  valMoney: number;
  profitNum: string;
}

interface EventHandlers {
  TEAM_PART_IN?: (data: TeamPartInData) => void;
  TEAM_INV_END?: (data: TeamInvEndData) => void;
}

export const useSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any) => void,
  eventHandlers?: EventHandlers,
) => {
  const token = getCookies<string>('accessToken');
  const eventSourceRef = useRef<EventSource | null>(null);

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

    eventSource.onmessage = (e) => {
      console.log('수신된 SSE 데이터:', e.data);
      try {
        const parsedData = JSON.parse(e.data);
        onMessage?.(parsedData);
      } catch (error) {
        console.error('SSE JSON 파싱 오류', error);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류', err);
      onError?.(err);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return { disconnect };
};