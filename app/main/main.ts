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
ipcMain.handle("get-tools", async () => {
    const tools = loadTools();
    return tools;
});

/** Image file listing and reading handlers */
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
        const images = files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
        return images;
    } catch (e) {
        return [];
    }
});

/** Run terminal for batch/scripts; stream all output */
ipcMain.on("run-tool-terminal", (event, startCommand: string, workingDir: string) => {
    // Detect .bat or .cmd and wrap with cmd.exe /c for full shell support
    let cmd = startCommand;
    let args: string[] = [];
    if (cmd.endsWith(".bat") || cmd.endsWith(".cmd")) {
        args = ["/c", cmd];
        cmd = "cmd.exe";
    }
    const proc = child_process.spawn(cmd, args, {
        cwd: workingDir,
        shell: false,
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

/** Opens output folder (legacy, safe to keep) */
ipcMain.handle("open-output-folder", async (_event, folderPath: string) => {
    if (folderPath && typeof folderPath === "string") {
        await shell.openPath(folderPath);
        return { success: true };
    }
    return { success: false, error: "No folder path provided" };
});
