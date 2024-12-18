import { app, ipcMain } from 'electron';
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import os from "os";
import log from "electron-log";

import { IS_DEV } from "../constants";
import ProcessManager from "../ProcessManager";
const processManager = ProcessManager.getInstance();

const tempDir = path.join(os.tmpdir(), "kaede-pu");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const registerProcessHandlers = (): void => {
  ipcMain.handle("get-svg", (_event, values) => {
    log.info('Start generate SVG File.');
    const content = "@startuml\n" + values[0] + "@enduml\n";

    const plantUMLPath = IS_DEV
      ? path.join(__dirname, 'resources', 'plantuml.jar')
      : path.join(path.dirname(app.getPath('exe')), 'resources', 'plantuml.jar')

    const tempPUFilePath = path.join(tempDir, `temp_${values[1]}.pu`);
    const tempSVGFilePath = path.join(tempDir, `temp_${values[1]}.svg`);

    const command = `java -jar "${plantUMLPath}" -svg "${tempPUFilePath}" -charset UTF-8`;

    fs.writeFileSync(tempPUFilePath, content, { encoding: "utf8" });

    return new Promise((resolve, reject) => {
      const process = exec(command, { encoding: "utf8" }, (error, stdout, stderr) => {
        if (error) {
          log.error(error);
          log.error(stderr);
          if (fs.existsSync(tempSVGFilePath)) {
            console.log("error -> unlinksync")
            fs.unlinkSync(tempPUFilePath);
            fs.unlinkSync(tempSVGFilePath);
          }
          reject("");
        } else {
          log.info(stdout);
          if (fs.existsSync(tempSVGFilePath)) {
            console.log("svg -> unlinksync")
            const svg = fs.readFileSync(tempSVGFilePath, { encoding: "utf8" });
            fs.unlinkSync(tempPUFilePath);
            fs.unlinkSync(tempSVGFilePath);
            resolve(svg);
          } else {
            resolve("");
          }
        }
      });
      processManager.add(process);
    })
  })
}