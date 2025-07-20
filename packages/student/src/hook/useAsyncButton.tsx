import { useState } from "react";

type AsyncFn<T extends any[]> = (...args: T) => Promise<void> | void;

/**
 * 비동기 버튼 클릭 시 중복 클릭을 방지하고 로딩 상태를 관리하는 훅
 *
 * @param asyncFn - 실행할 비동기 함수
 * @param delay - 중복 클릭 방지 시간(ms), 기본값은 1000ms
 * @returns
 *  - onClick: 클릭 이벤트 핸들러
 *  - isLoading: 로딩 여부
 *  - disabled: 버튼 비활성화 여부
 */
export const useAsyncButton = <T extends any[]>(
  asyncFn: AsyncFn<T>,
  cooldownMs = 1000
): {
  onClick: (...args: T) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const onClick = async (...args: T) => {
    if (isLoading || isOnCooldown) return;

    setIsLoading(true);
    setIsOnCooldown(true);

    try {
      const result = asyncFn(...args);
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('AsyncButton error:', error);
    } finally {
      setIsLoading(false);

      // 쿨다운 시간 후 다시 클릭 가능
      setTimeout(() => {
        setIsOnCooldown(false);
      }, cooldownMs);
    }
  };

  return {
    onClick,
    isLoading,
    disabled: isLoading || isOnCooldown
  };
};