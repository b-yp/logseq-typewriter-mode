import "@logseq/libs";

import { logseq as PL } from "../package.json";

import { throttle } from "./utils";
import { settings } from "./settings";

const pluginId = PL.id;

const init = () => {
  const contentContainer = top?.document.querySelector("#main-content-container");
  if (!contentContainer) return
  const delay = logseq.settings?.['typewriterModeDealyMs'] || 100

  const contentContainerHeight = contentContainer.clientHeight;
  logseq.DB.onChanged(throttle(
    () => {
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
