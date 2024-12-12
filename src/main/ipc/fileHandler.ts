import { ipcMain, dialog } from "electron";
import * as fs from "fs";
import path from "path";
import ejs from "ejs";
import FileState from "../FileState";

const fileState = FileState.getInstance();

export const registerFileHandlers = (): void => {
  ipcMain.on("send-editor-value", async (_event, value, isSaveAs) => {
    let saveFilePath = fileState.getCurrentFilePath() ?? "";

    if (isSaveAs || !saveFilePath) {
      const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: "Markdown File", extensions: ["md"] }],
      });
      if (canceled || !filePath) return;

      saveFilePath = filePath;
      fileState.setCurrentFilePath(saveFilePath);
    }

    if (saveFilePath) {
      fs.writeFile(saveFilePath, value, (error) => {
        if (error) {
          console.error("Save error:", error);
        }
      });
    }
  });

  ipcMain.on("send-html", async (_event, value) => {
    console.log(__dirname);
    const templatePath = path.join(__dirname, "templates", "index.ejs");
    const jsFilePath = path.join(__dirname, "templates", "mermaid.min.js");

    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const jsContent = await fs.promises.readFile(jsFilePath, "utf-8");
      const renderedHtml = ejs.render(template, { htmlContent: value, jsContent });

      const { filePath, canceled } = await dialog.showSaveDialog({
        title: "HTMLファイルを保存",
        filters: [{ name: "HTML File", extensions: ["html"] }],
      });

      if (!canceled && filePath) {
        await fs.promises.writeFile(filePath, renderedHtml, "utf-8");
      }
    } catch (error) {
      console.error("HTML生成エラー:", error);
    }
  });
};
