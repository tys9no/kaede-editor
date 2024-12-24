import type MarkdownIt from "markdown-it";
import { v4 as uuidv4 } from 'uuid';

const cache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<void>>();

const { electronAPI } = window;

export const PlantUMLPlugin = () => {
  return (md: MarkdownIt): void => {
    const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      if (tokens[idx].info === "plantuml") {
        const content = tokens[idx].content;

        if (cache.has(content)) {
          const value = cache.get(content);
          if (value) {
            return `<pre class="plantuml">${value}</pre>`;
          } else {
            return defaultRender(tokens, idx, options, env, self);
          }
        }

        const placeholder = `<pre class="plantuml">Loading...</pre>`;
        if (pendingRequests.has(content)) {
          return placeholder;
        }

        const guid = uuidv4();
        const request = electronAPI.getSVG([content, guid]).then((result: string) => {
          if (result !== '') {
            cache.set(content, result);
          }
          pendingRequests.delete(content);
        });

        pendingRequests.set(content, request);

        return placeholder;
      } else {
        return defaultRender(tokens, idx, options, env, self);
      }
    };
  };
};
