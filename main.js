const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * All of this was done following Electron's official guide:
 * https://www.electronjs.org/docs/latest/tutorial/quick-start
 */

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('src/index.html');
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
