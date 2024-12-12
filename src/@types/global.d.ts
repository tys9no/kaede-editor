declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export interface IElectronAPI {
  onNewFile: (listener: () => void) => () => void;
  onOpenFile: (listener: (value: string) => void) => () => void;
  onSave: (listener: (isSaveAs:boolean) => void) => () => void;
  sendEditorValue(editorValue?: string, isSaveAs:boolean): void;
  onSaveHtml: (listener: () => void) => () => void;
  sendHtml(markdownValue: string): void;
  getSVG(values: string[]): Promise<string>;

}