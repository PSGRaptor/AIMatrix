import { contextBridge, ipcRenderer } from "electron";

/**
 * Exposes safe APIs for renderer to communicate with main process.
 */
contextBridge.exposeInMainWorld("electronAPI", {
    getTools: () => ipcRenderer.invoke("get-tools"),
    startTool: (startCommand: string, workingDir: string) =>
        ipcRenderer.invoke("start-tool", startCommand, workingDir),
    // Add more as needed (terminal, image viewer, etc)
});
