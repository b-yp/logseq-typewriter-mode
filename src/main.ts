import "@logseq/libs";

import { logseq as PL } from "../package.json";

import { throttle, smoothScroll } from "./utils";
import { settings } from "./settings";

const pluginId = PL.id;

const iconOn = `
  <svg t="1697737903327" class="icon" viewBox="0 0 1024 1024" version="1.1"
  xmlns="http://www.w3.org/2000/svg" p-id="8577" width="20" height="20">
    <path d="M994 364a30 30 0 0 0-30 30V424h-67.16c-12.384-34.92-45.728-60-84.84-60h-30V210c0-7.488-2.848-15.12-8.792-21.216L593.192 8.76A30.16 30.16 0 0 0 572 0H272a30 30 0 0 0-30 30V364H212c-39.112 0-72.456 25.08-84.84 60H60v-30a30 30 0 0 0-60 0v120a30 30 0 0 0 60 0V484h67.16a90.424 90.424 0 0 0 54.84 54.84V604H92a30 30 0 0 0-30 30v120a30 30 0 0 0 60 0V664h51.576l-50.68 202.72c-0.504 2-0.896 4.872-0.896 7.28v60c0 49.624 40.376 90 90 90h600c49.624 0 90-40.376 90-90v-60a34.4 34.4 0 0 0-0.896-7.28l-59.104-236.416V538.84a90.424 90.424 0 0 0 54.84-54.84h67.16v30a30 30 0 0 0 60 0v-120a30 30 0 0 0-30-30z m-392-261.576l77.576 77.576H602v-77.576zM302 60h240v150A30 30 0 0 0 572 240h150v124h-420v-304z m540 874a30.032 30.032 0 0 1-30 30h-600a30.032 30.032 0 0 1-30-30V904h660v30zM788.576 664l45 180H190.424L235.424 664h553.152zM242 604V544h540v60h-540z m570-120h-600a30.032 30.032 0 0 1-30-30A30.032 30.032 0 0 1 212 424h600a30.032 30.032 0 0 1 30 30 30.032 30.032 0 0 1-30 30zM272 784a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z" fill="#e0a650" p-id="8578"></path>
  </svg>
`
const iconOff = `
  <svg t="1697737903327" class="icon" viewBox="0 0 1024 1024" version="1.1"
    xmlns="http://www.w3.org/2000/svg" p-id="8577" width="20" height="20">
    <path d="M994 364a30 30 0 0 0-30 30V424h-67.16c-12.384-34.92-45.728-60-84.84-60h-30V210c0-7.488-2.848-15.12-8.792-21.216L593.192 8.76A30.16 30.16 0 0 0 572 0H272a30 30 0 0 0-30 30V364H212c-39.112 0-72.456 25.08-84.84 60H60v-30a30 30 0 0 0-60 0v120a30 30 0 0 0 60 0V484h67.16a90.424 90.424 0 0 0 54.84 54.84V604H92a30 30 0 0 0-30 30v120a30 30 0 0 0 60 0V664h51.576l-50.68 202.72c-0.504 2-0.896 4.872-0.896 7.28v60c0 49.624 40.376 90 90 90h600c49.624 0 90-40.376 90-90v-60a34.4 34.4 0 0 0-0.896-7.28l-59.104-236.416V538.84a90.424 90.424 0 0 0 54.84-54.84h67.16v30a30 30 0 0 0 60 0v-120a30 30 0 0 0-30-30z m-392-261.576l77.576 77.576H602v-77.576zM302 60h240v150A30 30 0 0 0 572 240h150v124h-420v-304z m540 874a30.032 30.032 0 0 1-30 30h-600a30.032 30.032 0 0 1-30-30V904h660v30zM788.576 664l45 180H190.424L235.424 664h553.152zM242 604V544h540v60h-540z m570-120h-600a30.032 30.032 0 0 1-30-30A30.032 30.032 0 0 1 212 424h600a30.032 30.032 0 0 1 30 30 30.032 30.032 0 0 1-30 30zM272 784a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z m120 0a30 30 0 1 1 0-60 30 30 0 0 1 0 60z" fill="#dbdbdb" p-id="8578"></path>
  </svg>
`

const mainContentContainerId = '#main-content-container';
const rightSidebarId = '#right-sidebar .sidebar-item-list';
let isTypewriterMode = true;

const registerUIItem = () => {
  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `
      <div data-on-click="handleToggle" class="button">
        ${isTypewriterMode ? iconOn : iconOff}
      <div>
    `,
  });
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  // 注册设置项
  logseq.useSettingsSchema(settings);


  const contentContainer = top?.document.querySelector(mainContentContainerId);
  const rightSidebar = top?.document.querySelector(rightSidebarId);

  let contentContainerHeight: number = 0
  let rightSidebarHeight: number = 0

  const delay = logseq.settings?.['typewriterModeDealyMs'] || 100
  const isSmooth = logseq.settings?.['typewriterModeIsSmooth'] || false

  contentContainerHeight = contentContainer?.clientHeight || 0
  rightSidebarHeight = rightSidebar?.clientHeight || 0

  const observer = new ResizeObserver(() => {
    contentContainerHeight = contentContainer?.clientHeight || 0
    rightSidebarHeight = rightSidebar?.clientHeight || 0
  })

  if (!!contentContainer) {
    observer.observe(contentContainer);
  }

  const scrolling = () => {
    // TODO: 有没有更好的方案？
    if (!isTypewriterMode) {
      return
    }

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
      if (!e) return

      const middleHeight = contentContainerHeight / 2
      const cursorTop = e.top + e.rect.top

      // 当光标向下走（页面往上卷曲）的时候
      if (cursorTop > middleHeight) {
        if (isInsideSidebar && !!rightSidebar) {
          smoothScroll(rightSidebar, rightSidebar.scrollTop + (cursorTop - middleHeight), isSmooth)
        } else {
          if (!!contentContainer) {
            smoothScroll(contentContainer, contentContainer.scrollTop + (cursorTop - middleHeight), isSmooth)
          }
        }
      }

      if (!contentContainer) return

      // 当光标向上走（页面往下卷曲）的时候
      if (cursorTop < middleHeight && contentContainer.scrollTop !== 0) {
        if (isInsideSidebar && !!rightSidebar) {
          const rightSidebarScrollTop = rightSidebar.scrollTop - (middleHeight - cursorTop)
          smoothScroll(rightSidebar, rightSidebarScrollTop > 0 ? rightSidebarScrollTop : 0, isSmooth)
        } else {
          const contentContainerScrollTop = contentContainer.scrollTop - (middleHeight - cursorTop)
          smoothScroll(contentContainer, contentContainerScrollTop > 0 ? contentContainerScrollTop : 0, isSmooth)
        }
      }
    });
  }

  const scrollingWithKey = (event: any) => {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      scrolling()
    }
  }

  if (isTypewriterMode) {
    logseq.DB.onChanged(throttle(scrolling, delay));

    top!.document.addEventListener('keydown', scrollingWithKey);
  }

  registerUIItem()

  const createModel = () => {
    return {
      handleToggle() {
        isTypewriterMode = !isTypewriterMode

        if (isTypewriterMode) {
          top!.document.addEventListener('keydown', scrollingWithKey);
        } else {
          top!.document.removeEventListener('keydown', scrollingWithKey);
        }

        logseq.UI.showMsg(isTypewriterMode ? "Typewriter mode is on" : "Typewriter mode is off")
        registerUIItem()
      }
    }
  }

  logseq.provideModel(createModel())
}

logseq.ready(main).catch(console.error);
