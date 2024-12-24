class FileManager {
  private static instance: FileManager;
  private currentFilePath: string | null = null;
  private previousFilePath: string | null = null;

  private constructor() { }

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  public getCurrentFilePath(): string | null {
    return this.currentFilePath;
  }

  public setCurrentFilePath(filePath: string | null): void {
    this.backupCurrentFilePath();
    this.currentFilePath = filePath;
  }

  public clearCurrentFilePath(): void {
    this.backupCurrentFilePath();
    this.currentFilePath = null;
  }

  private backupCurrentFilePath(): void {
    this.previousFilePath = this.currentFilePath;
  }

  public restorePreviousFilePath(): void {
    this.currentFilePath = this.previousFilePath;
    this.previousFilePath = null;
  }
}

export default FileManager;
