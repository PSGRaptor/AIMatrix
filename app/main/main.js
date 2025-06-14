"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const pty = __importStar(require("node-pty")); // Use node-pty for interactive terminals
const loadTools_1 = require("./loadTools");
let mainWindow = null;
// Track running PTY processes per tool name
const runningPtys = {};
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });
    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
    }
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("before-quit", () => {
    // Kill all running ptys
    for (const toolName in runningPtys) {
        runningPtys[toolName].kill();
        delete runningPtys[toolName];
    }
});
electron_1.ipcMain.handle("get-tools", async () => {
    return (0, loadTools_1.loadTools)();
});
electron_1.ipcMain.handle("get-image-files-in-folder", async (_event, folder) => {
    if (!fs.existsSync(folder))
        return [];
    return fs.readdirSync(folder)
        .filter(file => /\.(jpg|jpeg|png|webp|bmp|gif|tiff?|tif)$/i.test(file));
});
electron_1.ipcMain.handle("read-image-file-as-array-buffer", async (_event, folder, filename) => {
    const fullPath = path.join(folder, filename);
    return fs.readFileSync(fullPath).buffer;
});
electron_1.ipcMain.handle("list-images-in-folder", async (_event, folder) => {
    try {
        const files = fs.readdirSync(folder);
        return files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
    }
    catch (e) {
        return [];
    }
});
// Launches a tool in a PTY and streams output
electron_1.ipcMain.handle("run-tool-terminal", (event, startCommand, workingDir, toolName) => {
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
electron_1.ipcMain.on("terminal-input", (_event, toolName, data) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        ptyProc.write(data);
    }
});
// Tool UI window (unchanged)
electron_1.ipcMain.handle("open-tool-window", async (_event, url) => {
    if (!url)
        return { success: false, error: "No URL provided" };
    const toolWin = new electron_1.BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    toolWin.loadURL(url);
    toolWin.show();
    return { success: true };
});
electron_1.ipcMain.handle("open-output-folder", async (_event, folderPath) => {
    if (folderPath && typeof folderPath === "string") {
        await electron_1.shell.openPath(folderPath);
        return { success: true };
    }
    return { success: false, error: "No folder path provided" };
});
// Stop a running tool (stop/kill button)
electron_1.ipcMain.handle("kill-tool-process", (_event, toolName) => {
    const ptyProc = runningPtys[toolName];
    if (ptyProc) {
        ptyProc.kill();
        delete runningPtys[toolName];
        return { success: true };
    }
    return { success: false, error: "Process not running" };
});
