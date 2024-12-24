import { useEffect, useRef } from 'react';

import AceEditor, { IAceOptions, IEditorProps } from 'react-ace';
import { Ace } from 'ace-builds';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox'; // 検索ボックスを利用

import MarkdownIt from 'markdown-it'
import mermaid from 'mermaid';
import { MermaidPlugin } from "./plugins/MermaidPlugin";
import { PlantUMLPlugin } from "./plugins/PlantUMLPlugin";


type Props = {
  setMarkdownValue: (result: string) => void;
  aceValue?: string;
  setAceValue?: (result: string) => void;
};

const { electronAPI } = window;

const cache = new Map<string, string>();


const Editor = (props: Props) => {
  console.log('MdEditor');
  const editorRef = useRef<AceEditor | null>(null);

  useEffect(() => {
    const removeListener = electronAPI.onNewFile(
      () => {
        cache.clear();
        const editor = editorRef.current?.editor;
        editor?.setValue('', 1);
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
      () => {
        const content = editorRef.current?.editor.getValue()
        console.log('test');
        electronAPI.save(content);
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
  md.use(MermaidPlugin(mermaid));
  md.use(PlantUMLPlugin())

  mermaid.initialize({ startOnLoad: false });

  const onInput = () => {
    console.log('onInput');
    mermaid.run({
      querySelector: '.mermaid',
      suppressErrors: true
    });
  }

  const onLoad = async (editor: Ace.Editor) => {
    console.log('onLoad');

    // Ace Editorにカスタムコマンドを追加
    editor.commands.addCommand({
      name: 'showSearch',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {
        // 検索ボックスを表示する組み込みコマンド
        editor.execCommand('find');
      },
    });

    editor.commands.addCommand({
      name: 'replaceText',
      bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
      exec: () => {
        // 検索置換ボックスを表示する組み込みコマンド
        editor.execCommand('replace');
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
    console.log('onChange');
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
        name='editor'
        theme='monokai'
        mode='markdown'
        height='100vh'
        width='100%'
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

export default Editor;