import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    getTools: () => ipcRenderer.invoke("get-tools"),
    listImagesInFolder: (folder: string) => ipcRenderer.invoke("list-images-in-folder", folder),
    runToolTerminal: (cmd: string, dir: string, toolName: string) => ipcRenderer.invoke("run-tool-terminal", cmd, dir, toolName),
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),
    openImageViewer: (outputFolder: string) => ipcRenderer.invoke("open-output-folder", outputFolder),
    onToolTerminalData: (callback: (data: string) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-data");
        ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },
    onToolTerminalExit: (callback: (code: number) => void) => {
        ipcRenderer.removeAllListeners("tool-terminal-exit");
        ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },
    getImageFilesInFolder: (folder: string) => ipcRenderer.invoke("get-image-files-in-folder", folder),
    readImageFileAsArrayBuffer: (folder: string, filename: string) => ipcRenderer.invoke("read-image-file-as-array-buffer", folder, filename),
    sendTerminalInput: (toolName: string, data: string) => ipcRenderer.send("terminal-input", toolName, data),
    killToolProcess: (toolName: string) => ipcRenderer.invoke("kill-tool-process", toolName),
});
