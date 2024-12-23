import { app, BrowserWindow, ipcMain } from "electron";

import { spawn } from "child_process";

import { SaveFileContext } from '../strategies/save/SaveFileContext';
import { SaveFileStrategyImpl } from '../strategies/save/SaveFileStrategyImpl';
import { ExportContext } from '../strategies/export/ExportContext';
import { ExportHtmlStrategyImpl } from '../strategies/export/ExportHtmlStrategyImpl';

import FileManager from "../../managers/FileManager";
import { FileUtils } from "../../Utils/FileUtils";

export class FileHandler {
  constructor(private fileManager: FileManager) { }

  registerFileHandlers(): void {
    ipcMain.on("save-file", async (_event, content) => {
      let filePath = this.fileManager.getCurrentFilePath();
      if (!filePath) {
        filePath = await FileUtils.saveFileDialog([{ name: "Markdown File", extensions: ["md"] }]);
        if (!filePath) {
          return;
        }
        this.fileManager.setCurrentFilePath(filePath);
      }
      try {
        const context = new SaveFileContext(new SaveFileStrategyImpl(filePath));
        await context.save(content);
      } catch (error) {
        console.log(error);
      }
    });

    ipcMain.on("export-as-html", async (_event, content) => {
      const filePath = await FileUtils.saveFileDialog([{ name: "HTML File", extensions: ["html"] }]);
      if (!filePath) {
        return;
      }
      try {
        const context = new ExportContext(new ExportHtmlStrategyImpl(filePath));
        await context.export(content);
      } catch (error) {
        console.log(error);
      }
    });
  }


  async handleNewFile(mainWindow: BrowserWindow): Promise<void> {
    this.fileManager.clearCurrentFilePath();
    mainWindow.webContents.send('new')
  }

  async handleOpenFile(mainWindow: BrowserWindow): Promise<void> {
    const filePath = await FileUtils.openFileDialog([{ name: "Markdown File", extensions: ["md"] }]);
    if (!filePath) {
      return;
    }

    this.fileManager.setCurrentFilePath(filePath);

    const fileData = FileUtils.readFile(filePath);
    if (!fileData) {
      return;
    }

    // レンダラプロセスにデータを送信
    mainWindow.webContents.send("open", fileData);
  }

  async handleOpenNewWindow(): Promise<void> {
    const exePath = app.getPath("exe");
    const child = spawn(exePath, [], {
      detached: true,
      stdio: "ignore",
    });

    child.unref();
  }

  async handleSaveFile(mainWindow: BrowserWindow): Promise<void> {
    mainWindow.webContents.send('save')
  }

  async handleSaveAsFile(mainWindow: BrowserWindow): Promise<void> {
    console.log(this.fileManager.getCurrentFilePath());
    this.fileManager.clearCurrentFilePath();
    console.log(this.fileManager.getCurrentFilePath());
    mainWindow.webContents.send('save')
  }

  async handleSaveAsHtml(mainWindow: BrowserWindow): Promise<void> {
    mainWindow.webContents.send('export-as-html')
  }

}