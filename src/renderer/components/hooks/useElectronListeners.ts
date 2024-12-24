import { useEffect } from "react";
import AceEditor from 'react-ace';

const { electronAPI } = window;

export const useElectronListeners = (editorRef: React.MutableRefObject<AceEditor | null>) => {
  useEffect(() => {
    const unsubscribeNewFile = electronAPI.onNewFile(() => {
      const editor = editorRef.current?.editor;
      editor?.setValue("", 1);
    });

    const unsubscribeOpenFile = electronAPI.onOpenFile((content: string) => {
      const editor = editorRef.current?.editor;
      editor?.setValue(content, -1);
    });

    const unsubscribeSave = electronAPI.onSave(() => {
      const content = editorRef.current?.editor.getValue();
      electronAPI.save(content);
    });

    // クリーンアップ関数
    return () => {
      unsubscribeNewFile();
      unsubscribeOpenFile();
      unsubscribeSave();
    };
  }, [editorRef]);
};
