import type { ToolConfig, ElectronAPI } from "../env";

// Run the tool's terminal command (start script, etc.)
export async function runToolTerminal(cmd: string, dir: string): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI && window.electronAPI.runToolTerminal) {
        return await window.electronAPI.runToolTerminal(cmd, dir);
    }
    return { success: false, error: "Electron API not available." };
}

// Open a tool's Web UI in a new Electron window
export async function openToolWindow(url: string) {
    if (window.electronAPI && window.electronAPI.openToolWindow) {
        return await window.electronAPI.openToolWindow(url);
    }
    window.open(url, "_blank");
}

// Open a folder (image output) in the system's file explorer
export async function openImageViewer(outputFolder: string) {
    if (window.electronAPI && window.electronAPI.openImageViewer) {
        return await window.electronAPI.openImageViewer(outputFolder);
    }
    alert(`Would open folder: ${outputFolder}`);
}
