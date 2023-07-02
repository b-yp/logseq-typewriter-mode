import "@logseq/libs";

import { logseq as PL } from "../package.json";

const pluginId = PL.id;

const init = () => {
  const contentContainer = top?.document.querySelector("#main-content-container");
  if (!contentContainer) return
  const contentContainerHeight = contentContainer.clientHeight;
  // TODO: 加节流避免开销过大，并且提供设置项，自定义节流间隔时间
  logseq.DB.onChanged(() => {
    logseq.Editor.getEditingCursorPosition().then((e) => {
      if (!e?.rect || !e.rect.top) return
      const middleHeight = contentContainerHeight / 2
      // 当光标向下走（页面往上卷曲）的时候
      if (e.rect.top > middleHeight) {
        contentContainer.scrollTop = contentContainer.scrollTop + (e.rect.top - middleHeight);
      }
      // 当光标向上走（页面往下卷曲）的时候
      if (e.rect.top < middleHeight && contentContainer.scrollTop !== 0) {
        const scrollTop = contentContainer.scrollTop - (middleHeight - e.rect.top)
        contentContainer.scrollTop = scrollTop > 0 ? scrollTop : 0;
      }
    });
  });
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);
  init()
}

logseq.ready(main).catch(console.error);
