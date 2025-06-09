// app/main/preload.ts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    // Tools
    getTools: () => ipcRenderer.invoke("get-tools"),
    // Terminal streaming: send (not invoke) for streaming!
    runToolTerminal: (cmd: string, dir: string) => ipcRenderer.send("run-tool-terminal", cmd, dir),
    onToolTerminalData: (callback: (data: string) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-data");
        ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },
    onToolTerminalExit: (callback: (code: number) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-exit");
        ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },

    // Open tool web UI
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),
    // Image handling
    getImageFilesInFolder: (folder: string) => ipcRenderer.invoke("get-image-files-in-folder", folder),
    readImageFileAsArrayBuffer: (folder: string, filename: string) => ipcRenderer.invoke("read-image-file-as-array-buffer", folder, filename),
    // (legacy, open native file manager)
    openImageViewer: (outputFolder: string) => ipcRenderer.invoke("open-output-folder", outputFolder),
});
