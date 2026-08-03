import { app, BrowserWindow } from 'electron';
import { Server } from './main/server.js';

app.whenReady().then(() => {
  Server.connect();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})

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
  Server.disconnect()
});