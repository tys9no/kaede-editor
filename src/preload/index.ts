import { contextBridge, IpcRendererEvent, ipcRenderer } from 'electron'

type Listener<T = void> = (data: T) => void;

const createChannelHandler = <T = void>(channel: string) => {
  return (listener: Listener<T>) => {
    ipcRenderer.on(channel, (_event: IpcRendererEvent, data: T) => listener(data));
    return () => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
}

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    onNewFile: createChannelHandler<void>('new'),
    onOpenFile: createChannelHandler<string>('open'),

    getSVG: (value: string) => ipcRenderer.invoke('get-svg', value),

    onSave: createChannelHandler<void>('save'),
    save: (content: string) => ipcRenderer.send('save-file', content),

    onExportAsHtml: createChannelHandler<void>('export-as-html'),
    exportAsHtml: (content: string) => ipcRenderer.send('export-as-html', content)
  }
);
