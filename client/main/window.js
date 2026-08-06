import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { windowMessageHandler } from './window-messages/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

let w

export const Window = {
    close: () => {
        w?.destroy();
        w = null;
    },

    show: (htmlPath, opts = {
        fullscreen: false,
        locked: false,
    }) => {
        Window.close()
        w = new BrowserWindow({
            width: 800,
            height: 600,
            fullscreen: opts.fullscreen,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
            kiosk: opts.locked,
            show: false,
        });

        w.setMenuBarVisibility(false);
        w.loadFile(htmlPath);

        if (opts.locked) {
            w.setAlwaysOnTop(true, 'screen-saver');

            w.on('blur', () => {
                w.focus();
                w.setAlwaysOnTop(true, 'screen-saver');
            });
        }

        ipcMain.on('to-main', (event, arg) => {
            windowMessageHandler(arg);
        });

        w.once('ready-to-show', () => {
            w.show()
            w.focus()
        })

        w.on('close', (e) => {
            if (opts.locked) {
                e.preventDefault();
            }
        });

        w.webContents.openDevTools();
    }
}
