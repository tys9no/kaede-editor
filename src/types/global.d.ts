export interface IElectronAPI {
  onNewFile: (listener: () => void) => () => void;
  onOpenFile: (listener: (value: string) => void) => () => void;
  getSVG(values: string[]): Promise<string>;
  onSave: (listener: () => void) => () => void;
  save(content?: string): void;
  onExportAsHtml: (listener: () => void) => () => void;
  exportAsHtml(content?: string): void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
