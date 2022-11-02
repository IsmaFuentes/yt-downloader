const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const ytdl = require('ytdl-core');

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`${dependency}-version`, process.versions[dependency]);
  }
});

// https://stackoverflow.com/questions/45148110/how-to-add-a-callback-to-ipc-renderer-send

contextBridge.exposeInMainWorld('electron', {
  openDialog: (args) => ipcRenderer.invoke('open-dialog', args),
  fetchInfoFromUrl: (url) => {
    return ytdl.getInfo(url);
    // return new Promise((resolve, reject) => {
    //   ytdl
    //     .getInfo(url)
    //     .then((info) => {
    //       resolve(info);
    //     })
    //     .catch((err) => {
    //       if (err) reject(err);
    //     });
    // });
  },
  downloadFromInfo: (info, fileName, options) => {
    ytdl.downloadFromInfo(info, options).pipe(fs.createWriteStream(fileName));
  },
});
