const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('to-main', message),
  onReceiveMessage: (callback) => ipcRenderer.on('from-main', (event, ...args) => callback(...args))
});