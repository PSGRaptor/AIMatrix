import { app, BrowserWindow } from 'electron';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // Window won't show until "ready-to-show"
    });
    win.loadURL('https://www.google.com');

    // This must be inside the function where 'win' exists!
    win.once('ready-to-show', () => {
        win.show();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
