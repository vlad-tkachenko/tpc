import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { windowMessageHandler } from './window-messages/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const Window = {
    create: () => {
        const w = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        w.setMenuBarVisibility(false);
        w.loadFile('index.html');

        ipcMain.on('to-main', (event, msg) => {
            windowMessageHandler(msg)
        });

        ipcMain.on('from-main', (event, msg) => {
            w.webContents.send('from-main', arg);
        })

        w.webContents.openDevTools();

        return w
    }
}
