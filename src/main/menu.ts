import { BrowserWindow, Menu } from "electron";

import { IS_MAC } from "./constants";

import { FileHandler } from "./ipc/handlers/FileHandler";

export const buildAppMenu = (mainWindow: BrowserWindow, fileHandler:FileHandler): Menu => {

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "ファイル",
      submenu: [
        { label: '新規作成', click: async () => await fileHandler.handleNewFile(mainWindow) },
        { type: 'separator' },
        { label: '開く', click: async () => await fileHandler.handleOpenFile(mainWindow) },
        { label: '新しいウィンドウを開く', click: async () => await fileHandler.handleOpenNewWindow() },
        { type: 'separator' },
        { label: '保存', click: async () => await fileHandler.handleSaveFile(mainWindow), accelerator: IS_MAC ? 'Cmd+S' : 'Ctrl+S' },
        { label: '名前をつけて保存', click: async () => await fileHandler.handleSaveAsFile(mainWindow), accelerator: IS_MAC ? 'Cmd+Shift+S' : 'Ctrl+Shift+S' },
        { label: 'HTML形式で出力', click: async () => await fileHandler.handleSaveAsHtml(mainWindow), accelerator: IS_MAC ? 'Cmd+Shift+H' : 'Ctrl+Shift+H' },
        { type: 'separator' },
        IS_MAC ? { label: '閉じる', role: 'close' } : { label: '閉じる', role: 'quit' },
      ]
    },
    {
      label: "編集",
      submenu: [
        { role: 'undo', label: '元に戻す' },
        { role: 'redo', label: 'やり直す' },
        { type: 'separator' },
        { role: 'cut', label: '切り取り' },
        { role: 'copy', label: 'コピー' },
        { role: 'paste', label: '貼り付け' },
      ]
    },
    {
      label: '開発用',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]
  return Menu.buildFromTemplate(template);
}