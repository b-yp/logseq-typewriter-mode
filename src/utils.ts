/**
 * ChatGPT 给的节流函数
 * @param func 
 * @param delay 
 * @returns 
 */
export const throttle = <T extends any[]>(func: (...args: T) => void, delay: number) => {
  let lastExecutionTime = 0;
  let timer: NodeJS.Timeout | null = null;

  return (...args: T) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;

    if (timer) clearTimeout(timer);

    if (timeSinceLastExecution >= delay) {
      lastExecutionTime = now;
      func(...args);
    } else {
      timer = setTimeout(() => {
        lastExecutionTime = Date.now();
        func(...args);
      }, delay - timeSinceLastExecution);
    }
  };
};
