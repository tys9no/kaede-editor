import * as fs from "fs";
import { dialog } from "electron";

export const selectFile = async (
  filters: Electron.FileFilter[]
): Promise<string | null> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "ファイルを開く",
    properties: ["openFile"],
    filters,
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }

  return filePaths[0];
};

export const saveFileDialog = async (
  filters: Electron.FileFilter[]
): Promise<string | null> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "ファイルを保存",
    filters,
  });

  if (canceled || !filePath) {
    return null;
  }

  return filePath;
};

export const readFile = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, { encoding: "utf8" });
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    return null;
  }
};
