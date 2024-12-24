import log from 'electron-log';

class Logger {
  private static instance: Logger;

  private constructor() {
    // ファイル出力設定
    log.transports.file.level = 'info'; // ログレベルを "info" に設定
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';
    log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB

    // コンソール出力設定
    log.transports.console.level = 'debug';
    log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  public info(message: string): void {
    log.info(message);
  }

  public warn(message: string): void {
    log.warn(message);
  }

  public error(error: unknown): void {
    const errorMessage = this.getErrorMessage(error);
    log.error(errorMessage);
  }

  public debug(message: string): void {
    log.debug(message);
  }
}

export default Logger.getInstance();
