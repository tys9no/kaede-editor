import { ipcMain } from 'electron';
import { exec } from 'child_process';

import * as fs from 'fs';
import * as path from 'path';

import log from 'electron-log';

import { TEMP_DIR, PLANTUML_PATH } from '../../constants/paths';
import ProcessManager from '../../managers/ProcessManager';

export class ProcessHandler {
  constructor(private processManager: ProcessManager) { }

  registerProcessHandlers(): void {
    ipcMain.handle('request-and-cache-svg', (_event, values) => {
      log.info('Start generate SVG File.');
      const content = '@startuml\n' + values[0] + '@enduml\n';

      const tempPUFilePath = path.join(TEMP_DIR, `temp_${values[1]}.pu`);
      const tempSVGFilePath = path.join(TEMP_DIR, `temp_${values[1]}.svg`);

      const command = `java -jar ${PLANTUML_PATH} -svg ${tempPUFilePath} -charset UTF-8`;

      fs.writeFileSync(tempPUFilePath, content, { encoding: 'utf8' });

      return new Promise((resolve, reject) => {
        const process = exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
          if (error) {
            log.error(error);
            log.error(stderr);
            if (fs.existsSync(tempSVGFilePath)) {
              fs.unlinkSync(tempPUFilePath);
              fs.unlinkSync(tempSVGFilePath);
            }
            reject('');
          } else {
            log.info(stdout);
            if (fs.existsSync(tempSVGFilePath)) {
              const svg = fs.readFileSync(tempSVGFilePath, { encoding: 'utf8' });
              fs.unlinkSync(tempPUFilePath);
              fs.unlinkSync(tempSVGFilePath);
              resolve(svg);
            } else {
              resolve('');
            }
          }
        });
        this.processManager.add(process);
      })
    })
  }
}
