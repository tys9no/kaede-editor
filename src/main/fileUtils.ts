import * as fs from "fs";
import { dialog } from "electron";

// ファイルを選択してパスを取得
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

// ファイルを読み込む
export const readFile = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, { encoding: "utf8" });
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    return null;
  }
};
