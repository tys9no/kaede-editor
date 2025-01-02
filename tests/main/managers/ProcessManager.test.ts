import { ChildProcess } from 'child_process';
import ProcessManager from "../../../src/main/managers/ProcessManager";

describe('ProcessManager', () => {
  let processManager: ProcessManager;
  let mockProcess: ChildProcess;

  beforeEach(() => {
    jest.clearAllMocks();
    processManager = ProcessManager.getInstance();

    mockProcess = {
      pid: 1234,
      kill: jest.fn(),
      on: jest.fn(),
    } as unknown as ChildProcess;

    jest.mock('../../../src/main/utils/Logger', () => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }));

  });

  it('should be the number is 0 for terminalAll method.', async () => {
    processManager.add(mockProcess);

    (mockProcess.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'exit') {
        setTimeout(() => callback(), 10);
      }
      return mockProcess;
    });

    await processManager.terminateAll();
    expect(processManager.getProcessCount()).toBe(0);
  }, 10000);


});
