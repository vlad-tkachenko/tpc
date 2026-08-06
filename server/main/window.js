import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { windowMessageHandler } from './window-messages/index.js';
import { randomUUID } from 'node:crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

let w

export const Window = {
    event: (type, data) => {
        w?.webContents.send('from-main', {
            id: randomUUID(),
            ok: true,
            type,
            data,
        });
    },

    openDevTools: () => {
        w?.webContents.openDevTools();
    },

    send: {
        error: (id, error) => {
            w?.webContents.send('from-main', {
                id,
                ok: false,
                error,
            });
        },

        ok: (id, data) => {
            w?.webContents.send('from-main', {
                id,
                ok: true,
                data,
            });
        },
    },

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
        } else {
            w.loadFile(path.join(__dirname, 'dist/index.html'));
        }

        ipcMain.on('to-main', (event, msg) => {
            windowMessageHandler(msg)
        });

        ipcMain.on('from-main', (event, msg) => {
            w.webContents.send('from-main', msg);
        })

        return w
    }
}
