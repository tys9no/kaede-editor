import AceEditor, { IAceOptions, IEditorProps } from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox"; // 検索ボックスを利用

import MarkdownIt from 'markdown-it'
import type { PluginSimple } from "markdown-it";

import mermaid from 'mermaid';
import { Ace } from "ace-builds";

import { useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';

type Props = {
  setMarkdownValue: (result: string) => void;
  aceValue?: string;
  setAceValue?: (result: string) => void;
};

const { electronAPI } = window;

const cache = new Map<string, string>();

const MdEditor = (props: Props) => {
  console.log("MdEditor");
  const editorRef = useRef<AceEditor | null>(null);


  useEffect(() => {
    const removeListener = electronAPI.onNewFile(
      () => {
        cache.clear();
        const editor = editorRef.current?.editor;
        editor?.setValue("", 1);
      },
    );
    return () => {
      removeListener();
    }
  }, []);

  useEffect(() => {
    const removeListener = electronAPI.onOpenFile(
      (value: string) => {
        cache.clear();
        const editor = editorRef.current?.editor;
        editor?.setValue(value, -1);
      },
    );
    return () => {
      removeListener();
    }
  }, []);

  useEffect(() => {
    const removeListener = electronAPI.onSave(
      (isSaveAs: boolean) => {
        const content = editorRef.current?.editor.getValue()
        electronAPI.sendEditorValue(content, isSaveAs);
      },
    );
    return () => {
      removeListener();
    }
  }, [editorRef]);


  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })

  const MermaidPlugin: PluginSimple = (md) => {
    const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
      if (tokens[idx].info == 'mermaid') {
        return '<pre class="mermaid">' + tokens[idx].content + '</pre>';
      }
      else {
        return defaultRender(tokens, idx, options, env, self);
      }
    };
  }
  md.use(MermaidPlugin)

  const PlantUMLPlugin: PluginSimple = (md) => {
    const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
      if (tokens[idx].info == 'plantuml') {
        const content = tokens[idx].content;

        // キャッシュが存在すれば利用する
        if (cache.has(content)) {
          return '<pre class="plantuml">' + cache.get(content)! + '</pre>';
        }

        // 非同期処理を解決するために同期的にプレースホルダを返す
        const placeholder = `<pre class="plantuml">Loading...</pre>`;

        // 非同期で結果を取得しキャッシュに保存
        const guid = uuidv4();
        // electronAPI.getSVG(content, guid).then((result: string) => {

        electronAPI.getSVG([content, guid]).then((result: string) => {
          console.log(result);
          if (result !== "") {
            cache.set(content, result);
          }
        });

        return placeholder;
      } else {
        return defaultRender(tokens, idx, options, env, self);
      }
    };
  };
  md.use(PlantUMLPlugin)

  mermaid.initialize({ startOnLoad: false });

  const onInput = (_event: any) => {
    console.log("onInput");
    mermaid.run({
      querySelector: '.mermaid',
      suppressErrors: true
    });
  }

  const onLoad = async (editor: Ace.Editor) => {
    console.log("onLoad");

    // Ace Editorにカスタムコマンドを追加
    editor.commands.addCommand({
      name: "showSearch",
      bindKey: { win: "Ctrl-F", mac: "Command-F" },
      exec: () => {
        // 検索ボックスを表示する組み込みコマンド
        editor.execCommand("find");
      },
    });

    editor.commands.addCommand({
      name: "replaceText",
      bindKey: { win: "Ctrl-H", mac: "Command-H" },
      exec: () => {
        // 検索置換ボックスを表示する組み込みコマンド
        editor.execCommand("replace");
      },
    });

    const result = md.render(editor.getValue());
    props.setMarkdownValue(result);
    mermaid.run({
      querySelector: '.mermaid',
      suppressErrors: true
    });
  }

  const onChange = async (newValue: string) => {
    console.log("onChange");
    const result = md.render(newValue);
    props.setMarkdownValue(result);
  }

  const editorProps: IEditorProps = {
    onChange: onChange,
    onLoad: onLoad,
    onInput: onInput,
  }

  const setOptions: IAceOptions = {
    showGutter: true, // 行番号
    showPrintMargin: false, // 印刷境界線
    tabSize: 2,
  }

  return (
    <div>
      <AceEditor
        ref={editorRef}
        name="editor"
        theme="monokai"
        mode="markdown"
        height="100vh"
        width="100%"
        focus={true} // フォーカス
        onChange={onChange}
        onInput={onInput}
        onLoad={onLoad}
        editorProps={editorProps}
        setOptions={setOptions}
      />
    </div>
  )
}

export default MdEditor;