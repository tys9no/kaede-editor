import { app } from 'electron';
import logger from '../utils/Logger';
import { FileUtils } from '../utils/FileUtils';
import ProcessManager from '../managers/ProcessManager';

export class QuitManager {
  private isQuitting = false;
  private processManager = ProcessManager.getInstance();

  public async handleAppQuit(event: Electron.Event): Promise<void> {
    if (this.isQuitting) return;
    this.isQuitting = true;

    event.preventDefault();

    try {
      logger.info('Waiting for all processes to terminate...');
      await this.processManager.terminateAll();
    } catch (error) {
      logger.error('Error terminating processes.');
      logger.error(error);
    } finally {
      FileUtils.cleanTemporaryDirectory();
      app.quit();
    }
  }
}
