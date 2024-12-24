import { useEffect } from "react";
import AceEditor from 'react-ace';

const { electronAPI } = window;

export const useElectronListeners = (editorRef: React.MutableRefObject<AceEditor | null>) => {
  useEffect(() => {
    const eventHandlers = [
      {
        event: "onNewFile",
        handler: () => {
          const editor = editorRef.current?.editor;
          editor?.setValue("", 1);
        },
      },
      {
        event: "onOpenFile",
        handler: (content: string) => {
          const editor = editorRef.current?.editor;
          editor?.setValue(content, -1);
        },
      },
      {
        event: "onSave",
        handler: () => {
          const content = editorRef.current?.editor.getValue();
          electronAPI.save(content);
        },
      },
    ];

    const unsubscribeFunctions = eventHandlers.map(({ event, handler }) =>
      (electronAPI as any)[event](handler)
    );

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [editorRef]);
};
