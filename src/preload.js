const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`${dependency}-version`, process.versions[dependency]);
  }
});

// contextBridge.exposeInMainWorld('electron', {
//   openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
// });
