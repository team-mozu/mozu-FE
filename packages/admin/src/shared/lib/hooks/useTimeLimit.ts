import { useRef } from "react";

const DEFAULT_DELAY = 1000 * 2;

export const useTimeLimit = (limit: number = DEFAULT_DELAY) => {
  const lock = useRef(false);

  return (callback: () => void) => {
    if (!lock.current) {
      lock.current = true;
      callback();
      // biome-ignore lint/suspicious/noAssignInExpressions: fix
      setTimeout(() => (lock.current = false), limit);
    }
  };
};
