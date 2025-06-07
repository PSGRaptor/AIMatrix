import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as child_process from "child_process";
import { loadTools } from "./loadTools";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
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
    } else {
        mainWindow.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

/** Tool config loader (no change) */
//ipcMain.handle("get-tools", async () => loadTools());

ipcMain.handle("get-tools", async () => {
    const tools = loadTools();
    return tools;
});


/** Launches a tool process (.bat, .sh, .exe) and streams terminal output */
ipcMain.handle("run-tool-terminal", (event, startCommand: string, workingDir: string) => {
    // Launch with shell for batch/script support, return live output
    const proc = child_process.spawn(startCommand, {
        cwd: workingDir,
        shell: true,
        detached: false
    });

    proc.stdout.on("data", (data) => {
        event.sender.send("tool-terminal-data", data.toString());
    });
    proc.stderr.on("data", (data) => {
        event.sender.send("tool-terminal-data", data.toString());
    });
    proc.on("close", (code) => {
        event.sender.send("tool-terminal-exit", code);
    });

    return { success: true };
});

/** Opens tool's web UI in a dedicated Electron window */
ipcMain.handle("open-tool-window", async (_event, url: string) => {
    if (!url) return { success: false, error: "No URL provided" };

    const toolWin = new BrowserWindow({
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
