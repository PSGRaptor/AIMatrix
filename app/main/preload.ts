// app/main/preload.ts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    getTools: () => ipcRenderer.invoke("get-tools"),
    runToolTerminal: (cmd: string, dir: string) => ipcRenderer.invoke("run-tool-terminal", cmd, dir),
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),
    openOutputFolder: (folder: string) => ipcRenderer.invoke("open-output-folder", folder),
    onToolTerminalData: (callback: (data: string) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-data");
        ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },
    onToolTerminalExit: (callback: (code: number) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-exit");
        ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },
});
