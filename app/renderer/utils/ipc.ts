export function launchTool(url: string) {
    window.Electron?.ipcRenderer?.invoke("launch-tool", url);
}
export function openTerminal(folderPath: string) {
    window.Electron?.ipcRenderer?.invoke("open-terminal", folderPath);
}
export function openImageViewer(folderPath: string) {
    window.Electron?.ipcRenderer?.invoke("open-image-viewer", folderPath);
}
