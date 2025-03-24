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
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!url || eventSourceRef.current) return;

    const eventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      try {
        const parsedData = JSON.parse(e.data);
        const eventType = parsedData.event?.type as EventType;
        const eventData = parsedData.data;

        onMessage?.(parsedData);
        eventHandlers?.[eventType]?.(eventData);
      } catch (error) {
        console.error('SSE JSON 파싱 오류', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE 오류 발생:', error);
      onError?.(error);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [url]);

  const disconnect = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  };

  return { disconnect };
};
