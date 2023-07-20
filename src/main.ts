import "@logseq/libs";

import { logseq as PL } from "../package.json";

import { throttle, smoothScroll } from "./utils";
import { settings } from "./settings";

const pluginId = PL.id;


const mainContentContainerId = '#main-content-container';
const rightSidebarId = '#right-sidebar .sidebar-item-list';

const init = () => {
  const contentContainer = top?.document.querySelector(mainContentContainerId);
  const rightSidebar = top?.document.querySelector(rightSidebarId);

  let contentContainerHeight: number = 0
  let rightSidebarHeight: number = 0

  const delay = logseq.settings?.['typewriterModeDealyMs'] || 100
  const isSmooth = logseq.settings?.['typewriterModeIsSmooth'] || false

  if (!contentContainer || !rightSidebar) return
  contentContainerHeight = contentContainer.clientHeight;
  rightSidebarHeight = rightSidebar.clientHeight

  const observer = new ResizeObserver(() => {
    contentContainerHeight = contentContainer.clientHeight
    rightSidebarHeight = rightSidebar.clientHeight
  })

  observer.observe(contentContainer);

  logseq.DB.onChanged(throttle(
    () => {
      let selection = top?.document.getSelection();
      let isInsideSidebar = false

      if (selection && selection.anchorNode) {
        let currentNode: Node | null | undefined = selection.anchorNode;
        const parentElements = [];

        // 遍历获取光标所在节点的所有父元素
        while (currentNode !== top?.document.documentElement) {
          parentElements.push(currentNode);
          currentNode = currentNode?.parentNode;
        }

        // 添加根元素到父元素数组
        parentElements.push(top?.document.documentElement);

        // 判断光标是否在特定元素内
        isInsideSidebar = parentElements.includes(top?.document.querySelector(rightSidebarId));
      }

      logseq.Editor.getEditingCursorPosition().then((e) => {
        if (!e?.rect || !e.rect.top) return
        const middleHeight = contentContainerHeight / 2

        // 当光标向下走（页面往上卷曲）的时候
        if (e.rect.top > middleHeight) {
          if (isInsideSidebar) {
            smoothScroll(rightSidebar, rightSidebar.scrollTop + (e.rect.top - middleHeight), isSmooth)
          } else {
            smoothScroll(contentContainer, contentContainer.scrollTop + (e.rect.top - middleHeight), isSmooth)
          }
        }

        // 当光标向上走（页面往下卷曲）的时候
        if (e.rect.top < middleHeight && contentContainer.scrollTop !== 0) {
          if (isInsideSidebar) {
            const rightSidebarScrollTop = rightSidebar.scrollTop - (middleHeight - e.rect.top)
            smoothScroll(rightSidebar, rightSidebarScrollTop > 0 ? rightSidebarScrollTop : 0, isSmooth)
          } else {
            const contentContainerScrollTop = contentContainer.scrollTop - (middleHeight - e.rect.top)
            smoothScroll(contentContainer, contentContainerScrollTop > 0 ? contentContainerScrollTop : 0, isSmooth)
          }
        }
      });
    }, delay
  ));
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  // 注册设置项
  logseq.useSettingsSchema(settings);

  init()
}

logseq.ready(main).catch(console.error);
