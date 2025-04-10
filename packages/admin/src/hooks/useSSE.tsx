import { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookies } from '@configs/util';

type EventType = 'TEAM_PART_IN' | 'TEAM_INV_END' | 'CLASS_NEXT_INV_START';

interface SSEEvent {
  type: EventType;
  data: any;
  message?: string;
}

interface TeamPartInData {
  teamId: number;
  teamName: string;
  schoolName: string;
}

export const useSSE = (
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: any) => void,
  eventHandlers?: {
    TEAM_PART_IN?: (data: TeamPartInData) => void;
    TEAM_INV_END?: (data: any) => void;
    CLASS_NEXT_INV_START?: (data: any) => void;
  },
) => {
  const token = getCookies<string>('accessToken');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      console.log('수신된 SSE 데이터:', e.data);
      if (e.target.headers.Authorization) {
        console.warn(
          'SSE에서 받은 Authorization 헤더 무시:',
          e.target.headers.Authorization,
        );
        delete e.target.headers.Authorization;
      }
      try {
        const parsedData = JSON.parse(e.data);
        const eventType = parsedData.event?.type as EventType;
        const eventData = parsedData.data;

        if (onMessage) {
          onMessage(parsedData);
        }

        if (eventHandlers && eventType) {
          console.log('sse event', eventType);
          switch (eventType) {
            case 'TEAM_INV_END':
              eventHandlers.TEAM_INV_END?.(eventData);
              break;
            case 'CLASS_NEXT_INV_START':
              eventHandlers.CLASS_NEXT_INV_START?.(eventData);
              break;
            default:
              console.warn('알 수 없는 이벤트 타입:', eventType);
          }
        }
      } catch (error) {
        console.error('SSE JSON 파싱 오류', error);
      }
    };

    eventSource.addEventListener('TEAM_PART_IN', (e: MessageEvent) => {
      console.log(e);

      const eventData = JSON.parse(e.data);
      eventHandlers?.TEAM_PART_IN?.(eventData);
    });

    eventSource.addEventListener('TEAM_INV_END', (e: MessageEvent) => {
      console.log(e);

      const eventData = JSON.parse(e.data);
      eventHandlers?.TEAM_INV_END?.(eventData);
    });

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [url, onMessage, eventHandlers]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return { disconnect };
};
