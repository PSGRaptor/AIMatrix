import { contextBridge, ipcRenderer } from "electron";
const { ipcRenderer: ipc, contextBridge: bridge } = require("electron");

// --- Type definitions for tool config ---
export interface ToolConfig {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand: string;
    startCommand: string;
    [key: string]: any; // for optional fields (createdAt, etc.)
}

// --- ElectronAPI Definition ---
const electronAPI = {
    // Tool CRUD
    toolsSave: (tool: ToolConfig) => ipcRenderer.invoke("tools:save", tool),
    toolsDelete: (toolName: string) => ipcRenderer.invoke("tools:delete", toolName),
    getToolIcon: (relPath: string) => ipcRenderer.invoke('get-tool-icon', relPath),

    // Dialogs
    showOpenDialog: (opts: any) => ipcRenderer.invoke("showOpenDialog", opts),

    // List all tools (from app/config/tools or userData/tools, depending on your backend)
    getTools: () => ipcRenderer.invoke("get-tools"),

    // Images & Files
    listImagesInFolder: (folder: string) => ipcRenderer.invoke("list-images-in-folder", folder),
    getImageFilesInFolder: (folder: string) => ipcRenderer.invoke("get-image-files-in-folder", folder),
    readImageFileAsArrayBuffer: (folder: string, filename: string) => ipcRenderer.invoke("read-image-file-as-array-buffer", folder, filename),

    // Tool process/terminal
    runToolTerminal: (cmd: string, dir: string, toolName: string) => ipcRenderer.invoke("run-tool-terminal", cmd, dir, toolName),
    onToolTerminalData: (callback: (data: string) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-data");
        ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },
    onToolTerminalExit: (callback: (code: number) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-exit");
        ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },
    sendTerminalInput: (toolName: string, data: string) => ipcRenderer.send("terminal-input", toolName, data),
    killToolProcess: (toolName: string) => ipcRenderer.invoke("kill-tool-process", toolName),

    // Tool UI and Explorer
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),
    openImageViewer: (outputFolder: string) => ipcRenderer.invoke("open-output-folder", outputFolder),

    // Misc
    getUserDataPath: () => ipcRenderer.invoke("getUserDataPath"),
    getUserDataPathSync: () => ipcRenderer.sendSync("getUserDataPathSync"),
    toolsCopyIcon: (srcPath: string) => ipcRenderer.invoke("tools:copyIcon", srcPath),

    // For general-purpose bridge (rarely needed)
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
};

// Expose in the renderer process
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// --- TypeScript Global Declaration for window.electronAPI ---
declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}
