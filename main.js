const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
try {
  require('electron-reloader')(module);
} catch {}

/**
 * Electron official guide:
 * https://www.electronjs.org/docs/latest/tutorial/quick-start
 * https://stackoverflow.com/questions/45148110/how-to-add-a-callback-to-ipc-renderer-send
 */

// Force using discrete GPU when there are multiple GPUs available.
// app.commandLine.appendSwitch('force_high_performance_gpu');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    resizable: false,
    icon: path.join(__dirname, 'yt-downloader.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
    },
  });

  win.loadFile('src/index.html');
  // options menu with devtools
  if (process.env.ENVIRONMENT !== 'dev') {
    win.removeMenu();
  }

  ipcMain.handle('open-dialog', async (event, { title }) => {
    const dialogResult = await dialog.showOpenDialog({ properties: ['openDirectory'], title });
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
