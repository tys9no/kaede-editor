import FileManager from "../../../src/main/managers/FileManager";

describe('FileManager', () => {
  let fileManager: FileManager;

  beforeEach(() => {
    fileManager = FileManager.getInstance();
  })

  it('should return the same instance for getInstance Method.', () => {
    const anothorInstance = FileManager.getInstance();
    expect(fileManager).toBe(anothorInstance);
  });

  it('should set and get the current path.', () => {
    const path = 'mock/path/test.txt';
    fileManager.setCurrentFilePath(path);
    expect(fileManager.getCurrentFilePath()).toBe(path);
  });

  it('should clear the current path.', () => {
    const path = 'mock/path/test.txt';
    fileManager.setCurrentFilePath(path);
    fileManager.clearCurrentFilePath();
    expect(fileManager.getCurrentFilePath()).toBeNull();
  });

  it('should restore a first file path when setting the new path.', () => {
    const firstPath = 'mock/path/test1.txt';
    const secondPath = 'mock/path/test2.txt';
    fileManager.setCurrentFilePath(firstPath);
    fileManager.setCurrentFilePath(secondPath);
    fileManager.restorePreviousFilePath();
    expect(fileManager.getCurrentFilePath()).toBe(firstPath);
  });

  it('should restore a first file path when clearing.', () => {
    const firstPath = 'mock/path/test1.txt';
    fileManager.setCurrentFilePath(firstPath);
    fileManager.clearCurrentFilePath();
    fileManager.restorePreviousFilePath();
    expect(fileManager.getCurrentFilePath()).toBe(firstPath);
  });

  it('should be null for path when restoring without setting.', () => {
    fileManager.restorePreviousFilePath();
    expect(fileManager.getCurrentFilePath()).toBeNull();
  });

});
