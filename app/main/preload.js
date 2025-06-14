"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    getTools: () => electron_1.ipcRenderer.invoke("get-tools"),
    listImagesInFolder: (folder) => electron_1.ipcRenderer.invoke("list-images-in-folder", folder),
    runToolTerminal: (cmd, dir, toolName) => electron_1.ipcRenderer.invoke("run-tool-terminal", cmd, dir, toolName),
    openToolWindow: (url) => electron_1.ipcRenderer.invoke("open-tool-window", url),
    openImageViewer: (outputFolder) => electron_1.ipcRenderer.invoke("open-output-folder", outputFolder),
    onToolTerminalData: (callback) => {
        electron_1.ipcRenderer.removeAllListeners("tool-terminal-data");
        electron_1.ipcRenderer.on("tool-terminal-data", (_event, data) => callback(data));
    },
    onToolTerminalExit: (callback) => {
        electron_1.ipcRenderer.removeAllListeners("tool-terminal-exit");
        electron_1.ipcRenderer.on("tool-terminal-exit", (_event, code) => callback(code));
    },
    getImageFilesInFolder: (folder) => electron_1.ipcRenderer.invoke("get-image-files-in-folder", folder),
    readImageFileAsArrayBuffer: (folder, filename) => electron_1.ipcRenderer.invoke("read-image-file-as-array-buffer", folder, filename),
    sendTerminalInput: (toolName, data) => electron_1.ipcRenderer.send("terminal-input", toolName, data),
    killToolProcess: (toolName) => electron_1.ipcRenderer.invoke("kill-tool-process", toolName),
});
