import { BrowserWindow, Menu } from 'electron';

import { IS_MAC } from './constants/env';

import { FileHandler } from './ipc/handlers/FileHandler';

export const buildAppMenu = (mainWindow: BrowserWindow, fileHandler: FileHandler): Menu => {

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New', click: async () => await fileHandler.handleNewFile(mainWindow) },
        { type: 'separator' },
        { label: 'Open', click: async () => await fileHandler.handleOpenFile(mainWindow) },
        { label: 'Open New Window', click: async () => await fileHandler.handleOpenNewWindow() },
        { type: 'separator' },
        { label: 'Save', click: async () => await fileHandler.handleSaveFile(mainWindow), accelerator: IS_MAC ? 'Cmd+S' : 'Ctrl+S' },
        { label: 'Save As', click: async () => await fileHandler.handleSaveAsFile(mainWindow), accelerator: IS_MAC ? 'Cmd+Shift+S' : 'Ctrl+Shift+S' },
        { label: 'Export as HTML', click: async () => await fileHandler.handleSaveAsHtml(mainWindow), accelerator: IS_MAC ? 'Cmd+Shift+H' : 'Ctrl+Shift+H' },
        { type: 'separator' },
        IS_MAC ? { label: 'Close', role: 'close' } : { label: 'Quit', role: 'quit' },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
      ]
    },
    {
      label: 'Developer',
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
