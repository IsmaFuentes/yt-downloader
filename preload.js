const { contextBridge, ipcRenderer } = require('electron');

const fs = require('fs');
const ytdl = require('ytdl-core');

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld('electron', {
  openDialog: (args) => ipcRenderer.invoke('open-dialog', args),
  fetchInfoFromUrl: (url) => ytdl.getInfo(url),
  downloadFromInfo: async (info, fileName, options) => {
    return new Promise((resolve, reject) => {
      try {
        ytdl.downloadFromInfo(info, options).pipe(fs.createWriteStream(fileName));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },
});
