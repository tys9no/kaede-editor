import type MarkdownIt from "markdown-it";
import type { Mermaid } from "mermaid";

export const MermaidPlugin = (mermaid: Mermaid) => {
  return (md: MarkdownIt): void => {
    const defaultRender =
      md.renderer.rules.fence ||
      ((tokens, idx, options, env, self) =>
        self.renderToken(tokens, idx, options));

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      if (tokens[idx].info === "mermaid") {
        return `<pre class="mermaid">${tokens[idx].content}</pre>`;
      }
      return defaultRender(tokens, idx, options, env, self);
    };

    mermaid.initialize({ startOnLoad: false });
  };
};
