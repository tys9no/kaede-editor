class FileState {

  private static instance: FileState;
  private currentFilePath: string | null = null;

  private constructor() { }

  public static getInstance(): FileState {
    if (!FileState.instance) {
      FileState.instance = new FileState();
    }
    return FileState.instance;
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

export default FileState;