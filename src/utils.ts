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


/**
 * GPT 给的平滑滚动函数
 * @param element 滚动元素
 * @param targetScrollTop 目标滚动位置 
 * @param isSmooth 是否启用平滑滚动
 * @returns 
 */
export const smoothScroll = (element: Element, targetScrollTop: number, isSmooth = true) => {
  if (!isSmooth) {
    element.scrollTop = targetScrollTop
    return
  }

  const step = (targetScrollTop - element.scrollTop) / 10;
  let currentScrollTop = element.scrollTop;

  (function animateScroll() {
    currentScrollTop += step;
    element.scrollTop = currentScrollTop;

    if (Math.abs(targetScrollTop - currentScrollTop) > Math.abs(step)) {
      window.requestAnimationFrame(animateScroll);
    } else {
      element.scrollTop = targetScrollTop;
    }
  })();
}
