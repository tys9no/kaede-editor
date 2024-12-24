import { app, BrowserWindow, Menu } from 'electron';

import * as fs from 'fs';

import log from 'electron-log';

import { TEMP_DIR } from './constants/paths';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH } from './constants/settings';
import { IS_DEV } from './constants/env';

import { buildAppMenu } from './menu';

import FileManager from './managers/FileManager';
const fileManager = FileManager.getInstance();

import ProcessManager from './managers/ProcessManager';
const processManager = ProcessManager.getInstance();

import { FileHandler } from './ipc/handlers/FileHandler';
import { ProcessHandler } from './ipc/handlers/ProcessHandler';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let isQuitting = false;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  if (!fs.existsSync(TEMP_DIR)) {
    try {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory: ${error}`);
    }
  }

  const mainWindow = new BrowserWindow({
    height: DEFAULT_WINDOW_HEIGHT,
    width: DEFAULT_WINDOW_WIDTH,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  const fileHandler = new FileHandler(fileManager);
  fileHandler.registerFileHandlers();
  const processHandler = new ProcessHandler(processManager);
  processHandler.registerProcessHandlers();

  const menu = buildAppMenu(mainWindow, fileHandler);
  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (IS_DEV) {
    mainWindow.webContents.openDevTools();
  }

};

app.on('ready', createWindow);

const cleanTemporaryDirectory = (): void => {
  if (fs.existsSync(TEMP_DIR)) {
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      log.info('Temporary directory deleted.');
    } catch (err) {
      log.warn(`Failed to delete temp directory: ${err}`);
    }
  }
};

const handleAppQuit = async (event: Electron.Event): Promise<void> => {
  if (isQuitting) return;
  isQuitting = true;

  event.preventDefault();
  try {
    log.info('Waiting for all processes to terminate...');
    await processManager.terminateAll();
  } catch (error) {
    log.error(`Error terminating processes: ${error}`);
  } finally {
    cleanTemporaryDirectory();
    app.quit();
  }
}
app.on('before-quit', handleAppQuit);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
