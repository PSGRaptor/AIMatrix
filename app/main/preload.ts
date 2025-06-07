import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    getTools: () => ipcRenderer.invoke("get-tools"),
    runToolTerminal: (cmd: string, dir: string) => ipcRenderer.invoke("run-tool-terminal", cmd, dir),
    openToolWindow: (url: string) => ipcRenderer.invoke("open-tool-window", url),
    // Terminal output listeners
    onToolTerminalData: (cb: (data: string) => void) =>
        ipcRenderer.on("tool-terminal-data", (_e, d) => cb(d)),
    onToolTerminalExit: (cb: (code: number) => void) =>
        ipcRenderer.on("tool-terminal-exit", (_e, code) => cb(code))
});
