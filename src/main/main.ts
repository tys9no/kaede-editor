import { app, BrowserWindow } from 'electron';
import { WindowManager } from './managers/WindowManager';
import { QuitManager } from './managers/QuitManager';

const windowManager = new WindowManager();
const quitManager = new QuitManager();

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => windowManager.createWindow());

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.createWindow()
  }
});

app.on('before-quit', (event) => quitManager.handleAppQuit(event));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
