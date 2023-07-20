const { contextBridge, ipcRenderer } = require('electron');
const { YouTubeDownloader } = require('./ytdl');

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld('electron', {
  YouTubeDownloader,
  NativeMethods: {
    openDialog: async (args) => ipcRenderer.invoke('open-dialog', args),
  },
});
