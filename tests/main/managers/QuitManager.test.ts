/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuitManager } from '../../../src/main/managers/QuitManager'

describe('QuitManager', () => {
  let quitManager: QuitManager;
  let mockEvent: Electron.Event;

  beforeEach(() => {
    jest.clearAllMocks();
    quitManager = new QuitManager();
    mockEvent = { preventDefault: jest.fn() } as unknown as Electron.Event;
  });

  it('should be true when calling handleAppQuit.', async () => {
    const result = await quitManager.handleAppQuit(mockEvent);
    expect(result).toBe(true);
  })

  it('should be true when calling handleAppQuit and quitting.', async () => {
    (quitManager as any).isQuitting = true;
    const result = await quitManager.handleAppQuit(mockEvent);
    expect(result).toBe(false);
  })
});
