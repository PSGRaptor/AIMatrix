console.log("CANARY: Electron main.ts started!", __dirname, process.cwd());
import {app, BrowserWindow, shell, ipcMain, dialog} from "electron";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as pty from "node-pty"; // Use node-pty for interactive terminals
import { loadTools } from "./loadTools";

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.disableHardwareAcceleration();

let mainWindow: BrowserWindow | null = null;

// Track running PTY processes per tool name
const runningPtys: { [toolName: string]: pty.IPty } = {};

function createWindow() {
    console.log("Creating Window");
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    if (process.env.NODE_ENV === "development") {
        console.log("Development Build - Loading URL:", "http://localhost:5173");
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        mainWindow.webContents.on('did-finish-load', () => {
            console.log('Window finished loading.');
        });
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Window failed to load:', errorCode, errorDescription);
        });
    } else {
        mainWindow.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
    }
}
console.log('Electron app is starting');
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
    console.log('Electron app killed');
});

app.on("before-quit", () => {
    // Kill all running ptys
    for (const toolName in runningPtys) {
        runningPtys[toolName].kill();
        delete runningPtys[toolName];
    }
});

ipcMain.handle("get-tools", async () => {
    console.log('Tools loaded');
    return loadTools();
});

ipcMain.handle("get-image-files-in-folder", async (_event, folder) => {
    console.log('get-image-files-in-folder');
    if (!fs.existsSync(folder))
        return [];
    return fs.readdirSync(folder)
        .filter(file => /\.(jpg|jpeg|png|webp|bmp|gif|tiff?|tif)$/i.test(file));

});

ipcMain.handle("read-image-file-as-array-buffer", async (_event, folder: string, filename: string) => {
    console.log('read-image-file-as-array-buffer');
    const fullPath = path.join(folder, filename);
       return fs.readFileSync(fullPath).buffer;
});

ipcMain.handle("list-images-in-folder", async (_event, folder: string) => {
    console.log('list-images-in-folder');
    try {
        const files = fs.readdirSync(folder);
        return files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
    } catch (e) {
        return [];
    }
});

// Launches a tool in a PTY and streams output
ipcMain.handle("run-tool-terminal", (event, startCommand: string, workingDir: string, toolName: string) => {
    // Kill any existing PTY for this tool
    if (runningPtys[toolName]) {
        runningPtys[toolName].kill();
        delete runningPtys[toolName];
    }

    // Choose shell (always use cmd.exe for .bat/.cmd, bash for Linux)
    const isWindows = os.platform() === "win32";
    const shell = isWindows ? "cmd.exe" : "bash";
    const shellArgs = isWindows
        ? ["/c", startCommand] // '/c' runs then exits
        : ["-c", startCommand];

    // Spawn the PTY
    const ptyProcess = pty.spawn(shell, shellArgs, {
        name: "xterm-color",
        cwd: workingDir,
        env: process.env,
        cols: 100,
        rows: 40,
    });

    runningPtys[toolName] = ptyProcess;

    // Forward output to renderer
    ptyProcess.onData(data => {
        event.sender.send("tool-terminal-data", data);
    });
    ptyProcess.onExit(({ exitCode }) => {
        event.sender.send("tool-terminal-exit", exitCode);
        delete runningPtys[toolName];
    });

    return { success: true };
});

// Receives input from renderer and writes to PTY
ipcMain.on("terminal-input", (_event, toolName: string, data: string) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        ptyProc.write(data);
    }
});

// Tool UI window (unchanged)
ipcMain.handle("open-tool-window", async (_event, url: string) => {
    if (!url) return { success: false, error: "No URL provided" };
    console.log('Preload path:', path.join(__dirname, "preload.js"));

    const toolWin = new BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });
    toolWin.loadURL(url);
    toolWin.show();
    return { success: true };
});

ipcMain.handle("open-output-folder", async (_event, folderPath: string) => {
    if (folderPath && typeof folderPath === "string") {
        await shell.openPath(folderPath);
        return { success: true };
    }
    return { success: false, error: "No folder path provided" };
});

// Stop a running tool (stop/kill button)
ipcMain.handle("kill-tool-process", (_event, toolName: string) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        ptyProc.kill();
        delete runningPtys[toolName];
        return { success: true };
    }
    return { success: false, error: "Process not running" };
});

ipcMain.handle('getUserDataPath', async () => app.getPath('userData'));

// Optionally expose dialog for renderer to pick icons
ipcMain.handle('showOpenDialog', async () => {
    return await dialog.showOpenDialog({
        title: 'Select Icon',
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg'] }],
        properties: ['openFile']
    });
});

ipcMain.handle('tools:copyIcon', async (_, srcPath: string) => {
    if (!srcPath) throw new Error('No icon selected');
    const iconsDir = path.join(app.getPath('userData'), 'icons');
    if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
    const ext = path.extname(srcPath);
    const destName = `icon_${Date.now()}${ext}`;
    const destPath = path.join(iconsDir, destName);
    fs.copyFileSync(srcPath, destPath);
    // Return relative path
    return `icons/${destName}`;
});