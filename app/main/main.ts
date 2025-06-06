// Main Electron process: creates browser window, loads renderer, sets up context isolation

console.log('ELECTRON process.env.NODE_ENV:', process.env.NODE_ENV);

import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// Disable GPU acceleration to prevent white/blank screen issues
process.env.ELECTRON_DISABLE_GPU = 'true';          // hard disable GPU
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        },
        icon: path.join(__dirname, '../../renderer/assets/app-logo.svg')
    });

   if (process.env.NODE_ENV === 'development') {
       //win.loadURL('https://www.google.com');
       win.loadURL('http://localhost:5173');
       win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
           console.error('Window failed to load:', errorCode, errorDescription);
       });
       win.webContents.on('did-finish-load', () => {
           console.log('Window finished loading!');
       });
       win.webContents.openDevTools();
       console.log('Electron loaded URL: http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../../renderer/dist/index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
