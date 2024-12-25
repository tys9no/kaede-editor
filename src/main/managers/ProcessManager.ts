import { ChildProcess } from 'child_process';
import logger from '../utils/Logger';

class ProcessManager {
  private static instance: ProcessManager;
  private processes: Set<ChildProcess> = new Set();

  private constructor() { }

  public static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }

  public add(process: ChildProcess): void {
    this.processes.add(process);

    process.on('exit', () => {
      this.processes.delete(process);
      logger.info('Process exited and removed from manager.');      
    });
  }

  public async terminateAll(): Promise<void> {
    const terminationPromises = Array.from(this.processes).map((process) =>
      new Promise<void>((resolve, reject) => {
        let isExited = false;

        process.on('exit', () => {
          isExited = true;
          logger.info(`Process with PID ${process.pid} exited.`);
          
          resolve();
        });

        process.on('error', (error) => {
          if (!isExited) {
            logger.error(`Error in process with PID ${process.pid}.`);
            logger.error(error);
            reject(error);
          }
        });

        logger.info(`Sending SIGTERM to process with PID ${process.pid}`);
        process.kill('SIGTERM');

        const timeout = setTimeout(() => {
          if (!isExited) {
            logger.warn(
              `Process with PID ${process.pid} did not exit in time. Sending SIGKILL.`
            );
            process.kill('SIGKILL');
            resolve();
          }
        }, 5000);

        process.on('exit', () => clearTimeout(timeout));
      })
    );

    await Promise.all(terminationPromises);
    logger.info('All processes have been terminated.');
  }

  public getProcessCount(): number {
    return this.processes.size;
  }
}

export default ProcessManager;
