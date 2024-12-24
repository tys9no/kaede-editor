import { useRef } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';

import MarkdownIt from 'markdown-it'
import mermaid from 'mermaid';
import { MermaidPlugin } from "./plugins/MermaidPlugin";
import { PlantUMLPlugin } from "./plugins/PlantUMLPlugin";

import { useAceEditorHandlers } from './hooks/useAceEditorHandlers';
import { useElectronListeners } from './hooks/useElectronListeners';


type Props = {
  setMarkdownValue: (result: string) => void;
};

const Editor = (props: Props) => {
  const editorRef = useRef<AceEditor | null>(null);
  useElectronListeners(editorRef);

  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })
  md.use(MermaidPlugin(mermaid));
  md.use(PlantUMLPlugin())

  const { onLoad, onChange, onInput } = useAceEditorHandlers(md, props.setMarkdownValue)

  return (
    <div>
      <AceEditor
        ref={editorRef}
        name='editor'
        theme='monokai'
        mode='markdown'
        height='100vh'
        width='100%'
        focus={true}
        onChange={onChange}
        onInput={onInput}
        onLoad={onLoad}
        setOptions={{
          showGutter: true,
          showPrintMargin: false,
          tabSize: 2,
        }}
      />
    </div>
  )
}

export default Editor;
