import { app, BrowserWindow, Menu } from 'electron';

import * as fs from "fs";

import log from 'electron-log';

import { IS_DEV, TEMP_DIR } from './constants';
import { buildAppMenu } from './menu';

import FileManager from './managers/FileManager';
const fileManager = FileManager.getInstance();
import ProcessManager from './managers/ProcessManager';
const processManager = ProcessManager.getInstance();

import { FileHandler } from './ipc/handlers/FileHandler';
import { ProcessHandler } from './ipc/handlers/ProcessHandler';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let isQuitting = false;     // アプリが終了中かを示すフラグ

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the temp directroy.
  if (!fs.existsSync(TEMP_DIR)) {
    try {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory: ${error}`);
    }
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 810,
    width: 1440,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Registaer IPC Handlers.
  const fileHandler = new FileHandler(fileManager);
  fileHandler.registerFileHandlers();
  const processHandler = new ProcessHandler(processManager);
  processHandler.registerProcessHandlers();

  // Create the menu.
  const menu = buildAppMenu(mainWindow, fileHandler);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (IS_DEV) {
    mainWindow.webContents.openDevTools();
  }

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

const cleanTemporaryDirectory = (): void => {
  if (fs.existsSync(TEMP_DIR)) {
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      log.info("Temporary directory deleted.");
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
    log.info("Waiting for all processes to terminate...");
    await processManager.terminateAll();
  } catch (error) {
    log.error(`Error terminating processes: ${error}`);
  } finally {
    cleanTemporaryDirectory();
    app.quit();
  }
}
app.on('before-quit', handleAppQuit);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
