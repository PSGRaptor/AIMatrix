// app/main/main.ts

import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import * as child_process from "child_process";
import { loadTools } from "./loadTools";

let mainWindow: BrowserWindow | null = null;
let toolProcess: child_process.ChildProcessWithoutNullStreams | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        //icon: './renderer/assets/app-logo.svg',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
        icon: path.join(__dirname, "../../renderer/assets/app-logo.svg")
    });

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// --- IPC: Get tools ---
ipcMain.handle("get-tools", async () => {
    const tools = loadTools();
    console.log("main.ts get-tools: tools loaded:", tools);
    return tools;
});

// --- IPC: Run Tool in Terminal ---
ipcMain.handle("run-tool-terminal", (event, cmd: string, cwd: string) => {
    if (toolProcess) {
        toolProcess.kill();
        toolProcess = null;
    }
    // Launch process
    toolProcess = child_process.spawn(cmd, {
        cwd,
        shell: true,
        detached: false
    });

    // Send real-time output to renderer
    toolProcess.stdout.on("data", (data: Buffer) => {
        mainWindow?.webContents.send("tool-terminal-data", data.toString());
    });
    toolProcess.stderr.on("data", (data: Buffer) => {
        mainWindow?.webContents.send("tool-terminal-data", data.toString());
    });

    toolProcess.on("exit", (code: number) => {
        mainWindow?.webContents.send("tool-terminal-exit", code);
        toolProcess = null;
    });

    return { success: true };
});

// --- IPC: Open Tool Web UI in Window ---
ipcMain.handle("open-tool-window", (_event, url: string) => {
    if (!url) return { success: false, error: "No URL provided" };
    const toolWin = new BrowserWindow({
        width: 1280, height: 900,
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

// --- IPC: Open Output Folder (Image Viewer) ---
ipcMain.handle("open-output-folder", (_event, folder: string) => {
    if (!folder) return { success: false, error: "No output folder" };
    shell.openPath(folder); // Opens in system file explorer
    return { success: true };
});
