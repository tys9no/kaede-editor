import { BrowserWindow, Menu } from 'electron';
import * as fs from 'fs';
import path from 'path';
import logger from '../utils/Logger';
import { TEMP_DIR } from '../constants/paths';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, APP_TITLE } from '../constants/settings';
import { IS_DEV } from '../constants/env';
import { buildAppMenu } from '../menu';
import { FileHandler } from '../ipc/handlers/FileHandler';
import { ProcessHandler } from '../ipc/handlers/ProcessHandler';
import FileManager from '../managers/FileManager';
import ProcessManager from '../managers/ProcessManager';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private fileManager = FileManager.getInstance();
  private processManager = ProcessManager.getInstance();
  private fileHandler: FileHandler;
  private processHandler: ProcessHandler;

  constructor() {
    this.fileHandler = new FileHandler(this.fileManager);
    this.processHandler = new ProcessHandler(this.processManager);
  }

  private setupTempDir(): void {
    if (!fs.existsSync(TEMP_DIR)) {
      try {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
      } catch (error) {
        logger.error(`Failed to create directory: ${error}`);
      }
    }
  }

  private getWindowOptions(): Electron.BrowserWindowConstructorOptions {
    const iconPath = IS_DEV
      ? path.join(__dirname, 'assets/icon.png')
      : path.join(process.resourcesPath, 'assets/icon.png');

    return {
      height: DEFAULT_WINDOW_HEIGHT,
      width: DEFAULT_WINDOW_WIDTH,
      title: APP_TITLE,
      icon: iconPath,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    };
  }

  private registerHandlers(): void {
    this.fileHandler.registerFileHandlers();
    this.processHandler.registerProcessHandlers();
  }

  public createWindow(): BrowserWindow {
    this.setupTempDir();

    const options = this.getWindowOptions();
    this.mainWindow = new BrowserWindow(options);

    this.registerHandlers();

    const menu = buildAppMenu(this.mainWindow, this.fileHandler);
    Menu.setApplicationMenu(menu);

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (IS_DEV) {
      this.mainWindow.webContents.openDevTools();
    }

    return this.mainWindow;
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}
