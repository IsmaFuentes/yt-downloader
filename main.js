const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

/**
 * All of this was done following Electron's official guide:
 * https://www.electronjs.org/docs/latest/tutorial/quick-start
 * https://stackoverflow.com/questions/45148110/how-to-add-a-callback-to-ipc-renderer-send
 */

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadFile('src/index.html');
  ipcMain.handle('open-dialog', async (event, args) => {
    const dialogResult = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return dialogResult;
  });
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
