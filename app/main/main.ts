import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as child_process from "child_process";
import { loadTools } from "./loadTools";
import http from "http";

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

function waitForUrl(url: string, timeout = 30000): Promise<void> {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        function check() {
            const req = http.get(url, res => {
                if (res.statusCode === 200) {
                    res.resume();
                    resolve();
                } else {
                    res.resume();
                    retry();
                }
            });
            req.on('error', retry);
            function retry() {
                if (Date.now() - start > timeout) {
                    reject(new Error("Timeout waiting for server to start"));
                } else {
                    setTimeout(check, 1000);
                }
            }
        }
        check();
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

/**
 * IPC handler: Returns the list of tools from JSON config.
 */
ipcMain.handle("get-tools", async () => {
    console.log("get-tools called from renderer");
    const tools = loadTools();
    console.log("Tools loaded:", tools); // <--- Add this line!
    const dir = path.join(__dirname, "../../config/tools");
    console.log("Reading tools from:", dir);
    return tools;
    //return loadTools();
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

ipcMain.handle("open-tool-window", async (_event, url: string) => {
    if (!url) return { success: false, error: "No URL provided" };

    try {
        await waitForUrl(url); // waits until the URL is ready!
    } catch (err) {
        return { success: false, error: "Server did not start: " + err };
    }

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
