import { app, BrowserWindow, ipcMain } from 'electron';
import { Window } from './main/window.js'
import { Browser } from './main/browser.js';

app.whenReady().then(() => {
  Window.create();
  Browser.init();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const shutdown = () => {
  Browser.stop();
  if (process.platform !== 'darwin') app.quit();
}

app.on('window-all-closed', () => {
  shutdown()
});

process.on("unhandledRejection", (e) => {
  console.error(e)
  process.exit(1)
})

process.on("uncaughtException", (e) => {
  console.error(e)
  process.exit(1)
})

// Clean shutdown
process.on("SIGINT", () => {
  shutdown()
});