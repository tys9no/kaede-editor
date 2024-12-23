class FileManager {

  private static instance: FileManager;
  private currentFilePath: string | null = null;

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
    this.currentFilePath = filePath;
  }

  public clearCurrentFilePath(): void {
    this.currentFilePath = null;
  }

}

export default FileManager;