module.exports = {
  app: {
    on: jest.fn(),
    quit: jest.fn(),
  },
  BrowserWindow: jest.fn(() => ({
    loadURL: jest.fn(),
    webContents: { openDevTools: jest.fn() },
    on: jest.fn(),
  })),
  Menu: {
    setApplicationMenu: jest.fn(),
  },
};
