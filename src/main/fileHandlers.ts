import { app, BrowserWindow } from "electron";

import { spawn } from "child_process";

import FileState from "./FileState";
import { selectFile, readFile } from "./fileUtils";


export const handleNewFile = async (mainWindow: BrowserWindow): Promise<void> => {
  const fileState = FileState.getInstance();
  fileState.setCurrentFilePath("");
  mainWindow.webContents.send('new')
}


export const handleOpenFile = async (mainWindow: BrowserWindow): Promise<void> => {
  const fileState = FileState.getInstance();

  // ファイルを選択
  const filePath = await selectFile([{ name: "Markdown File", extensions: ["md"] }]);
  if (!filePath) {
    return;
  }

  // ファイルパスを状態に保存
  fileState.setCurrentFilePath(filePath);

  // ファイルを読み込む
  const fileData = readFile(filePath);
  if (!fileData) {
    return;
  }

  // レンダラプロセスにデータを送信
  mainWindow.webContents.send("open", fileData);
};

export const handleOpenNewWindow = async (): Promise<void> => {
  const exePath = app.getPath("exe");
  const child = spawn(exePath, [], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
}

export const handleSaveFile = async (mainWindow: BrowserWindow): Promise<void> => {
  mainWindow.webContents.send('save', false)
}

export const handleSaveAsFile = async (mainWindow: BrowserWindow): Promise<void> => {
  mainWindow.webContents.send('save', true)
}

export const handleSaveAsHtml = async (mainWindow: BrowserWindow): Promise<void> => {
  mainWindow.webContents.send('save-html')
}

