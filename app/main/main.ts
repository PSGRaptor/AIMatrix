import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as child_process from "child_process";
import { loadTools } from "./loadTools";

/**
 * Standard createWindow function (as you already have).
 */
function createWindow() {
    const win = new BrowserWindow({
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
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

/**
 * IPC handler: Returns the list of tools from JSON config.
 */
ipcMain.handle("get-tools", async () => {
    return loadTools();
});

/**
 * IPC handler: Starts a tool by executing its startCommand.
 * startCommand: Full command or path to script/binary.
 * workingDir: Directory in which to launch the command.
 */
ipcMain.handle(
    "start-tool",
    async (_event, startCommand: string, workingDir: string) => {
        try {
            // On Windows: .bat, .exe; On Mac/Linux: .sh or executable
            child_process.spawn(startCommand, {
                cwd: workingDir,
                shell: true,
                detached: true,
                stdio: "ignore"
            });
            return { success: true };
        } catch (err) {
            console.error("Failed to start tool:", err);
            return { success: false, error: String(err) };
        }
    }
);
