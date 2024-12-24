import type { Ace } from 'ace-builds';

import type MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

export const useAceEditorHandlers = (md: MarkdownIt, setMarkdownValue: (result: string) => void) => {
  const onLoad = async (editor: Ace.Editor) => {
    editor.commands.addCommand({
      name: 'showSearch',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {
        editor.execCommand('find');
      },
    });

    editor.commands.addCommand({
      name: 'replaceText',
      bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
      exec: () => {
        editor.execCommand('replace');
      },
    });
  }

  const onChange = async (newValue: string) => {
    const result = md.render(newValue);
    setMarkdownValue(result);
  }

  const onInput = () => {
    mermaid.run({
      querySelector: '.mermaid',
      suppressErrors: true,
    });
  }

  return { onLoad, onChange, onInput };
};
