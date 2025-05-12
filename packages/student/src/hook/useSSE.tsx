import { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookies } from '@configs/util';

type EventType = 'TEAM_PART_IN' | 'TEAM_INV_END' | 'CLASS_NEXT_INV_START';

interface SSEEvent {
  type: EventType;
  data: any;
  message?: string;
}

interface TeamNextInvStart {
  classId: number;
  nextInvDeg: number;
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
    CLASS_NEXT_INV_START?: (data: TeamNextInvStart) => void;
  },
) => {
  const token = getCookies<string>('accessToken');
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
      heartbeatTimeout: 1000 * 60 * 30,
    });

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
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
            case 'CLASS_NEXT_INV_START':
              eventHandlers.CLASS_NEXT_INV_START?.(eventData);
              break;
            default:
              console.warn('알 수 없는 이벤트 타입:', eventType);
          }
        }

        onMessage?.(parsedData);
      } catch (error) {
        console.error('SSE JSON 파싱 오류', error);
      }
    };

    eventSource.addEventListener('CLASS_NEXT_INV_START', (e: MessageEvent) => {
      console.log(e);

      const eventData = JSON.parse(e.data);
      eventHandlers?.CLASS_NEXT_INV_START?.(eventData);
    });

    eventSource.onerror = (error) => {
      console.error('SSE 오류 발생:', error);
      onError?.(error);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return { disconnect };
};
