import * as fs from 'fs';
import { dialog } from 'electron';
import logger from '../utils/Logger';
import { TEMP_DIR } from '../constants/paths';

export class FileUtils {
  static async openFileDialog(filters: Electron.FileFilter[]): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Open File',
      properties: ['openFile'],
      filters,
    });

    return canceled || filePaths.length === 0 ? null : filePaths[0];
  }

  static async saveFileDialog(filters: Electron.FileFilter[]): Promise<string | null> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save File',
      filters,
    });

    return canceled || !filePath ? null : filePath;
  }

  static readFile(filePath: string): string | null {
    try {
      return fs.readFileSync(filePath, { encoding: 'utf8' });
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  static async writeFile(filePath: string, content: string): Promise<boolean> {
    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  static cleanTemporaryDirectory = (): void => {
    if (fs.existsSync(TEMP_DIR)) {
      try {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        logger.info('Temporary directory deleted.');
      } catch (err) {
        logger.warn(`Failed to delete temp directory: ${err}`);
      }
    }
  };
}
