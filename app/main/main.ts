// app/main/main.ts

console.log("CANARY: Electron main.ts started!", __dirname, process.cwd());
import { app, BrowserWindow, shell, ipcMain, dialog, nativeImage } from "electron";
process.env.ELECTRON_DISABLE_GPU = 'true';
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as pty from "node-pty";

export type ToolConfig = {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand: string;
    startCommand: string;
    createdAt?: string;
    lastModified?: string;
};

const TOOL_DIR = path.join(app.getPath('userData'), "tools");
if (!fs.existsSync(TOOL_DIR)) fs.mkdirSync(TOOL_DIR, { recursive: true });

function ensureDefaultToolCards() {
    const userDir = TOOL_DIR;
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    // Path to bundled default tool cards (inside app folder, unchanged by updates)
    const defaultDir = path.join(process.resourcesPath, "app", "config", "tools");
    if (fs.existsSync(defaultDir)) {
        const userHasCards = fs.readdirSync(userDir).some(f => f.endsWith(".json"));
        if (!userHasCards) {
            // Copy all defaults
            for (const filename of fs.readdirSync(defaultDir)) {
                if (filename.endsWith(".json")) {
                    const from = path.join(defaultDir, filename);
                    const to = path.join(userDir, filename);
                    fs.copyFileSync(from, to);
                }
            }
        }
    }
}

const mime = require("mime");

let mainWindow: BrowserWindow | null = null;
const runningPtys: { [toolName: string]: pty.IPty } = {};

// --- Robust global error handler (fixes 'code' error) ---
process.on("uncaughtException", (err) => {
    const code = (err as any)?.code;
    if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
        console.warn("Ignored terminal error:", code);
        return;
    }
    console.error("Uncaught exception:", err);
});

function getToolCardsFolder() {
    const userDataDir = app.getPath('userData');
    const cardsDir = path.join(userDataDir, 'tools');
    if (!fs.existsSync(cardsDir)) fs.mkdirSync(cardsDir, { recursive: true });
    return cardsDir;
}

// --------- ELECTRON WINDOW ----------
function createWindow() {
    const isDev = process.env.NODE_ENV === "development";

    const iconPath = isDev
        ? path.join(__dirname, '..', '..', 'assets', 'icons', 'aimatrix.ico')
        : path.join(process.resourcesPath, 'assets', 'icons', 'aimatrix.ico');

    const splashPath = isDev
        ? path.join(__dirname, '..', '..', 'assets', 'splash.html')
        : path.join(process.resourcesPath, 'assets', 'splash.html');

    const splashScreen = new BrowserWindow({
        width: 600,
        height: 400,
        frame: false,
        show: true,
        alwaysOnTop: true,
        resizable: false,
        icon: nativeImage.createFromPath(iconPath),
    });

    splashScreen.loadFile(splashPath);

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1280,
        minHeight: 800,
        show: false,
        icon: nativeImage.createFromPath(iconPath),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    const indexPath = isDev
        ? "http://localhost:5173"
        : path.join(__dirname, "..", "..", "dist", "renderer", "index.html");

    if (isDev) {
        console.log("indexPath to load:", indexPath, fs.existsSync(indexPath));
        mainWindow.loadURL(indexPath);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        if (mainWindow) {
            mainWindow.loadFile(indexPath);
        }
    }

    mainWindow.once("ready-to-show", () => {
        splashScreen.destroy();
        mainWindow?.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

console.log('Electron app is starting');

app.whenReady().then(() => {
    ensureDefaultToolCards();
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
    console.log('Electron app killed');
});

app.on("before-quit", () => {
    for (const toolName in runningPtys) {
        try {
            runningPtys[toolName].kill();
        } catch (err: any) {
            const code = (err as any)?.code;
            if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
                console.warn("Suppressed PTY kill error:", code);
            } else {
                throw err;
            }
        }
        delete runningPtys[toolName];
    }
});

// --------- TOOL CRUD HANDLERS ----------

ipcMain.handle("get-tools", async () => {
    if (!fs.existsSync(TOOL_DIR)) return [];
    const files = fs.readdirSync(TOOL_DIR).filter(f => f.endsWith(".json"));
    return files.map(filename => {
        const filePath = path.join(TOOL_DIR, filename);
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data) as ToolConfig;
    });
});

ipcMain.handle("tools:save", async (_event, tool: ToolConfig) => {
    const safeName = tool.name.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const filePath = path.join(TOOL_DIR, `${safeName}.json`);
    tool.lastModified = new Date().toISOString();
    if (!tool.createdAt) tool.createdAt = tool.lastModified;
    fs.writeFileSync(filePath, JSON.stringify(tool, null, 2), "utf-8");
    return true;
});

ipcMain.handle('tools:delete', async (_event, name: string) => {
    const safeName = name.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const filePath = path.join(TOOL_DIR, `${safeName}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return true;
});

ipcMain.handle('showOpenDialog', async (_event, opts) => {
    return await dialog.showOpenDialog(opts || {});
});

ipcMain.handle('tools:copyIcon', async (_event, srcPath: string) => {
    if (!srcPath) throw new Error('No icon selected');
    const iconsDir = path.join(app.getPath('userData'), 'icons');
    if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
    const ext = path.extname(srcPath);
    const destName = `icon_${Date.now()}${ext}`;
    const destPath = path.join(iconsDir, destName);
    fs.copyFileSync(srcPath, destPath);
    return `icons/${destName}`;
});

ipcMain.handle("is-tool-running", (_event, toolName: string) => {
    return !!runningPtys[toolName];
});

ipcMain.handle("get-image-files-in-folder", async (_event, folder) => {
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder)
        .filter(file => /\.(jpg|jpeg|png|webp|bmp|gif|tiff?|tif)$/i.test(file));
});

ipcMain.handle("read-image-file-as-array-buffer", async (_event, folder: string, filename: string) => {
    const fullPath = path.join(folder, filename);
    return fs.readFileSync(fullPath).buffer;
});

ipcMain.handle("list-images-in-folder", async (_event, folder: string) => {
    try {
        const files = fs.readdirSync(folder);
        return files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
    } catch (e) {
        return [];
    }
});

// --------- TERMINAL / TOOL PROCESS HANDLERS ---------

ipcMain.handle("run-tool-terminal", (event, startCommand: string, workingDir: string, toolName: string) => {
    if (runningPtys[toolName]) {
        try {
            runningPtys[toolName].kill();
        } catch (err: any) {
            const code = (err as any)?.code;
            if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
                console.warn("Suppressed PTY kill error:", code);
            } else {
                throw err;
            }
        }
        delete runningPtys[toolName];
    }
    const isWindows = os.platform() === "win32";
    const shell = isWindows ? "cmd.exe" : "bash";
    const shellArgs = isWindows
        ? ["/c", startCommand]
        : ["-c", startCommand];

    const ptyProcess = pty.spawn(shell, shellArgs, {
        name: "xterm-color",
        cwd: workingDir,
        env: process.env,
        cols: 100,
        rows: 40,
    });

    runningPtys[toolName] = ptyProcess;

    ptyProcess.onData(data => {
        event.sender.send("tool-terminal-data", data);
    });
    ptyProcess.onExit(({ exitCode }) => {
        event.sender.send("tool-terminal-exit", exitCode);
        delete runningPtys[toolName];
    });

    // Most node-pty builds do NOT support .on("error") so do NOT add an error listener here!

    return { success: true };
});

ipcMain.on("terminal-input", (_event, toolName: string, data: string) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        try {
            ptyProc.write(data);
        } catch (err: any) {
            const code = (err as any)?.code;
            if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
                console.warn("Suppressed input error:", code);
            } else {
                throw err;
            }
        }
    }
});

ipcMain.handle("open-tool-window", async (_event, url: string) => {
    if (!url) return { success: false, error: "No URL provided" };
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

ipcMain.handle("kill-tool-process", (_event, toolName: string) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        try {
            ptyProc.kill();
        } catch (err: any) {
            const code = (err as any)?.code;
            if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
                console.warn("Suppressed kill error:", code);
            } else {
                throw err;
            }
        }
        delete runningPtys[toolName];
        return { success: true };
    }
    return { success: false, error: "Process not running" };
});

ipcMain.handle('getUserDataPath', async () => app.getPath('userData'));
ipcMain.on('getUserDataPathSync', (event) => {
    event.returnValue = app.getPath('userData');
});

ipcMain.handle('get-tool-icon', async (_event, relPath: string) => {
    if (!relPath) return null;
    const userData = app.getPath('userData');
    const iconPath = path.join(userData, relPath);
    if (!fs.existsSync(iconPath)) return null;
    const ext = path.extname(iconPath).toLowerCase();
    let mime = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
    else if (ext === ".ico") mime = "image/x-icon";
    else if (ext === ".svg") mime = "image/svg+xml";
    else if (ext === ".webp") mime = "image/webp";
    const data = fs.readFileSync(iconPath);
    const base64 = data.toString('base64');
    return `data:${mime};base64,${base64}`;
});

// Add this handler for reading image files as base64
ipcMain.handle("read-image-as-data-url", async (_event, absPath: string) => {
    console.log("read-image-as-data-url executed");
    if (!absPath || !fs.existsSync(absPath)) return null;
    const ext = path.extname(absPath).toLowerCase();
    let mime = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
    else if (ext === ".gif") mime = "image/gif";
    else if (ext === ".bmp") mime = "image/bmp";
    else if (ext === ".webp") mime = "image/webp";
    else if (ext === ".ico") mime = "image/x-icon";
    else if (ext === ".svg") mime = "image/svg+xml";
    const data = fs.readFileSync(absPath);
    return `data:${mime};base64,${data.toString("base64")}`;
});

ipcMain.handle("save-image-data", async (_event, absPath: string, buf: Uint8Array) => {
    console.log("save-image-data executed");
    if (!absPath) return false;
    fs.writeFileSync(absPath, Buffer.from(buf));
    return true;
});

// Use this robust handler for reading images as Data URL
ipcMain.handle("readImageAsDataUrl", async (_event, absPath: string) => {
    console.log("readImageAsDataUrl executed");
    if (!absPath || !fs.existsSync(absPath)) return null;
    try {
        const mimeType = mime.getType(absPath) || "image/png";
        const data = fs.readFileSync(absPath);
        const base64 = data.toString("base64");
        return `data:${mimeType};base64,${base64}`;
    } catch (e) {
        return null;
    }
});

// List subfolders in a given folder (non-recursive, only directories)
ipcMain.handle("listFoldersInFolder", async (_event, folder: string) => {
    try {
        console.log("listFoldersInFolder executed");
        if (!fs.existsSync(folder)) return [];
        return fs.readdirSync(folder)
            .map(name => path.join(folder, name))
            .filter(fullPath => fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory());
    } catch (e) {
        return [];
    }
});

