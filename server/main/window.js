import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { windowMessageHandler } from './window-messages/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

let w

export const Window = {
    create: () => {
        w = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        w.setMenuBarVisibility(false);

        if (process.env.NODE_ENV === 'development') {
            w.loadURL('http://localhost:5173');
            w.webContents.openDevTools();
        } else {
            w.loadFile(path.join(__dirname, 'dist/index.html'));
        }

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
