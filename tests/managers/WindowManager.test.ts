import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import logger from '../../src/main/utils/Logger';
import { WindowManager } from '../../src/main/managers/WindowManager';
import { TEMP_DIR } from '../../src/main/constants/paths';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, APP_TITLE } from '../../src/main/constants/settings';
import path from 'path';

jest.mock('fs');
jest.mock('../../src/main/utils/Logger');

describe('WindowManager', () => {
  let windowManager: WindowManager;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    windowManager = new WindowManager();
  });

  describe('setupTempDir', () => {
    it('should create TEMP_DIR if it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        // 
      });

      windowManager['setupTempDir']();

      expect(fs.existsSync).toHaveBeenCalledWith(TEMP_DIR);
      expect(fs.mkdirSync).toHaveBeenCalledWith(TEMP_DIR, { recursive: true });
    });

    it('should not create TEMP_DIR if it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      windowManager['setupTempDir']();

      expect(fs.existsSync).toHaveBeenCalledWith(TEMP_DIR);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should log an error if creating TEMP_DIR fails', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to create directory');
      });

      windowManager['setupTempDir']();

      expect(fs.existsSync).toHaveBeenCalledWith(TEMP_DIR);
      expect(fs.mkdirSync).toHaveBeenCalledWith(TEMP_DIR, { recursive: true });
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create directory')
      );
    });
  });

  describe('getWindowOptions', () => {
    beforeEach(() => {
      jest.resetModules(); 
    });    
    Object.defineProperty(process, 'resourcesPath', {
      value: __dirname,
      writable: true,
    });

    (global as any).MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY = '/mocked/preload.js'

    it('should set the height to DEFAULT_WINDOW_HEIGHT', () => {
      const options: Electron.BrowserWindowConstructorOptions = windowManager['getWindowOptions']();
      expect(options.height).toBe(DEFAULT_WINDOW_HEIGHT);
    });
  
    it('should set the width to DEFAULT_WINDOW_WIDTH', () => {
      const options: Electron.BrowserWindowConstructorOptions = windowManager['getWindowOptions']();
      expect(options.width).toBe(DEFAULT_WINDOW_WIDTH);
    });
  
    it('should set the title to APP_TITLE', () => {
      const options: Electron.BrowserWindowConstructorOptions = windowManager['getWindowOptions']();
      expect(options.title).toBe(APP_TITLE);
    });

    it('should set the icon path correctly in development mode', () => {
      process.env.NODE_ENV = 'development';
      const options: Electron.BrowserWindowConstructorOptions = windowManager['getWindowOptions']();
      expect(options.icon).toBe( path.join(__dirname, 'assets/icon.png'));
    });

    it('should set the icon path correctly in production mode', () => {
      process.env.NODE_ENV = 'production';
      const options: Electron.BrowserWindowConstructorOptions = windowManager['getWindowOptions']();
      expect(options.icon).toBe(path.join(process.resourcesPath, 'assets/icon.png'));
    });    
  });

  describe('registerHandlers', () => {
    //
  });

  describe('getMainWindow', () => {
    it('should return null when no mainWindow is set', () => {
      const mainWindow = windowManager.getMainWindow();

      expect(mainWindow).toBeNull();
    });

    it('should return the mainWindow after it is created', () => {
      const mockBrowserWindow = new BrowserWindow();
      windowManager['mainWindow'] = mockBrowserWindow;

      const mainWindow = windowManager.getMainWindow();

      expect(mainWindow).toBe(mockBrowserWindow);
    });
  });
});