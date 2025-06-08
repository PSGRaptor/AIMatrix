import { app, BrowserWindow, shell, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
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

ipcMain.handle("get-image-files-in-folder", async (_event, folder: string) => {
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
        // Basic filter for common image files. Add more as needed.
        const images = files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
        return images;
    } catch (e) {
        return [];
    }
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

ipcMain.handle("open-output-folder", async (_event, folderPath: string) => {
    if (folderPath && typeof folderPath === "string") {
        await shell.openPath(folderPath);
        return { success: true };
    }
    return { success: false, error: "No folder path provided" };
});
