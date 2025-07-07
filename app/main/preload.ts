// app/main/preload.ts

import { contextBridge, ipcRenderer } from "electron";
import { join } from "path";
import { readFileSync } from "fs";
/**
 * ToolConfig type for use in method signatures.
 */
export interface ToolConfig {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand: string;
    startCommand: string;
    [key: string]: any; // Allow optional additional fields
}

const packageJsonPath = join(__dirname, "..", "..", "package.json");
let appVersion = "0.0.0";
try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    appVersion = pkg.version;
} catch (e) {
    // fallback or log error
}

/**
 * Exposes a secure Electron API in renderer via contextBridge.
 * All functions map directly to main process handlers and must use
 * the **EXACT channel names** registered in your main.ts handlers.
 * All methods here are safe for renderer use.
 */
const electronAPI = {
    // --- TOOL MANAGEMENT ---
    /**
     * Get all tools.
     * Returns: ToolConfig[]
     */
    getTools: () => ipcRenderer.invoke("get-tools"),

    /**
     * Save/update a tool.
     */
    toolsSave: (tool: ToolConfig) => ipcRenderer.invoke("tools:save", tool),

    /**
     * Delete a tool by name.
     */
    toolsDelete: (toolName: string) => ipcRenderer.invoke("tools:delete", toolName),

    /**
     * Copy an icon to the tool icons dir.
     */
    toolsCopyIcon: (srcPath: string) => ipcRenderer.invoke("tools:copyIcon", srcPath),

    /**
     * Get the full icon path given relative path.
     */
    getToolIcon: (relPath: string) => ipcRenderer.invoke('get-tool-icon', relPath),

    // --- DIALOGS / FILE PICKER ---
    /**
     * Show an open file dialog (for selecting folders, files, etc).
     */
    showOpenDialog: (opts: any) => ipcRenderer.invoke("showOpenDialog", opts),
    startTool: (startCommand: string, workingDir: string) => ipcRenderer.invoke("start-tool", startCommand, workingDir),
    // --- IMAGES & OUTPUT FILES ---
    /**
     * Save image data to a file.
     */
    saveImageData: (absPath: string, buf: Uint8Array) => ipcRenderer.invoke("save-image-data", absPath, buf),

    /**
     * List all image files (old: kept for backward compatibility).
     */
    listImagesInFolder: (folder: string) => ipcRenderer.invoke("list-images-in-folder", folder),

    /**
     * List all subfolders in a folder (for folder picker in viewer).
     */
    listFoldersInFolder: (folder: string) => ipcRenderer.invoke("listFoldersInFolder", folder),

    /**
     * Get image files in a folder (for thumbnail grid).
     */
    getImageFilesInFolder: (folder: string) => ipcRenderer.invoke("get-image-files-in-folder", folder),

    /**
     * Read image as Data URL for browser display.
     */
    readImageAsDataUrl: (absPath: string) => ipcRenderer.invoke("readImageAsDataUrl", absPath),

    /**
     * Read image file as ArrayBuffer (for metadata parsing).
     */
    readImageFileAsArrayBuffer: (folder: string, filename: string) => ipcRenderer.invoke("read-image-file-as-array-buffer", folder, filename),

    // --- TERMINAL / TOOL PROCESS CONTROL ---
    /**
     * Run tool in an embedded terminal (pty).
     */
    runToolTerminal: (cmd: string, dir: string, toolName: string) =>
        ipcRenderer.invoke("run-tool-terminal", cmd, dir, toolName),

    /**
     * Send input to an open terminal session.
     */
    sendTerminalInput: (toolName: string, data: string) =>
        ipcRenderer.send("terminal-input", toolName, data),

    /**
     * Listen for new terminal output lines.
     */
    onToolTerminalData: (callback: (data: string) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-data");
        ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },

    /**
     * Listen for terminal session exit event.
     */
    onToolTerminalExit: (callback: (code: number) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-exit");
        ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },

    /**
     * Check if a tool is running (returns boolean).
     */
    isToolRunning: (toolName: string) => ipcRenderer.invoke("is-tool-running", toolName),

    /**
     * Kill/stop a running tool.
     */
    killToolProcess: (toolName: string) => ipcRenderer.invoke("kill-tool-process", toolName),

    // --- TOOL WINDOW & OUTPUT FOLDER ---
    /**
     * Open a tool's web UI in a new BrowserWindow.
     */
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),

    /**
     * Open image viewer for a tool's output folder.
     */
    openImageViewer: (outputFolder: string) => ipcRenderer.invoke("open-output-folder", outputFolder),

    // --- USER DATA PATH ---
    /**
     * Get Electron's userData directory path (async).
     */
    getUserDataPath: () => ipcRenderer.invoke("getUserDataPath"),

    /**
     * Get Electron's userData directory path (sync).
     */
    getUserDataPathSync: () => ipcRenderer.sendSync("getUserDataPathSync"),

    appInfo: {
        version: appVersion,
    },

    // --- GENERAL PURPOSE (fallback, rarely used) ---
    /**
     * Invoke any channel generically (advanced).
     */
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
};

/**
 * Expose the API in the renderer process.
 */
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
contextBridge.exposeInMainWorld("appInfo", { version: appVersion });

// --- TypeScript Global Declaration for window.electronAPI (for autocompletion and TS safety) ---
declare global {
    interface Window {
        electronAPI: typeof electronAPI;
        //appInfo: { version: string };
    }
}
