// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, IpcRendererEvent, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    onNewFile:
      (listener: () => void) => {
        ipcRenderer.on(
          'new',
          () => listener()
        );
        return () => {
          ipcRenderer.removeAllListeners('new')
        }
      },    
    onOpenFile:
      (listener: (value: string) => void) => {
        ipcRenderer.on(
          'open',
          (_event: IpcRendererEvent, value: string) => listener(value)
        );
        return () => {
          ipcRenderer.removeAllListeners('open-file')
        }
      },
    onSave:
      (listener: (isSaveAs: boolean) => void) => {
        ipcRenderer.on('save', (_event: IpcRendererEvent, isSaveAs: boolean) => listener(isSaveAs))
        return () => {
          ipcRenderer.removeAllListeners('save')
        }
      },
    sendEditorValue:
      (editorValue: string, isSaveAs:boolean) => ipcRenderer.send('send-editor-value', editorValue, isSaveAs),

    onSaveHtml:
      (listener: () => void) => {
        ipcRenderer.on('save-html', () => listener())
        return () => {
          ipcRenderer.removeAllListeners('save-html')
        }
      },
    sendHtml:
      (html: string) => ipcRenderer.send('send-html', html),

    getSVG:
      (value: string) => ipcRenderer.invoke('get-svg', value),
  }
);